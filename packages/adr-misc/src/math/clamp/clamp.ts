import { assertRange } from "../assert-range";

/**
 * Contraint un nombre dans l'intervalle `[min, max]` (bornes incluses).
 *
 * À utiliser pour borner une saisie ou un résultat de calcul : quantité commandée, page
 * demandée, note sur 5, pourcentage d'une barre de progression…
 *
 * @param value - Nombre à contraindre. `NaN` est renvoyé tel quel.
 * @param min - Borne inférieure (incluse).
 * @param max - Borne supérieure (incluse).
 * @returns `min` si `value < min`, `max` si `value > max`, sinon `value`.
 * @throws {@link RangeError} Si `min > max` ou si l'une des bornes vaut `NaN`.
 * @example
 * ```ts
 * clamp(12, 1, 10); // 10
 * clamp(-3, 0, 5); // 0
 * clamp(4, 0, 5); // 4
 * ```
 * @since 0.2.0
 */
export function clamp(value: number, min: number, max: number): number {
  assertRange(min, max);
  return Math.min(Math.max(value, min), max);
}
