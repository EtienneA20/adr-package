/**
 * Additionne une liste de nombres.
 *
 * À utiliser pour un total simple (montants, quantités). Pour additionner une propriété
 * d'objets, utiliser `sumBy`. Le résultat suit l'arithmétique flottante de JavaScript :
 * l'arrondir avec `round` avant affichage (`0.1 + 0.2` vaut `0.30000000000000004`).
 *
 * @param values - Nombres à additionner.
 * @returns La somme, ou `0` pour une liste vide.
 * @example
 * ```ts
 * sum([12, 8.5, 3]); // 23.5
 * sum([]); // 0
 * ```
 * @since 0.2.0
 */
export function sum(values: readonly number[]): number {
  return values.reduce((total, value) => total + value, 0);
}
