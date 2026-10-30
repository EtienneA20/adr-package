/**
 * Tire un nombre décimal au hasard dans l'intervalle `[min, max)` (max exclu).
 *
 * À utiliser pour des valeurs continues : position, durée simulée, jeu de données de
 * démonstration. Le générateur est injectable pour rendre le tirage reproductible. Non adapté
 * à un usage sensible : `Math.random` n'est pas cryptographiquement sûr.
 *
 * @param min - Borne inférieure (incluse).
 * @param max - Borne supérieure (exclue, sauf si égale à `min`).
 * @param random - Générateur de nombres dans `[0, 1)`.
 * @defaultValue `random` : `Math.random`
 * @returns Un nombre `x` tel que `min ≤ x < max` (ou `min` si `min === max`).
 * @throws {@link RangeError} Si une borne n'est pas un nombre fini ou si `min > max`.
 * @example
 * ```ts
 * randomFloat(0, 1); // par exemple 0.4271…
 * randomFloat(10, 20, () => 0.5); // 15
 * ```
 * @since 0.2.0
 */
export function randomFloat(
  min: number,
  max: number,
  random: () => number = () => Math.random(),
): number {
  if (!Number.isFinite(min) || !Number.isFinite(max) || min > max) {
    throw new RangeError(
      `Bornes invalides : deux nombres finis tels que min ≤ max sont attendus (reçu : ${min} et ${max}).`,
    );
  }
  return min + random() * (max - min);
}
