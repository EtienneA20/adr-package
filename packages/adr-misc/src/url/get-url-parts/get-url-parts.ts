/**
 * Composants d'une URL, renvoyés par {@link getUrlParts}. Un composant absent vaut `""`.
 *
 * @example
 * ```ts
 * const parts: IUrlParts = {
 *   protocol: "https",
 *   host: "api.bibliotheque.fr:8443",
 *   hostname: "api.bibliotheque.fr",
 *   port: "8443",
 *   pathname: "/livres",
 *   query: "page=2",
 *   hash: "resultats",
 * };
 * ```
 * @since 0.2.0
 */
export interface IUrlParts {
  /** Protocole en minuscules, sans `:` (`"https"`). */
  protocol: string;
  /** Hôte avec le port éventuel, sans identifiants (`"api.bibliotheque.fr:8443"`). */
  host: string;
  /** Nom d'hôte seul, en minuscules (`"api.bibliotheque.fr"`, `"[::1]"`). */
  hostname: string;
  /** Port tel qu'écrit dans l'URL, sans `:` (`"8443"`). */
  port: string;
  /** Chemin, non décodé (`"/livres/42"`). */
  pathname: string;
  /** Query string sans `?`, non décodée (à passer à `parseQueryString`). */
  query: string;
  /** Fragment sans `#`, non décodé. */
  hash: string;
}

// Expression de l'annexe B de la RFC 3986 : elle reconnaît toute chaîne et la découpe en
// protocole, autorité, chemin, query et fragment.
const URI_PATTERN = /^(?:([^:/?#]+):)?(?:\/\/([^/?#]*))?([^?#]*)(?:\?([^#]*))?(?:#(.*))?$/s;
// Autorité : identifiants facultatifs, hôte (IPv6 entre crochets ou nom), port facultatif.
const AUTHORITY_PATTERN = /^(?:.*@)?(\[[^\]]*\]|[^:]*)(?::(\d*))?$/s;

/**
 * Exécute une expression et renvoie ses groupes capturés, `""` pour ceux qui sont absents.
 *
 * @param pattern - Expression à exécuter.
 * @param value - Chaîne analysée.
 * @param count - Nombre de groupes attendus.
 * @returns Les groupes capturés, dans l'ordre.
 */
function captureGroups(pattern: RegExp, value: string, count: number): string[] {
  const match = pattern.exec(value);
  return Array.from({ length: count }, (_, index) => match?.[index + 1] ?? "");
}

/**
 * Découpe une URL en composants (protocole, hôte, port, chemin, query, fragment), sans
 * dépendre de l'API `URL`.
 *
 * À utiliser pour lire une partie d'une URL (hôte d'un lien externe, query d'une URL
 * reçue) dans un code qui doit tourner sans `URL` ni DOM. Ne lève jamais d'erreur et ne valide
 * pas l'URL (utiliser `isUrl` pour cela) : une URL relative donne un protocole et un hôte
 * vides. Les composants ne sont ni décodés ni normalisés (hormis la casse du protocole et du
 * nom d'hôte) ; les identifiants (`utilisateur:secret@`) sont écartés.
 *
 * @param url - URL absolue ou relative à découper.
 * @returns Les composants de l'URL, `""` pour ceux qui sont absents.
 * @example
 * ```ts
 * getUrlParts("https://api.bibliotheque.fr:8443/livres?page=2#resultats");
 * // { protocol: "https", host: "api.bibliotheque.fr:8443", hostname: "api.bibliotheque.fr",
 * //   port: "8443", pathname: "/livres", query: "page=2", hash: "resultats" }
 * getUrlParts("/livres?page=2").query; // "page=2"
 * ```
 * @since 0.2.0
 */
export function getUrlParts(url: string): IUrlParts {
  const [protocol = "", authority = "", pathname = "", query = "", hash = ""] = captureGroups(
    URI_PATTERN,
    url,
    5,
  );
  const [rawHostname = "", port = ""] = captureGroups(AUTHORITY_PATTERN, authority, 2);
  const hostname = rawHostname.toLowerCase();
  return {
    protocol: protocol.toLowerCase(),
    host: port === "" ? hostname : `${hostname}:${port}`,
    hostname,
    port,
    pathname,
    query,
    hash,
  };
}
