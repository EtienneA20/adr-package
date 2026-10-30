import { isIpv4 } from "../is-ipv4";

/**
 * Options de {@link isUrl}.
 *
 * @example
 * ```ts
 * const options: IIsUrlOptions = { protocols: ["http", "https", "ftp"] };
 * ```
 * @since 0.2.0
 */
export interface IIsUrlOptions {
  /**
   * Protocoles acceptés, sans `://` (comparaison insensible à la casse).
   *
   * @defaultValue `["http", "https"]`
   */
  protocols?: readonly string[];
}

const DEFAULT_PROTOCOLS: readonly string[] = ["http", "https"];
const MAX_PORT = 65_535;

// protocole :// [utilisateur@] hôte [:port] [chemin, query ou fragment sans espace]
const URL_PATTERN =
  /^([a-z][a-z\d+.-]*):\/\/(?:[^\s/?#@]+@)?(\[[\da-f:.]+\]|[^\s/?#:@[\]]+)(?::(\d{1,5}))?(?:[/?#]\S*)?$/iu;

// Étiquettes de domaine : lettres (accents compris), chiffres et tirets, sans tiret aux bords ;
// extension alphabétique d'au moins deux lettres (ou punycode `xn--`).
const DOMAIN_PATTERN =
  /^(?:[\p{L}\p{N}](?:[\p{L}\p{N}-]{0,61}[\p{L}\p{N}])?\.)+(?:\p{L}{2,63}|xn--[a-z\d-]{1,59})$/iu;

/**
 * Indique si un hôte est un nom de domaine, `localhost`, une IPv4 ou une IPv6 entre crochets.
 *
 * @param host - Hôte extrait de l'URL.
 * @returns `true` si l'hôte est acceptable.
 */
function isValidHost(host: string): boolean {
  return (
    host.toLowerCase() === "localhost" ||
    host.startsWith("[") ||
    isIpv4(host) ||
    DOMAIN_PATTERN.test(host)
  );
}

/**
 * Indique si une chaîne est une URL absolue valide (par défaut en `http` ou `https`).
 *
 * À utiliser pour valider un lien saisi par un utilisateur (site web, lien vers une notice…).
 * L'hôte doit être un nom de domaine avec extension, `localhost`, une adresse IPv4 ou une
 * adresse IPv6 entre crochets ; le port éventuel doit être compris entre 1 et 65535. Seules
 * les URL hiérarchiques (`protocole://hôte…`) sont reconnues : `mailto:` ou `tel:` ne le sont
 * pas. Les espaces ne sont pas tolérés.
 *
 * @param value - Chaîne à tester.
 * @param options - Options, dont les protocoles acceptés.
 * @returns `true` si `value` est une URL valide avec un protocole accepté, `false` sinon.
 * @example
 * ```ts
 * isUrl("https://bibliotheque.fr/livres?page=2"); // true
 * isUrl("ftp://fichiers.bibliotheque.fr"); // false
 * isUrl("ftp://fichiers.bibliotheque.fr", { protocols: ["ftp"] }); // true
 * isUrl("bibliotheque.fr"); // false (protocole absent)
 * ```
 * @since 0.2.0
 */
export function isUrl(value: string, options: IIsUrlOptions = {}): boolean {
  const match = URL_PATTERN.exec(value);
  if (!match) {
    return false;
  }
  const [, protocol = "", host = "", port] = match;
  const protocols = (options.protocols ?? DEFAULT_PROTOCOLS).map((item) => item.toLowerCase());
  const isPortValid = port === undefined || (Number(port) >= 1 && Number(port) <= MAX_PORT);
  return protocols.includes(protocol.toLowerCase()) && isPortValid && isValidHost(host);
}
