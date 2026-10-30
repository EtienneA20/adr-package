import { sum } from "../sum";

/**
 * Calcule la moyenne arithmétique d'une liste de nombres.
 *
 * À utiliser pour une moyenne simple (durée moyenne d'emprunt, note moyenne). Une liste vide
 * n'a pas de moyenne : la fonction renvoie `NaN` plutôt que `0`, qui serait une vraie valeur
 * trompeuse ; tester `Number.isNaN` avant d'afficher.
 *
 * @param values - Nombres dont on veut la moyenne.
 * @returns La moyenne, ou `NaN` pour une liste vide.
 * @example
 * ```ts
 * average([12, 15, 18]); // 15
 * average([]); // NaN
 * ```
 * @since 0.2.0
 */
export function average(values: readonly number[]): number {
  return values.length === 0 ? Number.NaN : sum(values) / values.length;
}
