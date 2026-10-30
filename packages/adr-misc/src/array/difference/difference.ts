/**
 * Renvoie les éléments du premier tableau absents du second.
 *
 * À utiliser pour retirer d'une liste les éléments déjà traités (livres déjà empruntés,
 * identifiants déjà sélectionnés…). L'ordre et les doublons du premier tableau sont conservés.
 * Les éléments sont comparés avec `SameValueZero` (comme `Set`), ou par la clé renvoyée par
 * `getKey` pour comparer des objets par identifiant. Aucun tableau n'est modifié.
 *
 * @typeParam T - Type des éléments.
 * @param items - Tableau de départ.
 * @param excluded - Éléments à retirer.
 * @param getKey - Calcule la clé de comparaison d'un élément. Par défaut, l'élément lui-même.
 * @returns Un nouveau tableau avec les éléments de `items` absents de `excluded`.
 * @example
 * ```ts
 * difference([1, 2, 3, 4], [2, 4]); // [1, 3]
 * difference(books, borrowedBooks, (book) => book.id); // livres disponibles
 * ```
 * @since 0.2.0
 */
export function difference<T>(
  items: readonly T[],
  excluded: readonly T[],
  getKey: (item: T) => unknown = (item) => item,
): T[] {
  const excludedKeys = new Set(excluded.map((item) => getKey(item)));
  return items.filter((item) => !excludedKeys.has(getKey(item)));
}
