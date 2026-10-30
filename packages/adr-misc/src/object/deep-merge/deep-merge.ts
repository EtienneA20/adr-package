import { isPlainRecord } from "../is-plain-record";
import { isUnsafeKey } from "../unsafe-key";

/**
 * Valeur partielle acceptée par {@link deepMerge} pour un type `T` : les objets simples sont
 * partiels à tous les niveaux, tandis que les tableaux, dates, `Map`, `Set`, expressions
 * régulières et fonctions doivent être fournis en entier (ils remplacent la valeur existante).
 *
 * @typeParam T - Type de l'objet fusionné.
 * @example
 * ```ts
 * const patch: DeepMergePatch<ISettings> = { loans: { maxDays: 21 } };
 * ```
 * @since 0.2.0
 */
export type DeepMergePatch<T> = T extends
  | readonly unknown[]
  | Date
  | RegExp
  | ReadonlyMap<unknown, unknown>
  | ReadonlySet<unknown>
  | ((...args: never[]) => unknown)
  ? T
  : T extends object
    ? { [K in keyof T]?: DeepMergePatch<T[K]> }
    : T;

/**
 * Fusionne une valeur source dans une valeur cible. Seuls deux objets simples sont fusionnés ;
 * un objet simple source sur une cible non fusionnable est recopié (et filtré) à partir de `{}`,
 * ce qui sert aussi à copier la cible au départ (`mergeValues(undefined, target)`).
 *
 * @param target - Valeur existante.
 * @param source - Valeur à fusionner.
 * @returns La valeur fusionnée.
 */
function mergeValues(target: unknown, source: unknown): unknown {
  if (source === undefined) {
    return target;
  }
  if (!isPlainRecord(source)) {
    return source;
  }
  const result: Record<string, unknown> = isPlainRecord(target) ? { ...target } : {};
  for (const [key, value] of Object.entries(source)) {
    if (!isUnsafeKey(key)) {
      result[key] = mergeValues(result[key], value);
    }
  }
  return result;
}

/**
 * Fusionne récursivement une ou plusieurs sources dans une copie de l'objet cible.
 *
 * À utiliser pour appliquer des réglages partiels à une configuration par défaut (options
 * d'un composant, paramètres d'une bibliothèque…). Les objets simples sont fusionnés
 * récursivement ; toute autre valeur (tableau, date, `Map`, instance de classe…) remplace la
 * valeur cible. Les valeurs `undefined` des sources sont ignorées ; les sources sont appliquées
 * dans l'ordre, la dernière l'emporte. Aucun argument n'est modifié : les objets simples (de la
 * cible comme des sources) sont recopiés, les autres valeurs sont reprises par référence. Les clés `__proto__`,
 * `constructor` et `prototype` des sources sont ignorées (protection contre la pollution de
 * prototype, par exemple avec des données issues de `JSON.parse`).
 *
 * @typeParam T - Type de l'objet cible.
 * @param target - Objet de départ, par exemple la configuration par défaut.
 * @param sources - Valeurs partielles à appliquer dans l'ordre.
 * @returns Un nouvel objet fusionné, du type de la cible.
 * @example
 * ```ts
 * const settings = deepMerge(
 *   { loans: { maxDays: 14, maxBooks: 5 }, theme: "clair" },
 *   { loans: { maxDays: 21 } },
 * );
 * // { loans: { maxDays: 21, maxBooks: 5 }, theme: "clair" }
 * ```
 * @since 0.2.0
 */
export function deepMerge<T extends object>(
  target: T,
  ...sources: NoInfer<DeepMergePatch<T>>[]
): T {
  return sources.reduce<unknown>(
    (merged, source) => mergeValues(merged, source),
    mergeValues(undefined, target),
  ) as T;
}
