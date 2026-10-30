import { isLuhnValid } from "../is-luhn-valid";

const SIRET_PATTERN = /^\d{14}$/;
const LA_POSTE_SIREN = "356000000";

/**
 * Calcule la somme des chiffres d'une chaîne de chiffres.
 *
 * @param digits - Chaîne composée uniquement de chiffres.
 * @returns La somme des chiffres.
 */
function sumDigits(digits: string): number {
  return Array.from(digits, Number).reduce((sum, digit) => sum + digit, 0);
}

/**
 * Indique si une chaîne est un numéro SIRET valide (14 chiffres, clé de Luhn).
 *
 * À utiliser pour valider l'identifiant d'un établissement d'entreprise française. Les
 * espaces de présentation (`732 829 320 00074`) sont tolérés. Gère l'exception de La Poste
 * (SIREN `356000000`) : ses établissements sont valides si la somme de leurs chiffres est un
 * multiple de 5.
 *
 * @param value - Numéro à tester, espaces tolérés.
 * @returns `true` si `value` est un SIRET valide, `false` sinon.
 * @example
 * ```ts
 * isSiret("732 829 320 00074"); // true
 * isSiret("356 000 000 49837"); // true (établissement de La Poste)
 * isSiret("732 829 320 00075"); // false
 * ```
 * @since 0.2.0
 */
export function isSiret(value: string): boolean {
  const digits = value.replace(/\s/g, "");
  if (!SIRET_PATTERN.test(digits)) {
    return false;
  }
  if (digits.startsWith(LA_POSTE_SIREN)) {
    return isLuhnValid(digits) || sumDigits(digits) % 5 === 0;
  }
  return isLuhnValid(digits);
}
