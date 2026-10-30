/**
 * Retire les doublons d'un tableau selon une clé calculée, en conservant le premier élément
 * de chaque clé.
 *
 * À utiliser pour dédoublonner des objets (livres par ISBN, adhérents par e-mail…). Les clés
 * sont comparées avec `SameValueZero` (comme `Set`). Le tableau d'origine n'est pas modifié.
 *
 * @typeParam T - Type des éléments.
 * @param items - Tableau à dédoublonner.
 * @param getKey - Calcule la clé d'un élément (reçoit aussi son index).
 * @returns Un nouveau tableau sans doublon de clé, dans l'ordre des premières occurrences.
 * @example
 * ```ts
 * uniqueBy(books, (book) => book.isbn);
 * uniqueBy(members, (member) => member.email.toLowerCase());
 * ```
 * @since 0.2.0
 */
export function uniqueBy<T>(items: readonly T[], getKey: (item: T, index: number) => unknown): T[] {
  const seen = new Set<unknown>();
  return items.filter((item, index) => {
    const key = getKey(item, index);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}
