import { typedEntries } from "../typed-entries";

/**
 * Crée un nouvel objet avec seulement les propriétés qui vérifient un prédicat.
 *
 * À utiliser quand les clés à garder dépendent des valeurs (filtres renseignés, compteurs non
 * nuls…). Seules les propriétés propres, énumérables et à clé chaîne sont parcourues. Les
 * valeurs sont copiées par référence et l'objet d'origine n'est pas modifié.
 *
 * @typeParam T - Type de l'objet source.
 * @param object - Objet source.
 * @param predicate - Reçoit la valeur et la clé ; renvoie `true` pour conserver la propriété.
 * @returns Un nouvel objet partiel avec les propriétés retenues.
 * @example
 * ```ts
 * pickBy({ title: "Germinal", author: "", year: 1885 }, (value) => value !== "");
 * // { title: "Germinal", year: 1885 }
 * ```
 * @since 0.2.0
 */
export function pickBy<T extends object>(
  object: T,
  predicate: (value: T[keyof T & string], key: keyof T & string) => boolean,
): Partial<T> {
  return Object.fromEntries(
    typedEntries(object).filter(([key, value]) => predicate(value, key)),
  ) as Partial<T>;
}
