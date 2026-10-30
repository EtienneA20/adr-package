/**
 * Découpe un tableau en paquets de taille fixe ; le dernier paquet peut être plus court.
 *
 * À utiliser pour paginer une liste côté client, afficher une grille ligne par ligne ou
 * envoyer des requêtes par lots. Le tableau d'origine n'est pas modifié.
 *
 * @typeParam T - Type des éléments.
 * @param items - Tableau à découper.
 * @param size - Nombre d'éléments par paquet (entier supérieur ou égal à 1).
 * @returns Un nouveau tableau de paquets (vide si `items` est vide).
 * @throws {@link RangeError} Si `size` n'est pas un entier supérieur ou égal à 1.
 * @example
 * ```ts
 * chunk([1, 2, 3, 4, 5], 2); // [[1, 2], [3, 4], [5]]
 * ```
 * @since 0.2.0
 */
export function chunk<T>(items: readonly T[], size: number): T[][] {
  if (!Number.isInteger(size) || size < 1) {
    throw new RangeError(
      `La taille des paquets doit être un entier supérieur ou égal à 1 (reçu : ${size}).`,
    );
  }
  const chunks: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}
