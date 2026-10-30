/**
 * Aplatit un type objet (intersections, `Omit`, `Pick`…) en un seul type littéral, pour un
 * affichage lisible au survol dans l'éditeur. Le type obtenu est équivalent à `T`.
 *
 * À utiliser sur un type composé exposé publiquement, pour que l'éditeur affiche ses
 * propriétés plutôt que `Omit<IBook, "id"> & { … }`.
 *
 * @remarks
 * Les modificateurs `readonly` et `?` de chaque propriété sont conservés. Le type n'est
 * aplati que sur un niveau.
 *
 * @typeParam T - Type objet à aplatir.
 * @example
 * ```ts
 * type BookDraft = Prettify<Omit<IBook, "id"> & { isDraft: true }>;
 * // Survol : { title: string; author: string; isDraft: true }
 * ```
 * @since 0.2.0
 */
export type Prettify<T> = { [K in keyof T]: T[K] };
