/**
 * Indique si une valeur est un booléen primitif (`true` ou `false`).
 *
 * À utiliser pour affiner une valeur de type `unknown` (option lue dans un fichier de
 * configuration, champ JSON…). Les chaînes `"true"` / `"false"` et les objets `Boolean` sont
 * exclus.
 *
 * @param value - Valeur à tester.
 * @returns `true` si `value` est de type `boolean`.
 * @example
 * ```ts
 * isBoolean(false); // true
 * isBoolean("true"); // false
 * ```
 * @since 0.2.0
 */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean";
}
