/**
 * Assemble des segments d'URL ou de chemin avec exactement un `/` entre chacun.
 *
 * À utiliser pour construire l'URL d'un appel d'API à partir d'une base configurable et de
 * segments (`joinUrl(apiBaseUrl, "livres", id)`) sans se soucier des `/` en double ou
 * manquants. Seuls les `/` aux jonctions sont normalisés : le `//` du protocole
 * (`https://`) et ceux internes à un segment sont conservés, de même que le `/` initial du
 * premier segment et le `/` final du dernier. Les segments vides sont ignorés. Les segments ne
 * sont pas encodés : utiliser `encodeURIComponent` pour une valeur saisie.
 *
 * @param segments - Segments à assembler, dans l'ordre.
 * @returns L'URL ou le chemin assemblé ; chaîne vide si aucun segment n'est fourni.
 * @example
 * ```ts
 * joinUrl("https://api.bibliotheque.fr/", "/v1/", "livres", "42"); // "https://api.bibliotheque.fr/v1/livres/42"
 * joinUrl("/api", "adherents/"); // "/api/adherents/"
 * ```
 * @since 0.2.0
 */
export function joinUrl(...segments: string[]): string {
  return segments.reduce((url, segment) => {
    if (segment === "") {
      return url;
    }
    if (url === "") {
      return segment;
    }
    const tail = segment.replace(/^\/+/, "");
    // Base réduite à un protocole (`https://`) : ses `/` ne sont pas une jonction.
    return url.endsWith("://") ? `${url}${tail}` : `${url.replace(/\/+$/, "")}/${tail}`;
  }, "");
}
