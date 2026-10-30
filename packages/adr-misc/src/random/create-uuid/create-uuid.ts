import { getWebCrypto } from "../crypto";

/** Nombre d'octets d'un UUID. */
const UUID_BYTE_LENGTH = 16;

/**
 * Applique à un octet les bits imposés par la RFC 9562 pour un UUID v4.
 *
 * @param byte - Octet aléatoire.
 * @param index - Position de l'octet dans l'UUID.
 * @returns L'octet avec la version (octet 6) ou la variante (octet 8) appliquée.
 */
function applyVersionBits(byte: number, index: number): number {
  if (index === 6) {
    return (byte & 0x0f) | 0x40;
  }
  if (index === 8) {
    return (byte & 0x3f) | 0x80;
  }
  return byte;
}

/**
 * Met en forme 16 octets aléatoires en UUID v4 (`xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`).
 *
 * @param bytes - 16 octets aléatoires.
 * @returns L'UUID en minuscules.
 */
function formatUuid(bytes: Uint8Array): string {
  const hex = Array.from(bytes, (byte, index) =>
    applyVersionBits(byte, index).toString(16).padStart(2, "0"),
  ).join("");
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20),
  ].join("-");
}

/**
 * Génère un UUID v4 aléatoire, à partir de l'API Web Crypto.
 *
 * À utiliser pour un identifiant unique créé côté client ou serveur (brouillon d'emprunt,
 * clé d'idempotence, identifiant de corrélation). C'est la **seule** fonction de la catégorie
 * adaptée à un usage sensible : elle s'appuie sur une source cryptographiquement sûre, alors
 * que `randomInt`, `randomString`, `shuffle`… utilisent `Math.random` par défaut.
 *
 * @remarks
 * Utilise `crypto.randomUUID()` quand il existe, sinon `crypto.getRandomValues()` (le
 * navigateur n'expose `randomUUID` qu'en contexte sécurisé, HTTPS ou localhost).
 *
 * @returns Un UUID v4 en minuscules, par exemple `"3b241101-e2bb-4255-8caf-4136c566a962"`.
 * @throws {@link Error} Si l'API Web Crypto est absente de l'environnement.
 * @example
 * ```ts
 * const loanId = createUuid(); // par exemple "3b241101-e2bb-4255-8caf-4136c566a962"
 * ```
 * @since 0.2.0
 */
export function createUuid(): string {
  const webCrypto = getWebCrypto();
  if (webCrypto?.randomUUID) {
    return webCrypto.randomUUID();
  }
  if (webCrypto?.getRandomValues) {
    return formatUuid(webCrypto.getRandomValues(new Uint8Array(UUID_BYTE_LENGTH)));
  }
  throw new Error(
    "API Web Crypto indisponible : impossible de générer un UUID de façon sûre dans cet environnement.",
  );
}
