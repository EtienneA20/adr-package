/**
 * Vérifie que deux bornes forment un intervalle valide (`min ≤ max`, sans `NaN`).
 *
 * Partagé par `clamp` et `inRange` pour qu'ils lèvent exactement la même erreur.
 *
 * @param min - Borne inférieure.
 * @param max - Borne supérieure.
 * @throws {@link RangeError} Si `min > max` ou si l'une des bornes vaut `NaN`.
 * @internal
 */
export function assertRange(min: number, max: number): void {
  // `!(min <= max)` (et non `min > max`) pour rejeter aussi `NaN`.
  if (!(min <= max)) {
    throw new RangeError(
      `Bornes invalides : min (${min}) doit être inférieur ou égal à max (${max}).`,
    );
  }
}
