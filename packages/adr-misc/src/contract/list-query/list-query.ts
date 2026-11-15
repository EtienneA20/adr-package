import type { z } from "zod";

import type { ESortDirection } from "../../enums";
import { createSearchParamsSchema } from "../decode-search-params";
import type {
  FieldDefinitions,
  FilterableField,
  IResolvedField,
  SelectableField,
  SortableField,
} from "../field-definition";
import type { FilterNode } from "../filter-node";
import { createFilterSchema } from "../filter-schema";
import type { IListQueryLimits } from "../list-query-limits";
import { type IResolvedDefaults, createListQuerySchema } from "../list-query-schema";
import { resolveFields } from "../resolve-fields";
import { resolveLimits } from "../resolve-limits";

/**
 * Critère de tri d'une requête de liste.
 *
 * @typeParam F - Noms des champs triables.
 * @example
 * ```ts
 * const sort: ISortItem<"title"> = { field: "title", direction: "asc" };
 * ```
 * @since 0.3.0
 */
export interface ISortItem<F extends string = string> {
  /** Champ trié. */
  readonly field: F;
  /** Sens du tri. */
  readonly direction: ESortDirection;
}

/**
 * Valeurs appliquées quand la requête ne les précise pas.
 *
 * @typeParam F - Noms des champs triables.
 * @example
 * ```ts
 * const defaults: IListQueryDefaults<"title"> = { sort: [{ field: "title", direction: "asc" }], pageSize: 20 };
 * ```
 * @since 0.3.0
 */
export interface IListQueryDefaults<F extends string = string> {
  /** Tri par défaut (aucun si absent). */
  readonly sort?: readonly ISortItem<F>[];
  /** Taille de page par défaut (20 si absent, au plus `maxPageSize`). */
  readonly pageSize?: number;
  /** Calcul du nombre total d'éléments par défaut (`true` si absent). */
  readonly withTotal?: boolean;
}

/**
 * Options de `defineListQuery`.
 *
 * @typeParam T - Définitions des champs.
 * @example
 * ```ts
 * const options: IListQueryOptions<typeof fields> = { fields, limits: { maxDepth: 4 } };
 * ```
 * @since 0.3.0
 */
export interface IListQueryOptions<T extends FieldDefinitions> {
  /** Champs exposés, indexés par nom public (liste blanche). */
  readonly fields: T;
  /** Valeurs par défaut de la requête. */
  readonly defaults?: IListQueryDefaults<SortableField<T>>;
  /** Surcharge partielle des limites (voir `DEFAULT_LIST_QUERY_LIMITS`). */
  readonly limits?: Partial<IListQueryLimits>;
}

/**
 * Requête de liste validée, valeurs par défaut appliquées : sortie de
 * `IListQueryDefinition.schema` (`z.infer<typeof definition.schema>`).
 *
 * @typeParam T - Définitions des champs.
 * @example
 * ```ts
 * function findBooks(query: IListQuery<typeof bookFields>) {
 *   return repository.find({ skip: (query.page - 1) * query.pageSize, take: query.pageSize });
 * }
 * ```
 * @since 0.3.0
 */
export interface IListQuery<T extends FieldDefinitions = FieldDefinitions> {
  /** Arbre de filtre, absent si aucun filtre. */
  filter?: FilterNode<FilterableField<T>> | undefined;
  /** Recherche globale (texte non vide, sans espaces de bord), absente si aucune recherche. */
  q?: string | undefined;
  /** Critères de tri, dans l'ordre de priorité. */
  sort: ISortItem<SortableField<T>>[];
  /** Numéro de page, à partir de 1. */
  page: number;
  /** Taille de page. */
  pageSize: number;
  /** Champs demandés, absent pour la sélection par défaut du serveur. */
  fields?: SelectableField<T>[] | undefined;
  /** Calculer le nombre total d'éléments. */
  withTotal: boolean;
}

/**
 * Requête de liste avant validation : entrée de `IListQueryDefinition.schema`, toutes les
 * clés sont facultatives.
 *
 * @typeParam T - Définitions des champs.
 * @example
 * ```ts
 * const input: ListQueryInput<typeof bookFields> = { q: "dune", page: 2 };
 * ```
 * @since 0.3.0
 */
export type ListQueryInput<T extends FieldDefinitions = FieldDefinitions> = Partial<IListQuery<T>>;

/**
 * Contrat de liste créé par `defineListQuery` : champs et limites résolus, schémas de
 * validation.
 *
 * @typeParam T - Définitions des champs.
 * @example
 * ```ts
 * type BookListQuery = z.infer<typeof bookListQuery.schema>;
 * ```
 * @since 0.3.0
 */
