/**
 * Indique si un tableau contient au moins un élément.
 *
 * À utiliser avant d'accéder au premier élément : avec `noUncheckedIndexedAccess`, TypeScript
 * sait ensuite que `items[0]` est de type `T` et non `T | undefined`.
 *
 * @typeParam T - Type des éléments du tableau.
 * @param value - Tableau à tester.
 * @returns `true` si `value.length > 0`.
 * @example
 * ```ts
 * const loans: Loan[] = findLoans(memberId);
 * if (isNonEmptyArray(loans)) {
 *   loans[0].bookId; // `loans[0]` est de type `Loan`
 * }
 * isNonEmptyArray([]); // false
 * ```
 * @since 0.2.0
 */
export function isNonEmptyArray<T>(value: readonly T[]): value is readonly [T, ...T[]] {
  return value.length > 0;
}
