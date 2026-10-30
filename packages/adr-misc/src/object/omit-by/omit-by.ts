import { pickBy } from "../pick-by";

/**
 * Crée un nouvel objet sans les propriétés qui vérifient un prédicat (inverse de `pickBy`).
 *
 * À utiliser pour retirer des propriétés selon leur valeur (valeurs vides, `null`, compteurs à
 * zéro…). Seules les propriétés propres, énumérables et à clé chaîne sont parcourues. Les
 * valeurs sont copiées par référence et l'objet d'origine n'est pas modifié.
 *
 * @typeParam T - Type de l'objet source.
 * @param object - Objet source.
 * @param predicate - Reçoit la valeur et la clé ; renvoie `true` pour retirer la propriété.
 * @returns Un nouvel objet partiel sans les propriétés retirées.
 * @example
 * ```ts
 * omitBy({ title: "Germinal", author: null, year: 1885 }, (value) => value === null);
 * // { title: "Germinal", year: 1885 }
 * ```
 * @since 0.2.0
 */
export function omitBy<T extends object>(
  object: T,
  predicate: (value: T[keyof T & string], key: keyof T & string) => boolean,
): Partial<T> {
  return pickBy(object, (value, key) => !predicate(value, key));
}
