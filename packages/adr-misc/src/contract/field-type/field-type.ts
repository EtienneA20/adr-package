import { EFilterOperator } from "../filter-operator";

/**
 * Types de champ du contrat de liste : ils fixent le format des valeurs de filtre et les
 * opérateurs permis.
 *
 * À utiliser dans la définition des champs passée à `defineListQuery`. Format des valeurs
 * (JSON) : `string` (texte), `number` (nombre fini), `date` (texte ISO 8601, date seule
 * `2026-01-31` ou date-heure avec fuseau `2026-01-31T10:00:00Z`), `boolean`, `enum` (une des
 * valeurs déclarées), `uuid` (texte UUID).
 *
 * @example
 * ```ts
 * const fields = { title: { type: EFieldType.STRING, filter: true } };
 * ```
 * @since 0.3.0
 */
export const EFieldType = {
  STRING: "string",
  NUMBER: "number",
  DATE: "date",
  BOOLEAN: "boolean",
  ENUM: "enum",
  UUID: "uuid",
} as const;

/** Valeur possible de {@link EFieldType}. */
export type EFieldType = (typeof EFieldType)[keyof typeof EFieldType];

const { EQ, NE, GT, GTE, LT, LTE, BETWEEN, IN, NIN, CONTAINS, STARTS_WITH, ENDS_WITH, IS_NULL } =
  EFilterOperator;
const ORDERED = [EQ, NE, GT, GTE, LT, LTE, BETWEEN, IN, NIN, IS_NULL] as const;

/**
 * Opérateurs permis pour chaque type de champ, quand la définition d'un champ indique
 * `filter: true`.
 *
 * À utiliser côté front pour proposer les opérateurs d'un champ (menu d'un filtre de colonne),
 * ou pour restreindre un champ à un sous-ensemble (`filter: ["eq", "in"]`) : un opérateur hors
 * de cette liste est refusé par `defineListQuery`.
 *
 * @example
 * ```ts
 * FIELD_TYPE_OPERATORS.boolean; // ["eq", "ne", "isNull"]
 * ```
 * @since 0.3.0
 */
export const FIELD_TYPE_OPERATORS: Readonly<Record<EFieldType, readonly EFilterOperator[]>> = {
  string: [EQ, NE, IN, NIN, CONTAINS, STARTS_WITH, ENDS_WITH, IS_NULL],
  number: ORDERED,
  date: ORDERED,
  boolean: [EQ, NE, IS_NULL],
  enum: [EQ, NE, IN, NIN, IS_NULL],
  uuid: [EQ, NE, IN, NIN, IS_NULL],
};
