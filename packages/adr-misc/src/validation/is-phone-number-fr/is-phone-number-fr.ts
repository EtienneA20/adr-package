// Séparateurs de présentation usuels : espaces (y compris insécables), points, tirets.
const SEPARATORS = /[\s.-]/g;
// Préfixe national (0), international (+33) ou international « 00 » (0033), suivi du
// chiffre de zone (1 à 9) et de 8 chiffres.
const PHONE_PATTERN = /^(?:0|\+33|0033)[1-9]\d{8}$/;

/**
 * Indique si une chaîne est un numéro de téléphone français (fixe, mobile ou spécial).
 *
 * À utiliser pour valider un numéro saisi dans un formulaire. Accepte les formats `0X`,
 * `+33 X` et `0033 X`, avec ou sans espaces, points ou tirets de présentation
 * (`06 12 34 56 78`, `06.12.34.56.78`, `+33 6 12 34 56 78`). Le format `+33 (0)6…` est
 * refusé.
 *
 * @param value - Chaîne à tester.
 * @returns `true` si `value` est un numéro français valide, `false` sinon.
 * @example
 * ```ts
 * isPhoneNumberFr("06 12 34 56 78"); // true
 * isPhoneNumberFr("+33 1 23 45 67 89"); // true
 * isPhoneNumberFr("06 12 34 56"); // false (trop court)
 * ```
 * @since 0.2.0
 */
export function isPhoneNumberFr(value: string): boolean {
  return PHONE_PATTERN.test(value.replace(SEPARATORS, ""));
}
