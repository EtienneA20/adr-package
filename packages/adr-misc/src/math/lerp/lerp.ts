/**
 * Calcule l'interpolation linéaire entre deux nombres.
 *
 * À utiliser pour une progression proportionnelle : position d'une animation, valeur
 * intermédiaire d'un dégradé, estimation entre deux mesures. `t` n'est pas borné : en dehors
 * de `[0, 1]`, le résultat est extrapolé (combiner avec `clamp` pour l'éviter).
 *
 * @param start - Valeur pour `t = 0`.
 * @param end - Valeur pour `t = 1`.
 * @param t - Progression, en général entre 0 et 1.
 * @returns `start + (end - start) * t`, exactement `start` pour `t = 0` et `end` pour `t = 1`.
 * @example
 * ```ts
 * lerp(0, 100, 0.25); // 25
 * lerp(10, 20, 0.5); // 15
 * lerp(0, 10, 1.5); // 15 (extrapolation)
 * ```
 * @since 0.2.0
 */
export function lerp(start: number, end: number, t: number): number {
  // Forme pondérée (et non `start + (end - start) * t`) : exacte aux deux extrémités.
  return (1 - t) * start + t * end;
}
