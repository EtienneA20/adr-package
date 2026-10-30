/**
 * Type du résultat de {@link invert} : chaque valeur devient une clé dont la valeur est l'ancienne
 * clé, convertie en chaîne.
 */
type Inverted<T extends Record<keyof T, PropertyKey>> = {
  -readonly [K in keyof T as K extends symbol ? never : T[K]]: `${K & (string | number)}`;
};

/**
 * Crée un nouvel objet dont les clés et les valeurs sont inversées.
 *
 * À utiliser pour retrouver une clé à partir de sa valeur (nom d'une énumération `as const` à
 * partir de son code, libellé à partir d'un identifiant…). Avec un objet `as const`, le type
 * du résultat est exact. Si plusieurs clés ont la même valeur, la dernière l'emporte. Les
 * valeurs numériques deviennent des clés chaînes, et les clés numériques des valeurs chaînes.
 * L'objet d'origine n'est pas modifié.
 *
 * @typeParam T - Type de l'objet source, dont toutes les valeurs sont des clés possibles.
 * @param object - Objet à inverser.
 * @returns Un nouvel objet `{ [valeur]: clé }`.
 * @example
 * ```ts
 * const ELoanStatus = { ONGOING: "ongoing", RETURNED: "returned" } as const;
 * invert(ELoanStatus); // { ongoing: "ONGOING", returned: "RETURNED" }
 * ```
 * @since 0.2.0
 */
export function invert<T extends Record<keyof T, PropertyKey>>(object: T): Inverted<T> {
  return Object.fromEntries(
    Object.entries<PropertyKey>(object).map(([key, value]) => [value, key]),
  ) as Inverted<T>;
}
