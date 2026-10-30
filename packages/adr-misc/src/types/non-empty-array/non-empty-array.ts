/**
 * Tableau qui contient au moins un élément : `[T, ...T[]]`.
 *
 * À utiliser pour un paramètre qui n'a pas de sens vide (liste de destinataires, critères de
 * tri) : l'appel avec `[]` est refusé à la compilation et `items[0]` est de type `T`, même
 * avec `noUncheckedIndexedAccess`.
 *
 * @remarks
 * Pour la version en lecture seule, écrire `Readonly<NonEmptyArray<T>>`. La garde
 * `isNonEmptyArray` produit ce type à partir d'un tableau quelconque.
 *
 * @typeParam T - Type des éléments.
 * @example
 * ```ts
 * function notifyMembers(emails: NonEmptyArray<string>): void {
 *   const [first] = emails; // string
 * }
 * notifyMembers(["adherent@example.org"]);
 * notifyMembers([]); // erreur de compilation
 * ```
 * @since 0.2.0
 */
export type NonEmptyArray<T> = [T, ...T[]];
