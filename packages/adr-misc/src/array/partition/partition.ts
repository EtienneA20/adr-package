/**
 * Sépare un tableau en deux : les éléments qui vérifient le prédicat, puis les autres.
 *
 * À utiliser à la place de deux `filter` opposés (emprunts en cours / rendus, adhérents
 * actifs / inactifs…). Avec un prédicat de type (`item is S`), les deux tableaux sont typés
 * précisément. L'ordre est conservé et le tableau d'origine n'est pas modifié.
 *
 * @typeParam T - Type des éléments.
 * @typeParam S - Sous-type retenu par un prédicat de type.
 * @param items - Tableau à séparer.
 * @param predicate - Prédicat appelé avec l'élément et son index.
 * @returns Un tuple `[pass, fail]` : éléments qui vérifient le prédicat, puis les autres.
 * @example
 * ```ts
 * const [returned, ongoing] = partition(loans, (loan) => loan.returnedAt !== undefined);
 * const [labels, counts] = partition(["a", 1, "b", 2], (value) => typeof value === "string");
 * ```
 * @since 0.2.0
 */
export function partition<T, S extends T>(
  items: readonly T[],
  predicate: (item: T, index: number) => item is S,
): [S[], Exclude<T, S>[]];
/**
 * Sépare un tableau en deux : les éléments qui vérifient le prédicat, puis les autres.
 *
 * @typeParam T - Type des éléments.
 * @param items - Tableau à séparer.
 * @param predicate - Prédicat appelé avec l'élément et son index.
 * @returns Un tuple `[pass, fail]` : éléments qui vérifient le prédicat, puis les autres.
 * @example
 * ```ts
 * const [adults, minors] = partition(members, (member) => member.age >= 18);
 * ```
 * @since 0.2.0
 */
export function partition<T>(
  items: readonly T[],
  predicate: (item: T, index: number) => boolean,
): [T[], T[]];
/**
 * Implémentation commune aux deux signatures.
 *
 * @param items - Tableau à séparer.
 * @param predicate - Prédicat appelé avec l'élément et son index.
 * @returns Le tuple `[pass, fail]`.
 * @example
 * ```ts
 * partition([1, 2, 3], (value) => value > 1); // [[2, 3], [1]]
 * ```
 */
export function partition<T>(
  items: readonly T[],
  predicate: (item: T, index: number) => boolean,
): [T[], T[]] {
  const pass: T[] = [];
  const fail: T[] = [];
  items.forEach((item, index) => {
    (predicate(item, index) ? pass : fail).push(item);
  });
  return [pass, fail];
}
