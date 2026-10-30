/**
 * Type nominal (« marqué ») : un type `T` rendu incompatible avec un autre type de même
 * structure grâce à une marque `B`.
 *
 * À utiliser pour ne pas confondre des identifiants ou des valeurs de même type primitif
 * (identifiant de livre et d'adhérent, montant en centimes et en euros). La valeur se crée
 * par une conversion explicite (`as BookId`), idéalement dans une fonction de validation.
 *
 * @remarks
 * La propriété `__brand` n'existe qu'à la compilation : aucune donnée n'est ajoutée à
 * l'exécution. Une valeur marquée reste utilisable partout où `T` est attendu.
 *
 * @typeParam T - Type sous-jacent (souvent `string` ou `number`).
 * @typeParam B - Nom unique de la marque.
 * @example
 * ```ts
 * type BookId = Brand<string, "BookId">;
 * type MemberId = Brand<string, "MemberId">;
 *
 * const toBookId = (value: string): BookId => value as BookId;
 * function findBook(id: BookId): IBook | undefined { … }
 *
 * findBook(toBookId("b-42")); // OK
 * findBook(memberId); // erreur : MemberId n'est pas un BookId
 * findBook("b-42"); // erreur : string n'est pas un BookId
 * ```
 * @since 0.2.0
 */
export type Brand<T, B extends string> = T & {
  /** Marque présente uniquement dans le système de types, jamais à l'exécution. */
  readonly __brand: B;
};
