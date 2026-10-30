/**
 * Additionne une valeur numérique extraite de chaque élément d'une liste.
 *
 * À utiliser pour totaliser une propriété d'objets (montant des pénalités, nombre de pages,
 * quantité en stock) sans passer par `map` puis `reduce`.
 *
 * @typeParam T - Type des éléments de la liste.
 * @param items - Éléments à parcourir.
 * @param getValue - Fonction qui renvoie la valeur à additionner pour un élément (reçoit
 * aussi son index).
 * @returns La somme des valeurs, ou `0` pour une liste vide.
 * @example
 * ```ts
 * const fines = [{ amount: 1.5 }, { amount: 3 }];
 * sumBy(fines, (fine) => fine.amount); // 4.5
 * ```
 * @since 0.2.0
 */
export function sumBy<T>(
  items: readonly T[],
  getValue: (item: T, index: number) => number,
): number {
  return items.reduce((total, item, index) => total + getValue(item, index), 0);
}
