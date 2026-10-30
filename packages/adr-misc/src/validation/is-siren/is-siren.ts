import { isLuhnValid } from "../is-luhn-valid";

const SIREN_PATTERN = /^\d{9}$/;

/**
 * Indique si une chaîne est un numéro SIREN valide (9 chiffres, clé de Luhn).
 *
 * À utiliser pour valider l'identifiant d'une entreprise française (fournisseur, éditeur…).
 * Les espaces de présentation (`732 829 320`) sont tolérés. N'affirme pas que l'entreprise
 * existe : seule la clé est vérifiée.
 *
 * @param value - Numéro à tester, espaces tolérés.
 * @returns `true` si `value` est un SIREN valide, `false` sinon.
 * @example
 * ```ts
 * isSiren("732 829 320"); // true
 * isSiren("732 829 321"); // false (clé invalide)
 * ```
 * @since 0.2.0
 */
export function isSiren(value: string): boolean {
  const digits = value.replace(/\s/g, "");
  return SIREN_PATTERN.test(digits) && isLuhnValid(digits);
}
