/**
 * Associe deux tableaux élément par élément en paires `[a, b]`.
 *
 * À utiliser pour parcourir deux listes parallèles (libellés et valeurs, en-têtes et cellules
 * d'une ligne CSV…). Comme en Python, le résultat s'arrête au tableau le plus court : aucune
 * paire ne contient de `undefined` ajouté. Aucun tableau n'est modifié.
 *
 * @typeParam A - Type des éléments du premier tableau.
 * @typeParam B - Type des éléments du second tableau.
 * @param first - Premier tableau.
 * @param second - Second tableau.
 * @returns Un nouveau tableau de paires, de la longueur du tableau le plus court.
 * @example
 * ```ts
 * zip(["Titre", "Auteur"], ["Germinal", "Zola"]); // [["Titre", "Germinal"], ["Auteur", "Zola"]]
 * zip([1, 2, 3], ["a"]); // [[1, "a"]]
 * ```
 * @since 0.2.0
 */
export function zip<A, B>(first: readonly A[], second: readonly B[]): [A, B][] {
  const length = Math.min(first.length, second.length);
  return Array.from({ length }, (_, index) => [first[index] as A, second[index] as B]);
}
