import { extremeBy } from "../extreme-by";

/**
 * Renvoie l'élément dont la valeur extraite est la plus petite.
 *
 * À utiliser pour trouver un élément (et non seulement la valeur minimale) : l'emprunt le plus
 * ancien, le livre le moins cher, l'adhérent le plus jeune. En cas d'égalité, le premier
 * élément est renvoyé ; les valeurs `NaN` sont ignorées.
 *
 * @typeParam T - Type des éléments.
 * @param items - Éléments à parcourir.
 * @param getValue - Fonction qui renvoie la valeur à comparer pour un élément.
 * @returns L'élément de plus petite valeur, ou `undefined` pour une liste vide.
 * @example
 * ```ts
 * const books = [
 *   { title: "Germinal", price: 8 },
 *   { title: "Nana", price: 6.5 },
 * ];
 * minBy(books, (book) => book.price); // { title: "Nana", price: 6.5 }
 * minBy([], () => 0); // undefined
 * ```
 * @since 0.2.0
 */
export function minBy<T>(items: readonly T[], getValue: (item: T) => number): T | undefined {
  return extremeBy(items, getValue, (candidate, best) => candidate < best);
}
