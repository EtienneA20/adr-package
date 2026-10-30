import { round } from "../round";

/**
 * Calcule le pourcentage que représente une valeur par rapport à un total.
 *
 * À utiliser pour un taux (livres empruntés sur le fonds, adhérents en retard, objectif
 * atteint). Un total nul ne permet pas de calculer de pourcentage : la fonction renvoie alors
 * `0` (et non `NaN` ou `Infinity`), ce qui convient à l'affichage d'une jauge vide.
 *
 * @param value - Partie du total.
 * @param total - Total de référence (100 %).
 * @param decimals - Nombre de décimales du résultat (voir `round`). Sans valeur, le résultat
 * n'est pas arrondi.
 * @returns Le pourcentage (`25` pour 25 %, pas `0.25`), ou `0` si `total` vaut `0`.
 * @throws {@link RangeError} Si `decimals` est fourni mais n'est pas un entier.
 * @example
 * ```ts
 * percentage(30, 120); // 25
 * percentage(1, 3, 1); // 33.3
 * percentage(5, 0); // 0
 * ```
 * @since 0.2.0
 */
export function percentage(value: number, total: number, decimals?: number): number {
  if (total === 0) {
    return 0;
  }
  const ratio = (value / total) * 100;
  return decimals === undefined ? ratio : round(ratio, decimals);
}
