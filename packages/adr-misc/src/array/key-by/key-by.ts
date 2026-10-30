/**
 * Indexe les éléments d'un tableau par clé calculée.
 *
 * À utiliser pour accéder rapidement à un élément par identifiant (`booksById[id]`) au lieu de
 * chercher dans le tableau à chaque fois. Si plusieurs éléments ont la même clé, le dernier
 * l'emporte. Seules les clés rencontrées sont présentes, d'où le type `Partial`. Les clés sont
 * stockées comme propriétés propres : une clé `"__proto__"` ne modifie pas le prototype.
 *
 * @typeParam T - Type des éléments.
 * @typeParam K - Type des clés (chaîne, nombre ou symbole).
 * @param items - Tableau à indexer.
 * @param getKey - Calcule la clé d'un élément (reçoit aussi son index).
 * @returns Un objet qui associe chaque clé au dernier élément qui la porte.
 * @example
 * ```ts
 * const booksById = keyBy(books, (book) => book.id);
 * booksById["b-42"]?.title; // "Germinal"
 * ```
 * @since 0.2.0
 */
export function keyBy<T, K extends PropertyKey>(
  items: readonly T[],
  getKey: (item: T, index: number) => K,
): Partial<Record<K, T>> {
  return Object.fromEntries(
    items.map((item, index) => [getKey(item, index), item] as const),
  ) as Partial<Record<K, T>>;
}
