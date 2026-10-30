const NIL_UUID = "00000000-0000-0000-0000-000000000000";
const MAX_UUID = "ffffffff-ffff-ffff-ffff-ffffffffffff";

/**
 * Indique si une chaîne est un UUID (RFC 9562) au format canonique `8-4-4-4-12`.
 *
 * À utiliser pour valider un identifiant reçu d'une route ou d'une API avant de l'utiliser.
 * Sans `version`, accepte les versions 1 à 8 (variante RFC), ainsi que l'UUID nul et l'UUID
 * maximal. Avec `version`, n'accepte que cette version. La casse est indifférente ; les
 * accolades et les espaces sont refusés.
 *
 * @param value - Chaîne à tester.
 * @param version - Version attendue (1 à 8). Omise : toute version.
 * @returns `true` si `value` est un UUID valide (de la version demandée), `false` sinon.
 * @example
 * ```ts
 * isUuid("9b2c6f4e-3d1a-4f6b-8c2d-1e5f7a9b0c3d"); // true
 * isUuid("9b2c6f4e-3d1a-4f6b-8c2d-1e5f7a9b0c3d", 7); // false (c'est une v4)
 * isUuid("9b2c6f4e3d1a4f6b8c2d1e5f7a9b0c3d"); // false (tirets absents)
 * ```
 * @since 0.2.0
 */
export function isUuid(value: string, version?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8): boolean {
  const lower = value.toLowerCase();
  if (version === undefined && (lower === NIL_UUID || lower === MAX_UUID)) {
    return true;
  }
  const versionDigit = version === undefined ? "1-8" : String(version);
  const pattern = new RegExp(
    String.raw`^[\da-f]{8}-[\da-f]{4}-[${versionDigit}][\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$`,
  );
  return pattern.test(lower);
}
