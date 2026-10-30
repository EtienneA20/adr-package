import { isPlainRecord } from "../is-plain-record";

/**
 * Indique si une valeur doit être aplatie : tableau ou objet simple non vide. Les conteneurs
 * vides restent des feuilles pour pouvoir être reconstruits par `unflattenObject`.
 *
 * @param value - Valeur rencontrée.
 * @returns `true` si la valeur doit être parcourue.
 */
function isNonEmptyContainer(value: unknown): value is object {
  return (Array.isArray(value) || isPlainRecord(value)) && Object.keys(value).length > 0;
}

/**
 * Parcourt récursivement un conteneur et ajoute ses feuilles à la liste des entrées.
 *
 * @param value - Conteneur à parcourir.
 * @param prefix - Chemin du conteneur (`""` à la racine).
 * @param separator - Séparateur des segments.
 * @param entries - Entrées `[chemin, valeur]` accumulées.
 */
function collectEntries(
  value: object,
  prefix: string,
  separator: string,
  entries: [string, unknown][],
): void {
  for (const [key, child] of Object.entries(value)) {
    const path = prefix === "" ? key : `${prefix}${separator}${key}`;
    if (isNonEmptyContainer(child)) {
      collectEntries(child, path, separator, entries);
    } else {
      entries.push([path, child]);
    }
  }
}

/**
 * Aplatit un objet imbriqué en un objet à un seul niveau dont les clés sont des chemins.
 *
 * À utiliser pour transmettre un objet imbriqué à un format plat (export CSV, query string,
 * champs de formulaire nommés `author.name`, comparaison clé par clé…). Les objets simples et
 * les tableaux sont parcourus (index comme segments : `items.0.title`) ; les autres valeurs
 * (dates, `Map`, instances de classe…) et les conteneurs vides sont gardés tels quels. Inverse :
 * `unflattenObject`. L'objet ne doit pas contenir de référence circulaire. L'objet d'origine
 * n'est pas modifié.
 *
 * @param object - Objet (ou tableau) à aplatir.
 * @param separator - Séparateur des segments de chemin.
 * @returns Un nouvel objet à un seul niveau, `{ chemin: valeur }`.
 * @example
 * ```ts
 * flattenObject({ title: "Germinal", author: { name: "Zola" }, tags: ["roman"] });
 * // { title: "Germinal", "author.name": "Zola", "tags.0": "roman" }
 * ```
 * @since 0.2.0
 */
export function flattenObject(object: object, separator = "."): Record<string, unknown> {
  const entries: [string, unknown][] = [];
  collectEntries(object, "", separator, entries);
  return Object.fromEntries(entries);
}
