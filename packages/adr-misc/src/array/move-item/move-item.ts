/**
 * Déplace un élément d'une position à une autre et renvoie le nouveau tableau.
 *
 * À utiliser pour réordonner une liste après un glisser-déposer (ordre de lecture, priorité
 * des réservations…). Les autres éléments se décalent pour combler la place libérée. Le
 * tableau d'origine n'est pas modifié.
 *
 * @typeParam T - Type des éléments.
 * @param items - Tableau à réordonner.
 * @param fromIndex - Position actuelle de l'élément (entier de `0` à `items.length - 1`).
 * @param toIndex - Position finale de l'élément (entier de `0` à `items.length - 1`).
 * @returns Un nouveau tableau avec l'élément déplacé.
 * @throws {@link RangeError} Si `fromIndex` ou `toIndex` n'est pas un entier compris entre `0`
 * et `items.length - 1` (donc toujours pour un tableau vide).
 * @example
 * ```ts
 * moveItem(["a", "b", "c", "d"], 0, 2); // ["b", "c", "a", "d"]
 * moveItem(["a", "b", "c", "d"], 3, 1); // ["a", "d", "b", "c"]
 * ```
 * @since 0.2.0
 */
export function moveItem<T>(items: readonly T[], fromIndex: number, toIndex: number): T[] {
  const isValidIndex = (index: number): boolean =>
    Number.isInteger(index) && index >= 0 && index < items.length;
  if (!isValidIndex(fromIndex) || !isValidIndex(toIndex)) {
    throw new RangeError(
      `Index hors bornes : déplacement de ${fromIndex} vers ${toIndex} dans un tableau de ${items.length} élément(s).`,
    );
  }
  const result = [...items];
  result.splice(toIndex, 0, ...result.splice(fromIndex, 1));
  return result;
}
