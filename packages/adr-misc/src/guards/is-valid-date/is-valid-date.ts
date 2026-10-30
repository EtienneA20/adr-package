/**
 * Indique si une valeur est une instance de `Date` valide (dont l'horodatage n'est pas `NaN`).
 *
 * À utiliser après une conversion (`new Date(saisie)`) pour écarter les dates invalides
 * (`Invalid Date`), qui restent des instances de `Date` mais faussent tous les calculs. Les
 * chaînes et les horodatages numériques sont exclus : les convertir d'abord.
 *
 * @param value - Valeur à tester.
 * @returns `true` si `value` est une `Date` dont `getTime()` n'est pas `NaN`.
 * @example
 * ```ts
 * isValidDate(new Date(2026, 0, 15)); // true
 * isValidDate(new Date("pas une date")); // false
 * isValidDate("2026-01-15"); // false
 * ```
 * @since 0.2.0
 */
export function isValidDate(value: unknown): value is Date {
  return value instanceof Date && !Number.isNaN(value.getTime());
}