export interface IListQueryDefinition<T extends FieldDefinitions = FieldDefinitions> {
  /** Champs résolus (capacités explicites, opérateurs effectifs). */
  readonly fields: Readonly<Record<keyof T & string, IResolvedField>>;
  /** Limites effectives. */
  readonly limits: Readonly<IListQueryLimits>;
  /** Valeurs par défaut effectives. */
  readonly defaults: Readonly<Required<IListQueryDefaults<SortableField<T>>>>;
  /** Schéma de la requête sous forme d'objet (corps de `POST /search`, `validateSearch`). */
  readonly schema: z.ZodType<IListQuery<T>, ListQueryInput<T>>;
  /** Schéma de la requête sous forme de paramètres d'URL (un paramètre par clé, en JSON). */
  readonly searchParamsSchema: z.ZodType<IListQuery<T>, Readonly<Record<string, unknown>>>;
}

function resolveDefaults(
  defaults: IListQueryDefaults,
  fields: Readonly<Record<string, IResolvedField>>,
  limits: IListQueryLimits,
): IResolvedDefaults {
  const { sort = [], pageSize = Math.min(20, limits.maxPageSize), withTotal = true } = defaults;
  if (!Number.isInteger(pageSize) || pageSize < 1 || pageSize > limits.maxPageSize) {
    throw new RangeError(
      `La taille de page par défaut doit être un entier entre 1 et ${limits.maxPageSize} (reçu : ${pageSize}).`,
    );
  }
  const sortFields = sort.map((item) => item.field);
  const invalid = sortFields.filter((name) => fields[name]?.sortable !== true);
  if (
    invalid.length ||
    sort.length > limits.maxSortFields ||
    new Set(sortFields).size !== sort.length
  ) {
    throw new RangeError(
      `Tri par défaut invalide : champs triables distincts attendus, ${limits.maxSortFields} au plus.`,
    );
  }
  return Object.freeze({
    sort: Object.freeze(sort.map((item) => ({ ...item }))),
    pageSize,
    withTotal,
  });
}

/**
 * Définit le contrat d'une liste paginée : champs exposés (liste blanche) et ce que le client
 * peut en faire (filtrer, trier, sélectionner, rechercher), limites et valeurs par défaut.
 *
 * À déclarer une seule fois dans le code partagé entre le front et l'API : le front valide
 * ses paramètres d'URL avec `schema` (TanStack Router `validateSearch`, react-hook-form) et
 * les encode avec `toListQuerySearchParams` ; le serveur valide la requête reçue avec
 * `searchParamsSchema` (paramètres d'URL) ou `schema` (corps de `POST /search`). Tout est
 * refusé par défaut : un champ absent de `fields`, ou sans la capacité demandée, est rejeté.
 * Les noms de champs sont publics : le serveur les associe à ses colonnes. La requête validée
 * ne contient jamais de requête brute.
 *
 * @typeParam T - Définitions des champs (types littéraux conservés).
 * @param options - Champs, valeurs par défaut et limites.
 * @returns Le contrat : champs et limites résolus, schémas de validation.
 * @throws {@link RangeError} Si la définition est invalide : aucun champ, nom de champ
 * invalide, type inconnu, `values` manquant ou superflu, opérateur incompatible avec le type,
 * recherche sur un champ non textuel, limite non entière ou non positive, taille de page ou tri
 * par défaut incohérents.
 * @example
 * ```ts
 * export const bookListQuery = defineListQuery({
 *   fields: {
 *     id: { type: "uuid", filter: ["eq", "in"], select: true },
 *     title: { type: "string", filter: true, sort: true, select: true, search: true },
 *     status: { type: "enum", values: ["available", "loaned"], filter: true, select: true },
 *     publishedAt: { type: "date", filter: true, sort: true, select: true },
 *     "author.name": { type: "string", filter: ["eq", "contains"], sort: true, search: true },
 *   },
 *   defaults: { sort: [{ field: "title", direction: "asc" }], pageSize: 20 },
 *   limits: { maxDepth: 4, maxConditions: 50 },
 * });
 *
 * export type BookListQuery = z.infer<typeof bookListQuery.schema>;
 * bookListQuery.schema.parse({ q: "dune" }); // { q: "dune", sort: [...], page: 1, pageSize: 20, withTotal: true }
 * ```
 * @since 0.3.0
 */
export function defineListQuery<const T extends FieldDefinitions>(
  options: IListQueryOptions<T>,
): IListQueryDefinition<T> {
  const fields = resolveFields(options.fields);
  const limits = resolveLimits(options.limits);
  const defaults = resolveDefaults(options.defaults ?? {}, fields, limits);
  const filter = createFilterSchema(fields, limits);
  const schema = createListQuerySchema({ fields, limits, defaults, filter });
  return Object.freeze({
    fields,
    limits,
    defaults,
    schema,
    searchParamsSchema: createSearchParamsSchema(schema, limits.maxParamLength),
  }) as unknown as IListQueryDefinition<T>;
}
