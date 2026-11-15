function isJson(value: string): boolean {
  try {
    JSON.parse(value);
    return true;
  } catch {
    return false;
  }
}

/**
 * Encode une requête de liste en paramètres d'URL : un paramètre par clé, valeur en JSON.
 *
 * À utiliser côté front pour construire l'URL d'appel de l'API (avec `buildUrl` ou
 * `buildQueryString`). Même convention que la sérialisation par défaut de TanStack Router,
 * que décode `IListQueryDefinition.searchParamsSchema` : un texte est laissé brut (`q=dune`),
 * sauf s'il pourrait être lu comme du JSON (`"123"` est alors encodé `"\"123\""`) ; les
 * nombres, booléens, tableaux et objets sont encodés en JSON. Les clés de valeur `undefined`
 * sont omises.
 *
 * @param query - Requête de liste, complète ou partielle.
 * @returns Les paramètres d'URL, valeurs non encodées pour l'URL (`encodeURIComponent` est
 * appliqué par `buildQueryString`).
 * @example
 * ```ts
 * toListQuerySearchParams({ q: "dune", page: 2, sort: [{ field: "title", direction: "asc" }] });
 * // { q: "dune", page: "2", sort: '[{"field":"title","direction":"asc"}]' }
 * ```
 * @since 0.3.0
 */
export function toListQuerySearchParams(query: object): Record<string, string> {
  const entries = Object.entries(query)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]: [string, unknown]) => [
      key,
      typeof value === "string" && !isJson(value) ? value : JSON.stringify(value),
    ]);
  return Object.fromEntries(entries) as Record<string, string>;
}
