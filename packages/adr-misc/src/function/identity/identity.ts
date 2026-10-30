/**
 * Renvoie la valeur reçue, sans la modifier.
 *
 * À utiliser comme fonction par défaut là où une transformation est attendue (option
 * `format`, `map`, `filter(Boolean)` typé…), ou pour rendre explicite qu'aucune transformation
 * n'est appliquée.
 *
 * @typeParam T - Type de la valeur.
 * @param value - Valeur à renvoyer.
 * @returns `value`, inchangée (même référence pour un objet).
 * @example
 * ```ts
 * function listTitles(books: IBook[], format: (title: string) => string = identity): string[] {
 *   return books.map((book) => format(book.title));
 * }
 *
 * identity(42); // 42
 * ```
 * @since 0.2.0
 */
export function identity<T>(value: T): T {
  return value;
}
