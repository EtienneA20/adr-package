const HEX_COLOR_PATTERN = /^#(?:[\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$/i;

/**
 * Indique si une chaîne est une couleur hexadécimale CSS (`#RGB`, `#RGBA`, `#RRGGBB` ou
 * `#RRGGBBAA`).
 *
 * À utiliser pour valider une couleur saisie par un utilisateur (thème, étiquette) avant de
 * l'enregistrer. Le `#` est obligatoire ; la casse est indifférente.
 *
 * @param value - Chaîne à tester.
 * @returns `true` si `value` est une couleur hexadécimale valide, `false` sinon.
 * @example
 * ```ts
 * isHexColor("#1e90ff"); // true
 * isHexColor("#FFF"); // true
 * isHexColor("1e90ff"); // false (sans #)
 * ```
 * @since 0.2.0
 */
export function isHexColor(value: string): boolean {
  return HEX_COLOR_PATTERN.test(value);
}
