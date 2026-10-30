/**
 * Renvoie les éléments du premier tableau également présents dans le second, sans doublon.
 *
 * À utiliser pour trouver les éléments communs à deux listes (livres réservés et disponibles,
 * droits communs à deux rôles…). L'ordre suit le premier tableau. Les éléments sont comparés
 * avec `SameValueZero` (comme `Set`), ou par la clé renvoyée par `getKey` pour comparer des
 * objets par identifiant ; l'élément conservé est celui du premier tableau. Aucun tableau
 * n'est modifié.
 *
 * @typeParam T - Type des éléments.
 * @param items - Tableau de référence (ordre et éléments renvoyés).
 * @param others - Tableau avec lequel chercher les éléments communs.
 * @param getKey - Calcule la clé de comparaison d'un élément. Par défaut, l'élément lui-même.
 * @returns Un nouveau tableau des éléments communs, sans doublon.
 * @example
 * ```ts
 * intersection([1, 2, 2, 3], [2, 3, 4]); // [2, 3]
 * intersection(reservedBooks, availableBooks, (book) => book.id);
 * ```
 * @since 0.2.0
 */
export function intersection<T>(
  items: readonly T[],
  others: readonly T[],
  getKey: (item: T) => unknown = (item) => item,
): T[] {
  const otherKeys = new Set(others.map((item) => getKey(item)));
  const seen = new Set<unknown>();
  return items.filter((item) => {
    const key = getKey(item);
    if (!otherKeys.has(key) || seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}
