/**
 * Ajoute un élément à un tableau s'il en est absent, ou le retire s'il est présent.
 *
 * À utiliser pour gérer une sélection multiple (cases à cocher, filtres actifs, livres
 * sélectionnés…). L'élément ajouté est placé à la fin ; s'il est présent, toutes ses
 * occurrences sont retirées. Les éléments sont comparés avec `SameValueZero`, ou par la clé
 * renvoyée par `getKey` pour comparer des objets par identifiant. Le tableau d'origine n'est
 * pas modifié.
 *
 * @typeParam T - Type des éléments.
 * @param items - Tableau de départ (la sélection courante).
 * @param item - Élément à ajouter ou retirer.
 * @param getKey - Calcule la clé de comparaison d'un élément. Par défaut, l'élément lui-même.
 * @returns Un nouveau tableau avec l'élément ajouté ou retiré.
 * @example
 * ```ts
 * toggleItem(["roman", "essai"], "essai"); // ["roman"]
 * toggleItem(["roman"], "bd"); // ["roman", "bd"]
 * toggleItem(selectedBooks, book, (candidate) => candidate.id);
 * ```
 * @since 0.2.0
 */
export function toggleItem<T>(
  items: readonly T[],
  item: T,
  getKey: (item: T) => unknown = (value) => value,
): T[] {
  const key = getKey(item);
  const remaining = items.filter((candidate) => {
    const candidateKey = getKey(candidate);
    return !(candidateKey === key || Object.is(candidateKey, key));
  });
  return remaining.length === items.length ? [...items, item] : remaining;
}
