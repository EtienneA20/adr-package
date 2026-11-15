import { z } from "zod";

import { EApiErrorCode } from "../api-error-code";
import type { IResolvedField } from "../field-definition";
import type { FilterNode } from "../filter-node";
import type { EFilterOperator } from "../filter-operator";
import { TEXT_OPERATORS, createFilterValueSchema } from "../filter-value-schema";
import type { IListQueryLimits } from "../list-query-limits";
import { measureFilter } from "../measure-filter";

type Fields = Readonly<Record<string, IResolvedField>>;
type ValueSchemas = ReadonlyMap<string, ReadonlyMap<EFilterOperator, z.ZodType>>;
type Context = z.core.$RefinementCtx;

const INVALID_NODE =
  "Nœud de filtre invalide : attendu une condition { field, op, value } ou un groupe { and }, { or } ou { not }.";

const conditionShape = z.strictObject({
  field: z.string(),
  op: z.string(),
  value: z.unknown(),
  caseSensitive: z.boolean().optional(),
});

type ConditionInput = z.infer<typeof conditionShape>;

function forward<T>(result: z.ZodSafeParseResult<T>, ctx: Context): T {
  if (result.success) return result.data;
  for (const issue of result.error.issues) ctx.addIssue({ ...issue });
  return z.NEVER;
}

function buildValueSchemas(fields: Fields, limits: IListQueryLimits): ValueSchemas {
  return new Map(
    Object.values(fields)
      .filter((field) => field.operators.length > 0)
      .map((field) => [
        field.name,
        new Map(
          field.operators.map((op) => [op, createFilterValueSchema(field, op, limits)] as const),
        ),
      ]),
  );
}

function checkCondition(condition: ConditionInput, schemas: ValueSchemas, ctx: Context): void {
  const operators = schemas.get(condition.field);
  if (!operators) {
    ctx.addIssue({
      code: "custom",
      path: ["field"],
      message: `Le champ « ${condition.field} » n'est pas filtrable.`,
    });
    return;
  }
  const valueSchema = operators.get(condition.op as EFilterOperator);
  if (!valueSchema) {
    ctx.addIssue({
      code: "custom",
      path: ["op"],
      message: `Opérateur « ${condition.op} » non permis pour le champ « ${condition.field} » (permis : ${[...operators.keys()].join(", ")}).`,
    });
    return;
  }
  if (
    condition.caseSensitive !== undefined &&
    !TEXT_OPERATORS.includes(condition.op as EFilterOperator)
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["caseSensitive"],
      message:
        "L'option « caseSensitive » ne s'applique qu'aux opérateurs contains, startsWith et endsWith.",
    });
  }
  for (const issue of valueSchema.safeParse(condition.value).error?.issues ?? []) {
    ctx.addIssue({ ...issue, path: ["value", ...issue.path] });
  }
}

function nodeKind(input: unknown): "condition" | "and" | "or" | "not" | undefined {
  if (typeof input !== "object" || input === null || Array.isArray(input)) return undefined;
  if (Object.hasOwn(input, "field")) return "condition";
  const groups = (["and", "or", "not"] as const).filter((key) => Object.hasOwn(input, key));
  return groups.length === 1 ? groups[0] : undefined;
}

/**
 * Crée le schéma de l'arbre de filtre d'un contrat de liste.
 *
 * Pourquoi un aiguillage manuel plutôt qu'une union zod : une union essaie chaque branche et
 * renvoie, en cas d'échec, une erreur « Invalid input » peu exploitable. Ici, la forme du nœud
 * (`field` ou une seule clé `and` / `or` / `not`) choisit le schéma, et les problèmes renvoyés
 * pointent le champ fautif (`filter.or.1.value`). Les limites (profondeur, nombre de
 * conditions) sont mesurées avant la validation récursive (voir `measureFilter`) ; leur
 * dépassement porte `params.code = "QUERY_LIMIT_EXCEEDED"`.
 *
 * @param fields - Champs résolus du contrat.
 * @param limits - Limites du contrat.
 * @returns Le schéma de l'arbre de filtre.
 * @example
 * ```ts
 * createFilterSchema(fields, limits).parse({ field: "title", op: "contains", value: "dune" });
 * ```
 * @internal
 */
export function createFilterSchema(
  fields: Fields,
  limits: IListQueryLimits,
): z.ZodType<FilterNode> {
  const schemas = buildValueSchemas(fields, limits);
  const condition = conditionShape.superRefine((input, ctx) => {
    checkCondition(input, schemas, ctx);
  });
  const node: z.ZodType<FilterNode> = z.unknown().transform((input, ctx) => {
    const kind = nodeKind(input);
    if (kind === undefined) {
      ctx.addIssue({ code: "custom", message: INVALID_NODE });
      return z.NEVER;
    }
    return forward(groups[kind].safeParse(input), ctx) as FilterNode;
  });
  const groups: Readonly<Record<NonNullable<ReturnType<typeof nodeKind>>, z.ZodType>> = {
    condition,
    and: z.strictObject({ and: z.array(node).min(1) }),
    or: z.strictObject({ or: z.array(node).min(1) }),
    not: z.strictObject({ not: node }),
  };
  return z.unknown().transform((input, ctx) => {
    const violation = measureFilter(input, limits);
    if (violation) {
      ctx.addIssue({
        code: "custom",
        message: violation.message,
        params: { code: EApiErrorCode.QUERY_LIMIT_EXCEEDED, limit: violation.limit },
      });
      return z.NEVER;
    }
    return forward(node.safeParse(input), ctx);
  });
}
