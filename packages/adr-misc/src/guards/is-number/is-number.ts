/**
 * Indique si une valeur est un nombre exploitable, c'est-à-dire de type `number` et différent
 * de `NaN`.
 *
 * À utiliser pour affiner une valeur de type `unknown` avant un calcul. `NaN` est exclu car il
 * résulte presque toujours d'une conversion ratée ; `Infinity` et `-Infinity` sont acceptés
 * (utiliser `Number.isFinite` pour les exclure). Les `bigint` et les objets `Number` sont
 * exclus.
 *
 * @param value - Valeur à tester.
 * @returns `true` si `value` est de type `number` et n'est pas `NaN`.
 * @example
 * ```ts
 * isNumber(3.5); // true
 * isNumber(Number("abc")); // false (NaN)
 * isNumber("3"); // false
 * ```
 * @since 0.2.0
 */
export function isNumber(value: unknown): value is number {
  return typeof value === "number" && !Number.isNaN(value);
}
