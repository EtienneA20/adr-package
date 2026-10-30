import type { IBuildQueryStringOptions, QueryParams } from "../build-query-string";
import { buildQueryString } from "../build-query-string";
import { joinUrl } from "../join-url";

/**
 * Construit une URL complète à partir d'une base, d'un chemin et de paramètres de query.
 *
 * À utiliser pour préparer l'URL d'un appel d'API ou d'un lien en une seule instruction.
 * Le chemin est assemblé avec `joinUrl` (un seul `/` à la jonction) et les paramètres avec
 * `buildQueryString` (valeurs `null` et `undefined` ignorées). Si la base contient déjà une
 * query string, les paramètres y sont ajoutés avec `&`. Une base contenant un fragment
 * (`#…`) n'est pas prise en charge.
 *
 * @param base - URL ou chemin de base (`https://api.bibliotheque.fr`, `/api`).
 * @param path - Chemin à ajouter à la base (facultatif).
 * @param params - Paramètres de query (facultatifs).
 * @param options - Format des tableaux (l'option `addQueryPrefix` est ignorée).
 * @returns L'URL construite.
 * @throws {@link RangeError} Si un paramètre est une date invalide.
 * @example
 * ```ts
 * buildUrl("https://api.bibliotheque.fr/", "/livres", { q: "Hugo", page: 2, genre: undefined });
 * // "https://api.bibliotheque.fr/livres?q=Hugo&page=2"
 * buildUrl("/api/livres?tri=titre", undefined, { page: 3 }); // "/api/livres?tri=titre&page=3"
 * ```
 * @since 0.2.0
 */
export function buildUrl(
  base: string,
  path?: string,
  params: QueryParams = {},
  options: IBuildQueryStringOptions = {},
): string {
  const url = path === undefined ? base : joinUrl(base, path);
  const query = buildQueryString(params, { ...options, addQueryPrefix: false });
  if (query === "") {
    return url;
  }
  if (!url.includes("?")) {
    return `${url}?${query}`;
  }
  return url.endsWith("?") || url.endsWith("&") ? `${url}${query}` : `${url}&${query}`;
}
