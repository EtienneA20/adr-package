/** Longueur maximale d'une adresse électronique (RFC 5321). */
const MAX_EMAIL_LENGTH = 254;

// Volontairement pragmatique (et non conforme à toute la RFC 5322) : partie locale ASCII sans
// guillemets, domaine avec au moins un point et une extension alphabétique. Les adresses
// exotiques mais valides (`"a b"@x.fr`, IP littérale) sont refusées, comme dans la plupart des
// formulaires.
const EMAIL_PATTERN =
  /^(?!\.)(?!.*\.\.)[\w!#$%&'*+/=?^`{|}~.-]{1,64}(?<!\.)@(?:[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?\.)+[a-z]{2,63}$/i;

/**
 * Indique si une chaîne est une adresse électronique syntaxiquement valide.
 *
 * À utiliser pour valider un champ de formulaire ou une donnée importée avant envoi. La
 * vérification est syntaxique : elle ne garantit pas que la boîte existe. Les espaces ne sont
 * pas tolérés (appeler `trim()` avant si besoin).
 *
 * @param value - Chaîne à tester.
 * @returns `true` si `value` est une adresse électronique valide, `false` sinon.
 * @example
 * ```ts
 * isEmail("lecteur@bibliotheque.fr"); // true
 * isEmail("lecteur@bibliotheque"); // false (pas d'extension)
 * isEmail("lecteur..dupont@bibliotheque.fr"); // false (points consécutifs)
 * ```
 * @since 0.2.0
 */
export function isEmail(value: string): boolean {
  return value.length <= MAX_EMAIL_LENGTH && EMAIL_PATTERN.test(value);
}
