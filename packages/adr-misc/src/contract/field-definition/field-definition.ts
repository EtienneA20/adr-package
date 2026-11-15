import type { EFieldType } from "../field-type";
import type { EFilterOperator } from "../filter-operator";

/**
 * Définition d'un champ du contrat de liste : son type et ce que le client peut en faire.
 *
 * Tout est refusé par défaut : un champ n'est filtrable, triable, sélectionnable ou inclus
 * dans la recherche `q` que si la définition le dit.
 *
 * @example
 * ```ts
 * const status: IFieldDefinition = {
 *   type: "enum",
 *   values: ["available", "loaned"],
 *   filter: ["eq", "in"],
 *   select: true,
 * };
 * ```
 * @since 0.3.0
 */
export interface IFieldDefinition {
  /** Type du champ : fixe le format des valeurs et les opérateurs possibles. */
  readonly type: EFieldType;
  /** Valeurs permises, obligatoire pour le type `enum` et interdit pour les autres. */
  readonly values?: readonly string[];
  /**
   * `true` : filtrable avec tous les opérateurs du type (`FIELD_TYPE_OPERATORS`) ; liste :
   * filtrable avec ces opérateurs seulement ; absent ou `false` : non filtrable.
   */
  readonly filter?: boolean | readonly EFilterOperator[];
  /** Le champ peut être utilisé dans le tri. */
  readonly sort?: boolean;
  /** Le champ peut être demandé dans la sélection de champs (`fields`). */
  readonly select?: boolean;
  /** Le champ fait partie de la recherche globale `q` (type `string` uniquement). */
  readonly search?: boolean;
}

/**
 * Définitions des champs d'un contrat de liste, indexées par nom public. Un nom est un
 * identifiant (`title`) ou un chemin de relation à un niveau (`author.name`).
 *
 * @example
 * ```ts
 * const fields = { title: { type: "string", sort: true } } satisfies FieldDefinitions;
 * ```
 * @since 0.3.0
 */
export type FieldDefinitions = Readonly<Record<string, IFieldDefinition>>;

/**
 * Champ d'un contrat de liste après validation de sa définition : capacités explicites et
 * liste effective des opérateurs.
 *
 * À utiliser côté front pour construire l'interface de filtre (opérateurs proposés,
 * colonnes triables) à partir de `IListQueryDefinition.fields`.
 *
 * @example
 * ```ts
 * const sortable = Object.values(bookListQuery.fields).filter((field) => field.sortable);
 * ```
 * @since 0.3.0
 */
export interface IResolvedField {
  /** Nom public du champ. */
  readonly name: string;
  /** Type du champ. */
  readonly type: EFieldType;
  /** Valeurs permises (type `enum` uniquement). */
  readonly values?: readonly string[] | undefined;
  /** Opérateurs de filtre permis, vide si le champ n'est pas filtrable. */
  readonly operators: readonly EFilterOperator[];
  /** Le champ peut être trié. */
  readonly sortable: boolean;
  /** Le champ peut être sélectionné. */
  readonly selectable: boolean;
  /** Le champ fait partie de la recherche globale `q`. */
  readonly searchable: boolean;
}

/**
 * Noms des champs filtrables d'un ensemble de définitions (`filter: true` ou liste
 * d'opérateurs).
 *
 * @typeParam T - Définitions des champs.
 * @example
 * ```ts
 * type BookFilterField = FilterableField<typeof bookFields>; // "title" | "status"
 * ```
 * @since 0.3.0
 */
export type FilterableField<T extends FieldDefinitions> = {
  [K in keyof T]: T[K]["filter"] extends true | readonly EFilterOperator[] ? K : never;
}[keyof T] &
  string;

/**
 * Noms des champs triables d'un ensemble de définitions (`sort: true`).
 *
 * @typeParam T - Définitions des champs.
 * @example
 * ```ts
 * type BookSortField = SortableField<typeof bookFields>; // "title" | "publishedAt"
 * ```
 * @since 0.3.0
 */
export type SortableField<T extends FieldDefinitions> = {
  [K in keyof T]: T[K]["sort"] extends true ? K : never;
}[keyof T] &
  string;

/**
 * Noms des champs sélectionnables d'un ensemble de définitions (`select: true`).
 *
 * @typeParam T - Définitions des champs.
 * @example
 * ```ts
 * type BookSelectField = SelectableField<typeof bookFields>; // "id" | "title"
 * ```
 * @since 0.3.0
 */
export type SelectableField<T extends FieldDefinitions> = {
  [K in keyof T]: T[K]["select"] extends true ? K : never;
}[keyof T] &
  string;
