/**
 * Chemin d'une URL de requête, sans la chaîne de requête : utilisé dans les journaux et dans
 * `instance` des erreurs, pour ne pas y recopier de jeton ou de donnée personnelle passés en
 * paramètre d'URL.
 *
 * @param url - URL de la requête (`/livres?filter=…`).
 * @returns Le chemin (`/livres`), `/` si l'URL est absente.
 * @example
 * ```ts
 * requestPath("/livres/export?format=csv"); // "/livres/export"
 * ```
 * @internal
 */
export function requestPath(url: unknown): string {
  if (typeof url !== "string" || url === "") return "/";
  const end = url.search(/[?#]/);
  return (end === -1 ? url : url.slice(0, end)) || "/";
}
