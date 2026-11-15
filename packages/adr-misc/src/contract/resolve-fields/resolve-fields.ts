import type { FieldDefinitions, IFieldDefinition, IResolvedField } from "../field-definition";
import { EFieldType, FIELD_TYPE_OPERATORS } from "../field-type";
import type { EFilterOperator } from "../filter-operator";

/** Identifiant simple, ou chemin de relation à un seul niveau (`author.name`). */
const FIELD_NAME_PATTERN = /^[A-Za-z_][A-Za-z0-9_]*(?:\.[A-Za-z_][A-Za-z0-9_]*)?$/;

/** Segments refusés : ils désignent le prototype des objets JavaScript. */
const RESERVED_SEGMENTS = new Set(["__proto__", "constructor", "prototype"]);

const FIELD_TYPES = new Set<string>(Object.values(EFieldType));

function checkName(name: string): void {
  const reserved = name.split(".").some((segment) => RESERVED_SEGMENTS.has(segment));
  if (!FIELD_NAME_PATTERN.test(name) || reserved) {
    throw new RangeError(
      `Nom de champ invalide « ${name} » : identifiant simple ou chemin de relation à un niveau (« author.name »).`,
    );
  }
}

function checkValues(name: string, definition: IFieldDefinition): void {
  const { type, values } = definition;
  if (type !== EFieldType.ENUM) {
    if (values !== undefined) {
      throw new RangeError(`Champ « ${name} » : « values » est réservé au type « enum ».`);
    }
    return;
  }
  if (!values?.length || new Set(values).size !== values.length) {
    throw new RangeError(
      `Champ « ${name} » : le type « enum » exige une liste « values » non vide et sans doublon.`,
    );
  }
}

function resolveOperators(name: string, definition: IFieldDefinition): readonly EFilterOperator[] {
  const allowed = FIELD_TYPE_OPERATORS[definition.type];
  const { filter } = definition;
  if (filter === undefined || typeof filter === "boolean") return filter ? allowed : [];
  const invalid = filter.filter((operator) => !allowed.includes(operator));
  if (!filter.length || invalid.length || new Set(filter).size !== filter.length) {
    throw new RangeError(
      `Champ « ${name} » : opérateurs de filtre invalides (permis pour « ${definition.type} » : ${allowed.join(", ")}).`,
    );
  }
  return [...filter];
}

function resolveField(name: string, definition: IFieldDefinition): IResolvedField {
  checkName(name);
  if (!FIELD_TYPES.has(definition.type)) {
    throw new RangeError(`Champ « ${name} » : type inconnu « ${definition.type} ».`);
  }
  checkValues(name, definition);
  if (definition.search && definition.type !== EFieldType.STRING) {
    throw new RangeError(`Champ « ${name} » : la recherche « q » est réservée au type « string ».`);
  }
  return Object.freeze({
    name,
    type: definition.type,
    values: definition.values ? [...definition.values] : undefined,
    operators: Object.freeze(resolveOperators(name, definition)),
    sortable: definition.sort === true,
    selectable: definition.select === true,
    searchable: definition.search === true,
  });
}

/**
 * Valide les définitions de champs d'un contrat de liste et les met sous forme explicite.
 *
 * Vérifié à la définition du contrat : nom (identifiant ou relation à un niveau, sans segment
 * réservé), type connu, `values` pour `enum` uniquement, opérateurs compatibles avec le type,
 * recherche réservée au texte.
 *
 * @param fields - Définitions des champs, indexées par nom public.
 * @returns Les champs résolus, indexés par nom (objet figé).
 * @throws {@link RangeError} Si aucun champ n'est défini ou si une définition est invalide.
 * @example
 * ```ts
 * resolveFields({ title: { type: "string", filter: true } }).title.operators; // ["eq", …]
 * ```
 * @internal
 */
export function resolveFields(fields: FieldDefinitions): Readonly<Record<string, IResolvedField>> {
  const entries = Object.entries(fields);
  if (!entries.length) {
    throw new RangeError("Le contrat de liste doit définir au moins un champ.");
  }
  return Object.freeze(
    Object.fromEntries(entries.map(([name, definition]) => [name, resolveField(name, definition)])),
  );
}
