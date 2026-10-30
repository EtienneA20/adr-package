// Métropole (départements 01 à 95, Corse comprise en 20xxx), outre-mer (971 à 978) et
// collectivités du Pacifique, TAAF et Monaco (980, 984, 986 à 988).
const POSTAL_CODE_PATTERN = /^(?:(?:0[1-9]|[1-8]\d|9[0-5])\d{3}|97[1-8]\d{2}|98[046-8]\d{2})$/;

/**
 * Indique si une chaîne est un code postal français plausible.
 *
 * À utiliser pour valider une adresse postale. Vérifie le format (5 chiffres) et le préfixe
 * départemental : 01 à 95 en métropole (la Corse utilise les codes 20xxx, jamais 2A ou 2B),
 * 971 à 978 en outre-mer, 980 (Monaco), 984, 986, 987 et 988. N'affirme pas que le code
 * existe réellement. Les espaces ne sont pas tolérés.
 *
 * @param value - Chaîne à tester.
 * @returns `true` si `value` est un code postal français plausible, `false` sinon.
 * @example
 * ```ts
 * isPostalCodeFr("75001"); // true
 * isPostalCodeFr("20000"); // true (Ajaccio)
 * isPostalCodeFr("97400"); // true (La Réunion)
 * isPostalCodeFr("2A000"); // false
 * ```
 * @since 0.2.0
 */
export function isPostalCodeFr(value: string): boolean {
  return POSTAL_CODE_PATTERN.test(value);
}
