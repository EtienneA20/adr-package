/**
 * Compte les éléments d'un tableau par clé calculée.
 *
 * À utiliser pour produire des statistiques simples (nombre de livres par genre, d'emprunts
 * par statut…). Seules les clés rencontrées sont présentes dans le résultat, d'où le type
 * `Partial`. Les clés sont stockées comme propriétés propres : une clé `"__proto__"` ne
 * modifie pas le prototype du résultat.
 *
 * @typeParam T - Type des éléments.
 * @typeParam K - Type des clés (chaîne, nombre ou symbole).
 * @param items - Tableau à analyser.
 * @param getKey - Calcule la clé d'un élément (reçoit aussi son index).
 * @returns Un objet qui associe chaque clé rencontrée à son nombre d'occurrences.
 * @example
 * ```ts
 * countBy(books, (book) => book.genre); // { roman: 2, essai: 1 }
 * ```
 * @since 0.2.0
 */
export function countBy<T, K extends PropertyKey>(
  items: readonly T[],
  getKey: (item: T, index: number) => K,
): Partial<Record<K, number>> {
  const counts = new Map<K, number>();
  items.forEach((item, index) => {
    const key = getKey(item, index);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  });
  return Object.fromEntries(counts) as Partial<Record<K, number>>;
}
