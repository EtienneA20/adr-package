/**
 * Regroupe les éléments d'un tableau par clé calculée.
 *
 * À utiliser pour afficher une liste par sections (livres par genre, emprunts par adhérent…).
 * Équivalent de `Object.groupBy`, absent d'ES2022. Seules les clés rencontrées sont présentes,
 * d'où le type `Partial`. L'ordre des éléments est conservé dans chaque groupe. Les clés sont
 * stockées comme propriétés propres : une clé `"__proto__"` ne modifie pas le prototype.
 *
 * @typeParam T - Type des éléments.
 * @typeParam K - Type des clés (chaîne, nombre ou symbole).
 * @param items - Tableau à regrouper.
 * @param getKey - Calcule la clé de groupe d'un élément (reçoit aussi son index).
 * @returns Un objet qui associe chaque clé rencontrée au tableau de ses éléments.
 * @example
 * ```ts
 * groupBy(books, (book) => book.genre);
 * // { roman: [germinal, nana], essai: [deuxiemeSexe] }
 * ```
 * @since 0.2.0
 */
export function groupBy<T, K extends PropertyKey>(
  items: readonly T[],
  getKey: (item: T, index: number) => K,
): Partial<Record<K, T[]>> {
  const groups = new Map<K, T[]>();
  items.forEach((item, index) => {
    const key = getKey(item, index);
    const group = groups.get(key);
    if (group) {
      group.push(item);
    } else {
      groups.set(key, [item]);
    }
  });
  return Object.fromEntries(groups) as Partial<Record<K, T[]>>;
}
