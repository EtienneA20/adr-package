/**
 * Ajoute `null` à un type : `T | null`.
 *
 * À utiliser pour une valeur explicitement « vide » (colonne SQL nullable, champ JSON à
 * `null`), quand `undefined` n'est pas une valeur possible. Pour accepter aussi `undefined`,
 * utiliser `Maybe`.
 *
 * @typeParam T - Type de la valeur lorsqu'elle est présente.
 * @example
 * ```ts
 * interface IBook {
 *   title: string;
 *   returnedAt: Nullable<Date>; // Date | null
 * }
 * ```
 * @since 0.2.0
 */
export type Nullable<T> = T | null;
