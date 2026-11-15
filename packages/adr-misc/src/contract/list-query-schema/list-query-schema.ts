import { z } from "zod";

import { ESortDirection } from "../../enums";
import type { IResolvedField } from "../field-definition";
import type { FilterNode } from "../filter-node";
import type { IListQueryLimits } from "../list-query-limits";

/** Requête de liste validée, sans le typage des noms de champs (voir `IListQuery`). */
export interface IUntypedListQuery {
  filter?: FilterNode | undefined;
  q?: string | undefined;
  sort: { field: string; direction: ESortDirection }[];
  page: number;
  pageSize: number;
  fields?: string[] | undefined;
  withTotal: boolean;
}

/** Valeurs par défaut résolues d'un contrat de liste. */
export interface IResolvedDefaults {
  readonly sort: readonly { readonly field: string; readonly direction: ESortDirection }[];
  readonly pageSize: number;
  readonly withTotal: boolean;
}

interface ISchemaParts {
  readonly fields: Readonly<Record<string, IResolvedField>>;
  readonly limits: IListQueryLimits;
  readonly defaults: IResolvedDefaults;
  readonly filter: z.ZodType<FilterNode>;
}

function fieldEnum(names: readonly string[], capability: string): z.ZodType<string> {
  const error = (issue: { input?: unknown }): string =>
    `Champ « ${String(issue.input)} » non ${capability}.`;
  return names.length ? z.enum(names as [string, ...string[]], { error }) : z.never({ error });
}

function unique<T>(key: (item: T) => string, message: string) {
  return (items: readonly T[], ctx: z.core.$RefinementCtx): void => {
    const keys = items.map(key);
    if (new Set(keys).size !== keys.length) ctx.addIssue({ code: "custom", message });
  };
}

function names(fields: ISchemaParts["fields"], capability: keyof IResolvedField): string[] {
  return Object.values(fields)
    .filter((field) => field[capability] === true)
    .map((field) => field.name);
}

function searchSchema(fields: ISchemaParts["fields"], limits: IListQueryLimits) {
  if (!names(fields, "searchable").length) {
    return z
      .never({ error: "La recherche « q » n'est pas disponible pour cette liste." })
      .optional();
  }
  return z
    .string()
    .trim()
    .max(limits.maxSearchLength)
    .transform((value) => value || undefined)
    .optional();
}

/**
 * Assemble le schéma d'une requête de liste (filtre, recherche, tri, pagination, sélection)
 * et applique les valeurs par défaut.
 *
 * Les clés inconnues sont ignorées (et non refusées) : une route front peut porter d'autres
 * paramètres d'URL que ceux de la liste. Le filtre, lui, est strict (voir
 * `createFilterSchema`).
 *
 * @param parts - Champs, limites et valeurs par défaut résolus, schéma du filtre.
 * @returns Le schéma de la requête.
 * @example
 * ```ts
 * createListQuerySchema({ fields, limits, defaults, filter }).parse({ page: 2 });
 * ```
 * @internal
 */
export function createListQuerySchema(parts: ISchemaParts): z.ZodType<IUntypedListQuery> {
  const { fields, limits, defaults } = parts;
  const sortItem = z.strictObject({
    field: fieldEnum(names(fields, "sortable"), "triable"),
    direction: z.enum([ESortDirection.ASC, ESortDirection.DESC]),
  });
  return z.object({
    filter: parts.filter.optional(),
    q: searchSchema(fields, limits),
    sort: z
      .array(sortItem)
      .max(limits.maxSortFields)
      .superRefine(
        unique((item) => item.field, "Un champ ne peut apparaître qu'une fois dans le tri."),
      )
      .default(() => defaults.sort.map((item) => ({ ...item }))),
    page: z.int().min(1).default(1),
    pageSize: z.int().min(1).max(limits.maxPageSize).default(defaults.pageSize),
    fields: z
      .array(fieldEnum(names(fields, "selectable"), "sélectionnable"))
      .min(1)
      .superRefine(unique((name) => name, "Un champ ne peut être demandé qu'une fois."))
      .optional(),
    withTotal: z.boolean().default(defaults.withTotal),
  });
}
