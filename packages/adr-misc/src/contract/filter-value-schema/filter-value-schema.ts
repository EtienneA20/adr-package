import { z } from "zod";

import type { IResolvedField } from "../field-definition";
import { EFieldType } from "../field-type";
import { EFilterOperator } from "../filter-operator";
import type { IListQueryLimits } from "../list-query-limits";

/** Opérateurs de recherche de texte (seuls à accepter `caseSensitive`). */
export const TEXT_OPERATORS: readonly EFilterOperator[] = [
  EFilterOperator.CONTAINS,
  EFilterOperator.STARTS_WITH,
  EFilterOperator.ENDS_WITH,
];

type Limits = Pick<IListQueryLimits, "maxInValues" | "maxStringLength">;

function scalarSchema(field: IResolvedField, limits: Limits): z.ZodType<string | number | boolean> {
  switch (field.type) {
    case EFieldType.NUMBER:
      return z.number();
    case EFieldType.DATE:
      return z.union([z.iso.datetime({ offset: true }), z.iso.date()], {
        error: "Date attendue au format ISO 8601 (2026-01-31 ou 2026-01-31T10:00:00Z).",
      });
    case EFieldType.BOOLEAN:
      return z.boolean();
    case EFieldType.ENUM:
      return z.enum(field.values as [string, ...string[]]);
    case EFieldType.UUID:
      return z.uuid();
    default:
      return z.string().max(limits.maxStringLength);
  }
}

function toComparable(value: string | number | boolean): number {
  return typeof value === "number" ? value : Date.parse(String(value));
}

/**
 * Crée le schéma de la valeur d'une condition, selon le type du champ et l'opérateur.
 *
 * Pourquoi un schéma par couple (champ, opérateur) : la valeur d'une condition dépend des deux
 * (`between` attend un couple ordonné, `in` une liste bornée, `isNull` un booléen) ; les
 * construire à la définition du contrat évite de les recréer à chaque requête.
 *
 * @param field - Champ filtré, déjà résolu.
 * @param operator - Opérateur, permis pour ce champ.
 * @param limits - Limites de longueur de texte et de taille de liste.
 * @returns Le schéma de la valeur.
 * @example
 * ```ts
 * createFilterValueSchema(priceField, "between", limits).parse([10, 20]);
 * ```
 * @internal
 */
export function createFilterValueSchema(
  field: IResolvedField,
  operator: EFilterOperator,
  limits: Limits,
): z.ZodType {
  if (operator === EFilterOperator.IS_NULL) return z.boolean();
  if (TEXT_OPERATORS.includes(operator)) {
    return z.string().min(1).max(limits.maxStringLength);
  }
  const scalar = scalarSchema(field, limits);
  if (operator === EFilterOperator.IN || operator === EFilterOperator.NIN) {
    return z.array(scalar).min(1).max(limits.maxInValues);
  }
  if (operator === EFilterOperator.BETWEEN) {
    return z
      .tuple([scalar, scalar])
      .refine(([min, max]) => toComparable(min) <= toComparable(max), {
        error: "La borne inférieure doit être inférieure ou égale à la borne supérieure.",
      });
  }
  return scalar;
}
