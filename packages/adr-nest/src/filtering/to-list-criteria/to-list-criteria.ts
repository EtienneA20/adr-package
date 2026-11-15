import {
  type FieldDefinitions,
  type FilterNode,
  type FilterValue,
  type IListQuery,
  type IListQueryDefinition,
  type IResolvedField,
  isFilterCondition,
} from "@etiennea20/adr-misc/contract";

import type { CriteriaNode, CriteriaValue, IListCriteria } from "../list-criteria";
import { resolveColumns } from "../resolve-columns";

/**
 * Options de conversion d'une requête de liste en critères.
 *
 * @typeParam T - Définitions des champs du contrat.
 * @example
 * ```ts
 * const options: IListCriteriaOptions<typeof bookFields> = { columns: { authorName: "author.name" } };
 * ```
 * @since 0.2.0
 */
export interface IListCriteriaOptions<T extends FieldDefinitions = FieldDefinitions> {
  /**
   * Chemin de colonne de chaque champ public (`authorName` → `author.name`), déclaré côté
   * serveur ; par défaut, le nom du champ.
   */
  readonly columns?: Partial<Record<keyof T & string, string>>;
}

interface IContext {
  readonly fields: Readonly<Record<string, IResolvedField>>;
  readonly columns: ReadonlyMap<string, string>;
}

function convertValue(field: IResolvedField | undefined, value: FilterValue): CriteriaValue {
  if (field?.type !== "date") return value;
  return Array.isArray(value)
    ? value.map((item) => new Date(String(item)))
    : new Date(String(value));
}

function column(context: IContext, field: string): string {
  return context.columns.get(field) ?? field;
}

function convertNode(context: IContext, node: FilterNode): CriteriaNode {
  if (isFilterCondition(node)) {
    return {
      path: column(context, node.field),
      op: node.op,
      value: convertValue(context.fields[node.field], node.value),
      caseSensitive: node.caseSensitive ?? false,
    };
  }
  if ("not" in node) return { not: convertNode(context, node.not) };
  if ("and" in node) return { and: node.and.map((child) => convertNode(context, child)) };
  return { or: node.or.map((child) => convertNode(context, child)) };
}

function searchNode(context: IContext, q: string | undefined): CriteriaNode | undefined {
  if (!q) return undefined;
  const conditions = Object.values(context.fields)
    .filter((field) => field.searchable)
    .map((field) => ({
      path: column(context, field.name),
      op: "contains" as const,
      value: q,
      caseSensitive: false,
    }));
  return { or: conditions };
}

/**
 * Convertit une requête de liste **validée** en critères neutres vis-à-vis de l'ORM.
 *
 * À utiliser quand la requête a été validée autrement que par `ListQuery` (message de file,
 * appel interne). Les noms publics deviennent des chemins de colonnes ; les dates du contrat
 * deviennent des `Date` ; la recherche `q` devient un groupe `or` de `contains` (insensibles à
 * la casse) sur les champs `search: true`, combiné au filtre par `and`.
 *
 * @typeParam T - Définitions des champs du contrat.
 * @param definition - Contrat de liste (`defineListQuery`).
 * @param query - Requête validée par `definition.schema` ou `definition.searchParamsSchema`.
 * @param options - Chemins de colonnes.
 * @returns Les critères de liste.
 * @throws {@link ListQueryConfigError} Si `options.columns` cite un champ absent du contrat ou un chemin invalide.
 * @example
 * ```ts
 * const query = bookListQuery.schema.parse(message.payload);
 * const criteria = toListCriteria(bookListQuery, query, { columns: { authorName: "author.name" } });
 * ```
 * @since 0.2.0
 */
export function toListCriteria<T extends FieldDefinitions>(
  definition: IListQueryDefinition<T>,
  query: IListQuery<T>,
  options: IListCriteriaOptions<T> = {},
): IListCriteria {
  const context: IContext = {
    fields: definition.fields,
    columns: resolveColumns(definition, options.columns),
  };
  const nodes = [
    query.filter && convertNode(context, query.filter),
    searchNode(context, query.q),
  ].filter((node) => node !== undefined);
  return {
    where: nodes.length > 1 ? { and: nodes } : nodes[0],
    orderBy: query.sort.map((item) => ({
      path: column(context, item.field),
      direction: item.direction,
    })),
    select: query.fields?.map((field) => column(context, field)),
    skip: (query.page - 1) * query.pageSize,
    take: query.pageSize + 1,
    page: query.page,
    pageSize: query.pageSize,
    withTotal: query.withTotal,
  };
}
