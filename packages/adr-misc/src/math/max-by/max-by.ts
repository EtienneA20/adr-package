import { extremeBy } from "../extreme-by";

/**
 * Renvoie l'élément dont la valeur extraite est la plus grande.
 *
 * À utiliser pour trouver un élément (et non seulement la valeur maximale) : le retard le plus
 * long, le livre le plus emprunté, l'adhérent le plus actif. En cas d'égalité, le premier
 * élément est renvoyé ; les valeurs `NaN` sont ignorées.
 *
 * @typeParam T - Type des éléments.
 * @param items - Éléments à parcourir.
 * @param getValue - Fonction qui renvoie la valeur à comparer pour un élément.
 * @returns L'élément de plus grande valeur, ou `undefined` pour une liste vide.
 * @example
 * ```ts
 * const loans = [
 *   { bookId: "b1", daysLate: 3 },
 *   { bookId: "b2", daysLate: 12 },
 * ];
 * maxBy(loans, (loan) => loan.daysLate); // { bookId: "b2", daysLate: 12 }
 * maxBy([], () => 0); // undefined
 * ```
 * @since 0.2.0
 */
export function maxBy<T>(items: readonly T[], getValue: (item: T) => number): T | undefined {
  return extremeBy(items, getValue, (candidate, best) => candidate > best);
}
