/**
 * Indique si une valeur est `null` ou `undefined`.
 *
 * À utiliser pour traiter en un seul test une valeur absente, quelle que soit la façon dont
 * elle l'est (champ optionnel, colonne SQL nulle…). Inverse de `isDefined`.
 *
 * @param value - Valeur à tester.
 * @returns `true` si `value` vaut `null` ou `undefined`.
 * @example
 * ```ts
 * isNil(null); // true
 * isNil(undefined); // true
 * isNil(0); // false
 * ```
 * @since 0.2.0
 */
export function isNil(value: unknown): value is null | undefined {
  return value === null || value === undefined;
}
