/**
 * Union des clés d'un type objet dont la valeur est assignable à `V`.
 *
 * À utiliser pour restreindre un paramètre aux propriétés d'un certain type : colonne de tri
 * numérique, champ de date à formater…
 *
 * @remarks
 * Une propriété facultative a pour type `X | undefined` : elle n'est retenue que si `V`
 * accepte `undefined` (`{ a?: string }` donne `never` pour `V = string`, et `"a"` pour
 * `V = string | undefined`). Les clés obtenues sont donc sûres à utiliser sans vérification.
 *
 * @typeParam T - Type objet inspecté.
 * @typeParam V - Type que doivent avoir les valeurs des clés retenues.
 * @example
 * ```ts
 * interface IBook {
 *   title: string;
 *   pages: number;
 *   publishedAt: Date;
 *   copies: number;
 * }
 * type NumericField = KeysOfType<IBook, number>; // "pages" | "copies"
 * const sortBooks = (books: IBook[], field: KeysOfType<IBook, number>) =>
 *   [...books].sort((a, b) => a[field] - b[field]);
 * ```
 * @since 0.2.0
 */
export type KeysOfType<T, V> = {
  [K in keyof T]-?: T[K] extends V ? K : never;
}[keyof T];
