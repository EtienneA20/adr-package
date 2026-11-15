/**
 * Opérateurs de comparaison d'une condition de filtre du contrat de liste.
 *
 * À utiliser pour construire une condition (`{ field, op, value }`) côté front, ou pour
 * l'interpréter côté serveur. Les opérateurs permis dépendent du type du champ (voir
 * `FIELD_TYPE_OPERATORS`) et de sa définition (`defineListQuery`). Valeur attendue :
 *
 * - `eq`, `ne`, `gt`, `gte`, `lt`, `lte` : une valeur du type du champ ;
 * - `between` : un couple `[min, max]` (bornes incluses, `min ≤ max`) ;
 * - `in`, `nin` : un tableau non vide de valeurs ;
 * - `contains`, `startsWith`, `endsWith` : un texte non vide (insensible à la casse par
 *   défaut, voir `IFilterCondition.caseSensitive`) ;
 * - `isNull` : `true` (valeur absente) ou `false` (valeur présente).
 *
 * @example
 * ```ts
 * const condition = { field: "title", op: EFilterOperator.CONTAINS, value: "dune" };
 * ```
 * @since 0.3.0
 */
export const EFilterOperator = {
  EQ: "eq",
  NE: "ne",
  GT: "gt",
  GTE: "gte",
  LT: "lt",
  LTE: "lte",
  BETWEEN: "between",
  IN: "in",
  NIN: "nin",
  CONTAINS: "contains",
  STARTS_WITH: "startsWith",
  ENDS_WITH: "endsWith",
  IS_NULL: "isNull",
} as const;

/** Valeur possible de {@link EFilterOperator}. */
export type EFilterOperator = (typeof EFilterOperator)[keyof typeof EFilterOperator];
