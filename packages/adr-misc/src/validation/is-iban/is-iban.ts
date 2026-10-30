const IBAN_PATTERN = /^[A-Z]{2}\d{2}[A-Z\d]{11,30}$/;

// Longueurs officielles (registre SWIFT) des pays de la zone SEPA et de quelques voisins. Un
// pays absent de la table n'est contrôlé que sur les bornes générales (15 à 34 caractères).
const IBAN_LENGTHS: Readonly<Record<string, number>> = {
  AD: 24,
  AT: 20,
  BE: 16,
  BG: 22,
  CH: 21,
  CY: 28,
  CZ: 24,
  DE: 22,
  DK: 18,
  EE: 20,
  ES: 24,
  FI: 18,
  FR: 27,
  GB: 22,
  GI: 23,
  GR: 27,
  HR: 21,
  HU: 28,
  IE: 22,
  IS: 26,
  IT: 27,
  LI: 21,
  LT: 20,
  LU: 20,
  LV: 21,
  MA: 28,
  MC: 27,
  MT: 31,
  NL: 18,
  NO: 15,
  PL: 28,
  PT: 25,
  RO: 24,
  SE: 24,
  SI: 19,
  SK: 24,
  SM: 27,
  TN: 24,
  VA: 22,
};

/**
 * Calcule le reste de la division par 97 de l'IBAN réarrangé, sans dépasser la précision des
 * nombres JavaScript (traitement chiffre par chiffre).
 *
 * @param iban - IBAN normalisé (majuscules, sans espace).
 * @returns Le reste modulo 97 (1 pour un IBAN valide).
 */
function ibanModulo97(iban: string): number {
  const rearranged = iban.slice(4) + iban.slice(0, 4);
  let remainder = 0;
  for (const char of rearranged) {
    // Lettres : A = 10 … Z = 35 (deux chiffres) ; chiffres : eux-mêmes.
    for (const digit of String(Number.parseInt(char, 36))) {
      remainder = (remainder * 10 + Number(digit)) % 97;
    }
  }
  return remainder;
}

/**
 * Indique si une chaîne est un IBAN valide (format, longueur du pays, clé modulo 97).
 *
 * À utiliser pour valider des coordonnées bancaires (prélèvement d'une cotisation,
 * remboursement d'une caution). Les espaces de présentation (`FR76 3000 6000 …`) et les
 * minuscules sont tolérés. La longueur est vérifiée pour les pays de la zone SEPA ; pour les
 * autres pays, seules les bornes générales (15 à 34 caractères) le sont. N'affirme pas que le
 * compte existe.
 *
 * @param value - IBAN à tester, espaces tolérés.
 * @returns `true` si `value` est un IBAN valide, `false` sinon.
 * @example
 * ```ts
 * isIban("FR76 3000 6000 0112 3456 7890 189"); // true
 * isIban("FR76 3000 6000 0112 3456 7890 188"); // false (clé invalide)
 * isIban("FR76 3000 6000 0112 3456 7890"); // false (trop court pour la France)
 * ```
 * @since 0.2.0
 */
export function isIban(value: string): boolean {
  const iban = value.replace(/\s/g, "").toUpperCase();
  if (!IBAN_PATTERN.test(iban)) {
    return false;
  }
  // Le motif garantit que les deux premiers caractères sont le code pays.
  const expectedLength = IBAN_LENGTHS[iban.slice(0, 2)];
  if (expectedLength !== undefined && iban.length !== expectedLength) {
    return false;
  }
  return ibanModulo97(iban) === 1;
}
