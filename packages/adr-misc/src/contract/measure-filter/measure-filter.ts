import type { IListQueryLimits } from "../list-query-limits";

/** Limite de l'arbre de filtre dépassée, avec le message à renvoyer au client. */
export interface IFilterLimitViolation {
  /** Limite dépassée. */
  readonly limit: "maxDepth" | "maxConditions";
  /** Message en français. */
  readonly message: string;
}

const GROUP_KEYS = ["and", "or", "not"] as const;

// Enfants d'un nœud de groupe, ou `undefined` si le nœud n'est pas un groupe.
function groupChildren(node: unknown): unknown[] | undefined {
  if (typeof node !== "object" || node === null) return undefined;
  const key = GROUP_KEYS.find((candidate) => Object.hasOwn(node, candidate));
  if (key === undefined) return undefined;
  const children = (node as Record<string, unknown>)[key];
  return Array.isArray(children) ? (children as unknown[]) : [children];
}

/**
 * Vérifie la profondeur et le nombre de conditions d'un arbre de filtre **avant** sa
 * validation détaillée.
 *
 * Pourquoi avant : la validation zod est récursive ; mesurer d'abord, sans récursion et en
 * s'arrêtant au premier dépassement, évite qu'un arbre très profond ou très large envoyé par
 * un client ne coûte cher (ou ne fasse déborder la pile) avant d'être refusé. Tout nœud qui
 * n'est pas un groupe compte comme une condition, valide ou non.
 *
 * @param input - Arbre de filtre non validé.
 * @param limits - Limites `maxDepth` et `maxConditions`.
 * @returns La première limite dépassée, ou `undefined`.
 * @example
 * ```ts
 * measureFilter({ not: { not: { not: { not: cond } } } }, limits)?.limit; // "maxDepth"
 * ```
 * @internal
 */
export function measureFilter(
  input: unknown,
  limits: Pick<IListQueryLimits, "maxDepth" | "maxConditions">,
): IFilterLimitViolation | undefined {
  const stack: [unknown, number][] = [[input, 0]];
  let conditions = 0;
  for (let entry = stack.pop(); entry; entry = stack.pop()) {
    const [node, depth] = entry;
    const children = groupChildren(node);
    if (!children) {
      conditions += 1;
      if (conditions > limits.maxConditions) {
        return {
          limit: "maxConditions",
          message: `Le filtre dépasse ${limits.maxConditions} conditions.`,
        };
      }
    } else if (depth + 1 > limits.maxDepth) {
      return {
        limit: "maxDepth",
        message: `Le filtre dépasse ${limits.maxDepth} niveaux de groupes imbriqués.`,
      };
    } else {
      for (const child of children) stack.push([child, depth + 1]);
    }
  }
  return undefined;
}
