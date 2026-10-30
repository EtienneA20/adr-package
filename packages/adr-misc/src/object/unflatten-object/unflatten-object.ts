import { isArrayIndex } from "../array-index";
import { isUnsafeKey } from "../unsafe-key";

/**
 * Écrit une valeur dans l'arbre en construction, en créant les conteneurs manquants. L'arbre
 * est neuf et local à `unflattenObject` : le modifier en place ne touche pas les arguments.
 *
 * @param root - Racine de l'arbre en construction.
 * @param segments - Segments du chemin (sans segment dangereux).
 * @param value - Valeur à écrire.
 */
function assignPath(
  root: Record<string, unknown>,
  segments: readonly string[],
  value: unknown,
): void {
  let container = root;
  segments.forEach((segment, index) => {
    const next = segments[index + 1];
    if (next === undefined) {
      container[segment] = value;
      return;
    }
    const child = container[segment];
    if (typeof child !== "object" || child === null) {
      container[segment] = isArrayIndex(next) ? [] : {};
    }
    container = container[segment] as Record<string, unknown>;
  });
}

/**
 * Reconstruit un objet imbriqué à partir d'un objet à un seul niveau dont les clés sont des
 * chemins (inverse de `flattenObject`).
 *
 * À utiliser pour relire un format plat (champs de formulaire nommés `author.name`, colonnes
 * CSV, query string…). Un segment numérique crée un tableau (`items.0.title`), les autres un
 * objet ; la racine est toujours un objet. Les entrées sont appliquées dans l'ordre : une valeur
 * simple écrite à un chemin parent est remplacée par un conteneur si un chemin plus long suit.
 * Les entrées dont un segment vaut `__proto__`, `constructor` ou `prototype` sont ignorées
 * (protection contre la pollution de prototype). L'objet d'origine n'est pas modifié.
 *
 * @param flat - Objet plat `{ chemin: valeur }`.
 * @param separator - Séparateur des segments de chemin.
 * @returns Un nouvel objet imbriqué.
 * @example
 * ```ts
 * unflattenObject({ title: "Germinal", "author.name": "Zola", "tags.0": "roman" });
 * // { title: "Germinal", author: { name: "Zola" }, tags: ["roman"] }
 * ```
 * @since 0.2.0
 */
export function unflattenObject(
  flat: Readonly<Record<string, unknown>>,
  separator = ".",
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [path, value] of Object.entries(flat)) {
    const segments = path.split(separator);
    if (!segments.some((segment) => isUnsafeKey(segment))) {
      assignPath(result, segments, value);
    }
  }
  return result;
}
