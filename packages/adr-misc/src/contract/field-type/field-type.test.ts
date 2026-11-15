import { describe, expect, expectTypeOf, it } from "vitest";

import { EFieldType, FIELD_TYPE_OPERATORS } from "./field-type";

describe("EFieldType", () => {
  it("contient les 6 types de champ", () => {
    expect(Object.values(EFieldType)).toEqual([
      "string",
      "number",
      "date",
      "boolean",
      "enum",
      "uuid",
    ]);
  });

  it("expose le type union des valeurs", () => {
    expectTypeOf<EFieldType>().toEqualTypeOf<
      "string" | "number" | "date" | "boolean" | "enum" | "uuid"
    >();
  });
});

describe("FIELD_TYPE_OPERATORS", () => {
  it("définit les opérateurs de chaque type", () => {
    expect(Object.keys(FIELD_TYPE_OPERATORS).sort()).toEqual(
      Object.values(EFieldType).slice().sort(),
    );
  });

  it("réserve les comparaisons d'ordre aux nombres et aux dates", () => {
    expect(FIELD_TYPE_OPERATORS.number).toContain("between");
    expect(FIELD_TYPE_OPERATORS.date).toContain("gte");
    expect(FIELD_TYPE_OPERATORS.string).not.toContain("gt");
    expect(FIELD_TYPE_OPERATORS.enum).not.toContain("lt");
  });

  it("réserve la recherche de texte aux chaînes", () => {
    expect(FIELD_TYPE_OPERATORS.string).toEqual(
      expect.arrayContaining(["contains", "startsWith", "endsWith"]),
    );
    expect(FIELD_TYPE_OPERATORS.uuid).not.toContain("contains");
  });

  it("permet isNull pour tous les types", () => {
    for (const operators of Object.values(FIELD_TYPE_OPERATORS)) {
      expect(operators).toContain("isNull");
    }
  });
});
