/**
 * Ajoute `null` et `undefined` à un type : `T | null | undefined`.
 *
 * À utiliser pour une valeur qui peut être absente de plusieurs façons (paramètre facultatif,
 * réponse d'API incomplète). Se teste avec `isNil` / `isDefined`.
 *
 * @typeParam T - Type de la valeur lorsqu'elle est présente.
 * @example
 * ```ts
 * function formatAuthor(author: Maybe<string>): string {
 *   return author ?? "Auteur inconnu";
 * }
 * ```
 * @since 0.2.0
 */
export type Maybe<T> = T | null | undefined;
