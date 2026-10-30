/**
 * Indique si une valeur est une chaîne de caractères primitive.
 *
 * À utiliser pour affiner une valeur de type `unknown` (données JSON, paramètres de requête…)
 * avant de la manipuler comme une chaîne. Les objets `String` (`new String("a")`) sont exclus.
 *
 * @param value - Valeur à tester.
 * @returns `true` si `value` est de type `string`.
 * @example
 * ```ts
 * isString("Les Misérables"); // true
 * isString(42); // false
 * ```
 * @since 0.2.0
 */
export function isString(value: unknown): value is string {
  return typeof value === "string";
}
