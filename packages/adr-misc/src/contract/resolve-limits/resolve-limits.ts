import { DEFAULT_LIST_QUERY_LIMITS, type IListQueryLimits } from "../list-query-limits";

/**
 * Complète les limites d'un contrat de liste avec les valeurs par défaut et les vérifie.
 *
 * Vérifiées à la définition du contrat (au chargement du module) : une erreur de configuration
 * apparaît au démarrage, pas à la première requête.
 *
 * @param limits - Surcharge partielle des limites.
 * @returns Les limites complètes, figées.
 * @throws {@link RangeError} Si une limite n'est pas un entier strictement positif.
 * @example
 * ```ts
 * resolveLimits({ maxDepth: 4 }).maxConditions; // 20
 * ```
 * @internal
 */
export function resolveLimits(limits: Partial<IListQueryLimits> = {}): Readonly<IListQueryLimits> {
  const resolved = { ...DEFAULT_LIST_QUERY_LIMITS, ...limits };
  for (const [key, value] of Object.entries(resolved)) {
    if (!Number.isInteger(value) || value <= 0) {
      throw new RangeError(
        `La limite « ${key} » doit être un entier strictement positif (reçu : ${String(value)}).`,
      );
    }
  }
  return Object.freeze(resolved);
}
