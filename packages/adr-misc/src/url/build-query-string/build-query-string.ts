/**
 * Valeur simple d'un paramètre de query string. `null` et `undefined` sont ignorés par
 * {@link buildQueryString} ; une `Date` est sérialisée en ISO 8601.
 *
 * @example
 * ```ts
 * const value: QueryParamValue = new Date(2026, 9, 28);
 * ```
 * @since 0.2.0
 */
export type QueryParamValue = string | number | boolean | Date | null | undefined;

/**
 * Paramètres d'une query string : chaque clé porte une valeur simple ou un tableau de valeurs.
 *
 * @example
 * ```ts
 * const params: QueryParams = { q: "Hugo", page: 2, genre: ["roman", "poésie"], auteur: undefined };
 * ```
 * @since 0.2.0
 */
export type QueryParams = Readonly<Record<string, QueryParamValue | readonly QueryParamValue[]>>;

/**
 * Options de {@link buildQueryString} (et de `buildUrl`).
 *
 * @example
 * ```ts
 * const options: IBuildQueryStringOptions = { arrayFormat: "brackets", addQueryPrefix: true };
 * ```
 * @since 0.2.0
 */
export interface IBuildQueryStringOptions {
  /**
   * Sérialisation des tableaux : `"repeat"` (`tag=a&tag=b`), `"brackets"` (`tag[]=a&tag[]=b`)
   * ou `"comma"` (`tag=a,b`).
   *
   * @defaultValue `"repeat"`
   */
  arrayFormat?: "repeat" | "brackets" | "comma";
  /**
   * Préfixer le résultat par `?` (seulement s'il n'est pas vide).
   *
   * @defaultValue false
   */
  addQueryPrefix?: boolean;
}

/**
 * Convertit une valeur non nulle en chaîne encodée.
 *
 * @param key - Clé du paramètre (pour le message d'erreur).
 * @param value - Valeur à sérialiser.
 * @returns La valeur encodée avec `encodeURIComponent`.
 * @throws {@link RangeError} Si `value` est une date invalide.
 */
function encodeValue(key: string, value: string | number | boolean | Date): string {
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) {
      throw new RangeError(`Date invalide pour le paramètre « ${key} » de la query string`);
    }
    return encodeURIComponent(value.toISOString());
  }
  return encodeURIComponent(String(value));
}

/**
 * Sérialise un paramètre (valeur simple ou tableau) en segments `clé=valeur`.
 *
 * @param key - Clé du paramètre.
 * @param value - Valeur ou tableau de valeurs.
 * @param arrayFormat - Format des tableaux.
 * @returns Les segments à joindre par `&` (vide si rien n'est à sérialiser).
 */
function serializeParam(
  key: string,
  value: QueryParamValue | readonly QueryParamValue[],
  arrayFormat: NonNullable<IBuildQueryStringOptions["arrayFormat"]>,
): string[] {
  const encodedKey = encodeURIComponent(key);
  const values = (Array.isArray(value) ? value : [value]) as readonly QueryParamValue[];
  const encodedValues = values
    .filter((item) => item !== null && item !== undefined)
    .map((item) => encodeValue(key, item));
  if (encodedValues.length === 0) {
    return [];
  }
  if (!Array.isArray(value) || arrayFormat === "repeat") {
    return encodedValues.map((item) => `${encodedKey}=${item}`);
  }
  if (arrayFormat === "brackets") {
    return encodedValues.map((item) => `${encodedKey}[]=${item}`);
  }
  return [`${encodedKey}=${encodedValues.join(",")}`];
}

/**
 * Construit une query string à partir d'un objet de paramètres.
 *
 * À utiliser pour préparer les paramètres d'un appel d'API ou d'un lien filtré (recherche,
 * pagination). Les valeurs `null` et `undefined` sont ignorées (ce qui permet de passer
 * directement un objet de filtres partiellement rempli), les booléens et nombres sont convertis
 * en texte, les dates en ISO 8601 (UTC). Clés et valeurs sont encodées avec
 * `encodeURIComponent` (espace encodé `%20`). L'ordre des clés est conservé.
 *
 * @param params - Paramètres à sérialiser.
 * @param options - Format des tableaux et préfixe `?`.
 * @returns La query string, sans `?` initial par défaut ; chaîne vide si aucun paramètre.
 * @throws {@link RangeError} Si une valeur est une date invalide.
 * @example
 * ```ts
 * buildQueryString({ q: "Victor Hugo", page: 2, genre: ["roman", "poésie"], auteur: undefined });
 * // "q=Victor%20Hugo&page=2&genre=roman&genre=po%C3%A9sie"
 * buildQueryString({ genre: ["roman", "bd"] }, { arrayFormat: "brackets", addQueryPrefix: true });
 * // "?genre[]=roman&genre[]=bd"
 * ```
 * @since 0.2.0
 */
export function buildQueryString(
  params: QueryParams,
  options: IBuildQueryStringOptions = {},
): string {
  const arrayFormat = options.arrayFormat ?? "repeat";
  const query = Object.entries(params)
    .flatMap(([key, value]) => serializeParam(key, value, arrayFormat))
    .join("&");
  return options.addQueryPrefix === true && query !== "" ? `?${query}` : query;
}
