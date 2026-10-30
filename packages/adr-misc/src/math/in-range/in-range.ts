import { assertRange } from "../assert-range";

/**
 * Indique si un nombre appartient à l'intervalle `[min, max]`, **bornes incluses**.
 *
 * À utiliser pour tester une tranche : âge d'un adhérent pour un tarif, nombre de jours de
 * retard pour un palier de pénalité, note dans un barème…
 *
 * @param value - Nombre à tester. `NaN` n'appartient à aucun intervalle.
 * @param min - Borne inférieure (incluse).
 * @param max - Borne supérieure (incluse).
 * @returns `true` si `min ≤ value ≤ max`.
 * @throws {@link RangeError} Si `min > max` ou si l'une des bornes vaut `NaN`.
 * @example
 * ```ts
 * inRange(18, 18, 25); // true (bornes incluses)
 * inRange(25, 18, 25); // true
 * inRange(26, 18, 25); // false
 * ```
 * @since 0.2.0
 */
export function inRange(value: number, min: number, max: number): boolean {
  assertRange(min, max);
  return value >= min && value <= max;
}
