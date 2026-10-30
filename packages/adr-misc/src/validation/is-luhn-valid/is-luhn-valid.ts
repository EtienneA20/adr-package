const DIGITS_PATTERN = /^\d{2,}$/;

/**
 * Indique si une suite de chiffres respecte l'algorithme de Luhn (clé « modulo 10 »).
 *
 * À utiliser pour contrôler un numéro de carte bancaire, un SIREN, un SIRET ou un IMEI
 * avant un traitement plus coûteux. Les espaces de présentation sont ignorés ; tout autre
 * caractère rend la chaîne invalide. Il faut au moins deux chiffres (une donnée et sa clé).
 *
 * @param value - Suite de chiffres à contrôler, espaces tolérés.
 * @returns `true` si la clé de Luhn est correcte, `false` sinon.
 * @example
 * ```ts
 * isLuhnValid("4532 0151 1283 0366"); // true
 * isLuhnValid("4532 0151 1283 0367"); // false
 * ```
 * @since 0.2.0
 */
export function isLuhnValid(value: string): boolean {
  const digits = value.replace(/\s/g, "");
  if (!DIGITS_PATTERN.test(digits)) {
    return false;
  }
  let sum = 0;
  for (let index = 0; index < digits.length; index += 1) {
    // En partant de la droite, un chiffre sur deux est doublé (et réduit de 9 s'il dépasse 9).
    let digit = Number(digits[digits.length - 1 - index]);
    if (index % 2 === 1) {
      digit *= 2;
      digit = digit > 9 ? digit - 9 : digit;
    }
    sum += digit;
  }
  return sum % 10 === 0;
}
