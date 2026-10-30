// Un octet de 0 à 255, sans zéro non significatif (« 01 » est refusé : ambigu en octal).
const OCTET = String.raw`(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)`;
const IPV4_PATTERN = new RegExp(String.raw`^${OCTET}(?:\.${OCTET}){3}$`);

/**
 * Indique si une chaîne est une adresse IPv4 en notation décimale pointée.
 *
 * À utiliser pour valider une adresse saisie dans une configuration (liste blanche, proxy…).
 * Les zéros non significatifs (`192.168.01.1`) et les espaces sont refusés.
 *
 * @param value - Chaîne à tester.
 * @returns `true` si `value` est une adresse IPv4 valide, `false` sinon.
 * @example
 * ```ts
 * isIpv4("192.168.1.10"); // true
 * isIpv4("256.0.0.1"); // false
 * isIpv4("10.0.0"); // false
 * ```
 * @since 0.2.0
 */
export function isIpv4(value: string): boolean {
  return IPV4_PATTERN.test(value);
}
