import { average } from "../average";

/**
 * Calcule la médiane d'une liste de nombres (valeur centrale une fois triée).
 *
 * À utiliser à la place de la moyenne quand quelques valeurs extrêmes faussent le résultat
 * (durée d'emprunt avec quelques retards de plusieurs mois). Pour un nombre pair d'éléments,
 * renvoie la moyenne des deux valeurs centrales. La liste n'est pas modifiée.
 *
 * @param values - Nombres dont on veut la médiane, dans n'importe quel ordre.
 * @returns La médiane, ou `NaN` pour une liste vide.
 * @example
 * ```ts
 * median([3, 1, 2]); // 2
 * median([10, 2, 4, 6]); // 5
 * median([]); // NaN
 * ```
 * @since 0.2.0
 */
export function median(values: readonly number[]): number {
  const sorted = [...values].sort((first, second) => first - second);
  // Tranche des valeurs centrales : un élément (taille impaire) ou deux (taille paire), aucun
  // pour une liste vide (la moyenne vaut alors NaN). Évite tout accès indexé `T | undefined`.
  const start = Math.max(Math.ceil(sorted.length / 2) - 1, 0);
  const end = Math.floor(sorted.length / 2) + 1;
  return average(sorted.slice(start, end));
}
