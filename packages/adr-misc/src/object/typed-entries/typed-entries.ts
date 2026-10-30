/**
 * Paire `[clé, valeur]` d'un objet, typée précisément : chaque clé (chaîne) est associée au
 * type de sa propre valeur.
 *
 * @typeParam T - Type de l'objet.
 * @example
 * ```ts
 * type BookEntry = ObjectEntry<{ title: string; year: number }>;
 * // ["title", string] | ["year", number]
 * ```
 * @since 0.2.0
 */
export type ObjectEntry<T> = { [K in keyof T & string]-?: [K, T[K]] }[keyof T & string];

/**
 * Renvoie les paires `[clé, valeur]` propres et énumérables d'un objet, typées précisément.
 *
 * À utiliser à la place d'`Object.entries`, qui type les clés en `string` et les valeurs en
 * `any` : ici, chaque clé est un littéral de `keyof T` associé au type de sa valeur. Attention :
 * TypeScript ne garantit pas qu'un objet n'a pas d'autres propriétés que celles de son type ;
 * réserver cette fonction aux objets dont on maîtrise la forme. Les clés symboles sont ignorées.
 *
 * @typeParam T - Type de l'objet.
 * @param object - Objet à parcourir.
 * @returns Un nouveau tableau de paires `[clé, valeur]`.
 * @example
 * ```ts
 * for (const [key, value] of typedEntries({ title: "Germinal", year: 1885 })) {
 *   // key : "title" | "year"
 * }
 * ```
 * @since 0.2.0
 */
export function typedEntries<T extends object>(object: T): ObjectEntry<T>[] {
  return Object.entries(object) as ObjectEntry<T>[];
}
