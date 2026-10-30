/**
 * Indique si une valeur est définie, c'est-à-dire ni `null` ni `undefined`.
 *
 * À utiliser pour retirer les valeurs absentes d'un tableau (`items.filter(isDefined)`) :
 * TypeScript affine alors le type des éléments restants. Contrairement à `Boolean`, les
 * valeurs « falsy » légitimes (`0`, `""`, `false`) sont conservées.
 *
 * @typeParam T - Type de la valeur testée.
 * @param value - Valeur à tester.
 * @returns `true` si `value` n'est ni `null` ni `undefined`.
 * @example
 * ```ts
 * const dueDates = [new Date(2026, 0, 15), undefined, null];
 * dueDates.filter(isDefined); // Date[] : [new Date(2026, 0, 15)]
 * isDefined(0); // true
 * ```
 * @since 0.2.0
 */
export function isDefined<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined;
}
