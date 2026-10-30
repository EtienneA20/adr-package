/**
 * Résultat de {@link parseQueryString} : une chaîne par clé, ou un tableau quand la clé est
 * répétée ou suffixée par `[]`.
 *
 * @example
 * ```ts
 * const parsed: ParsedQueryString = { q: "Hugo", genre: ["roman", "bd"] };
 * ```
 * @since 0.2.0
 */
export type ParsedQueryString = Record<string, string | string[]>;

/**
 * Décode un composant de query string (`+` vaut une espace) sans jamais lever d'erreur.
 *
 * @param component - Composant encodé.
 * @returns Le composant décodé, ou tel quel si son encodage est invalide (`%E9` seul…).
 */
function safeDecode(component: string): string {
  const withSpaces = component.replace(/\+/g, " ");
  try {
    return decodeURIComponent(withSpaces);
  } catch {
    return withSpaces;
  }
}

/**
 * Analyse une query string et renvoie ses paramètres décodés.
 *
 * À utiliser pour lire les filtres d'un lien partagé ou d'une URL reçue côté serveur, sans
 * dépendre de `URLSearchParams`. Le `?` initial est facultatif. Une clé répétée
 * (`genre=a&genre=b`) ou suffixée par `[]` (`genre[]=a`) donne un tableau ; une clé sans `=`
 * donne une chaîne vide. `+` est décodé en espace. Un encodage invalide est conservé tel quel
 * (aucune exception). Les valeurs ne sont pas converties : tout reste du texte.
 *
 * @param query - Query string à analyser, avec ou sans `?` initial.
 * @returns Un objet clé → valeur (ou tableau de valeurs), sans prototype hérité exploitable.
 * @example
 * ```ts
 * parseQueryString("?q=Victor+Hugo&genre=roman&genre=po%C3%A9sie&page=2");
 * // { q: "Victor Hugo", genre: ["roman", "poésie"], page: "2" }
 * parseQueryString("genre[]=roman"); // { genre: ["roman"] }
 * ```
 * @since 0.2.0
 */
export function parseQueryString(query: string): ParsedQueryString {
  const result = new Map<string, string | string[]>();
  const body = query.startsWith("?") ? query.slice(1) : query;
  for (const segment of body.split("&")) {
    if (segment === "") {
      continue;
    }
    const separatorIndex = segment.indexOf("=");
    const rawKey = separatorIndex === -1 ? segment : segment.slice(0, separatorIndex);
    const value = separatorIndex === -1 ? "" : safeDecode(segment.slice(separatorIndex + 1));
    const decodedKey = safeDecode(rawKey);
    const isArrayKey = decodedKey.endsWith("[]");
    const key = isArrayKey ? decodedKey.slice(0, -2) : decodedKey;
    const previous = result.get(key);
    if (previous === undefined) {
      result.set(key, isArrayKey ? [value] : value);
    } else {
      result.set(key, [...(Array.isArray(previous) ? previous : [previous]), value]);
    }
  }
  // `Object.fromEntries` crée des propriétés propres : une clé `__proto__` ne pollue rien.
  return Object.fromEntries(result);
}
