import { isSiren } from "../is-siren";

const VAT_PATTERN = /^FR(\d{2})(\d{9})$/;

/**
 * Indique si une chaîne est un numéro de TVA intracommunautaire français valide.
 *
 * À utiliser pour valider le numéro de TVA d'un client ou d'un fournisseur sur une facture.
 * Format attendu : `FR`, une clé numérique de 2 chiffres, puis le SIREN (9 chiffres). Vérifie
 * la clé (`(12 + 3 × (SIREN mod 97)) mod 97`) et la clé de Luhn du SIREN. Les espaces de
 * présentation et la casse du préfixe sont tolérés. Les anciennes clés alphanumériques
 * (entités sans SIREN) ne sont pas prises en charge. N'interroge pas le service VIES.
 *
 * @param value - Numéro à tester, espaces tolérés.
 * @returns `true` si `value` est un numéro de TVA français valide, `false` sinon.
 * @example
 * ```ts
 * isFrenchVatNumber("FR 44 732 829 320"); // true
 * isFrenchVatNumber("FR45732829320"); // false (clé invalide)
 * ```
 * @since 0.2.0
 */
export function isFrenchVatNumber(value: string): boolean {
  const match = VAT_PATTERN.exec(value.replace(/\s/g, "").toUpperCase());
  if (!match) {
    return false;
  }
  const [, key, siren = ""] = match;
  const expectedKey = (12 + 3 * (Number(siren) % 97)) % 97;
  return Number(key) === expectedKey && isSiren(siren);
}
