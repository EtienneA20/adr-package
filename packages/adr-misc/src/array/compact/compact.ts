/**
 * Retire d'un tableau les valeurs « falsy » : `null`, `undefined`, `false`, `0`, `0n`, `""`
 * et `NaN`.
 *
 * À utiliser pour nettoyer une liste construite conditionnellement (classes CSS, filtres
 * optionnels, résultats de `map` qui renvoient `undefined`…). Le type des éléments est affiné.
 * Attention : `0` et `""` sont aussi retirés ; pour ne retirer que `null` et `undefined`,
 * filtrer avec une garde dédiée. Le tableau d'origine n'est pas modifié.
 *
 * @typeParam T - Type des éléments.
 * @param items - Tableau à nettoyer.
 * @returns Un nouveau tableau sans les valeurs falsy.
 * @example
 * ```ts
 * compact(["roman", null, "", undefined, "policier"]); // ["roman", "policier"]
 * compact([0, 1, false, 2, Number.NaN]); // [1, 2]
 * ```
 * @since 0.2.0
 */
export function compact<T>(
  items: readonly T[],
): Exclude<T, null | undefined | false | 0 | 0n | "">[] {
  return items.filter((item): item is Exclude<T, null | undefined | false | 0 | 0n | ""> =>
    Boolean(item),
  );
}
