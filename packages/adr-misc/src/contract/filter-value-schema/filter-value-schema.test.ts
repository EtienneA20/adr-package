import { describe, expect, it } from "vitest";

import type { IResolvedField } from "../field-definition";
import type { EFieldType } from "../field-type";
import type { EFilterOperator } from "../filter-operator";
import { createFilterValueSchema } from "./filter-value-schema";

const limits = { maxInValues: 3, maxStringLength: 5 };

function field(type: EFieldType, values?: string[]): IResolvedField {
  return {
    name: "f",
    type,
    values,
    operators: [],
    sortable: false,
    selectable: false,
    searchable: false,
  };
}

function accepts(type: EFieldType, operator: EFilterOperator, value: unknown): boolean {
  const values = type === "enum" ? ["a", "b"] : undefined;
  return createFilterValueSchema(field(type, values), operator, limits).safeParse(value).success;
}

describe("createFilterValueSchema", () => {
  it.each<[EFieldType, unknown, unknown]>([
    ["string", "abc", 1],
    ["string", "abcde", "abcdef"],
    ["number", 1.5, "1.5"],
    ["number", -3, Number.POSITIVE_INFINITY],
    ["boolean", false, "false"],
    ["enum", "a", "c"],
    ["uuid", "0b6f8c6e-1f3a-4c2e-9d4b-6a7e2f1c3d5e", "123"],
    ["date", "2026-01-31", "31/01/2026"],
    ["date", "2026-01-31T10:00:00Z", "2026-02-30"],
    ["date", "2026-01-31T10:00:00+01:00", "2026-01-31T10:00:00"],
  ])("eq sur %s accepte %j et refuse %j", (type, valid, invalid) => {
    expect(accepts(type, "eq", valid)).toBe(true);
    expect(accepts(type, "eq", invalid)).toBe(false);
  });

  it("explique le format attendu d'une date invalide", () => {
    const { error } = createFilterValueSchema(field("date"), "gte", limits).safeParse("hier");
    expect(error?.issues[0]?.message).toBe(
      "Date attendue au format ISO 8601 (2026-01-31 ou 2026-01-31T10:00:00Z).",
    );
  });

  it("attend un booléen pour isNull, quel que soit le type", () => {
    expect(accepts("number", "isNull", true)).toBe(true);
    expect(accepts("number", "isNull", 1)).toBe(false);
  });

  it("attend un texte non vide et borné pour la recherche de texte", () => {
    expect(accepts("string", "contains", "dun")).toBe(true);
    expect(accepts("string", "startsWith", "")).toBe(false);
    expect(accepts("string", "endsWith", "abcdef")).toBe(false);
  });

  it("attend une liste non vide et bornée pour in et nin", () => {
    expect(accepts("enum", "in", ["a", "b"])).toBe(true);
    expect(accepts("enum", "nin", [])).toBe(false);
    expect(accepts("number", "in", [1, 2, 3, 4])).toBe(false);
    expect(accepts("enum", "in", ["a", "z"])).toBe(false);
  });

  it("attend un couple ordonné pour between", () => {
    expect(accepts("number", "between", [1, 2])).toBe(true);
    expect(accepts("number", "between", [2, 2])).toBe(true);
    expect(accepts("date", "between", ["2026-01-01", "2026-12-31T23:59:59Z"])).toBe(true);
    expect(accepts("number", "between", [1])).toBe(false);
    expect(accepts("number", "between", [1, 2, 3])).toBe(false);
  });

  it("refuse des bornes inversées avec un message explicite", () => {
    const { error } = createFilterValueSchema(field("date"), "between", limits).safeParse([
      "2026-12-31",
      "2026-01-01",
    ]);
    expect(error?.issues[0]?.message).toBe(
      "La borne inférieure doit être inférieure ou égale à la borne supérieure.",
    );
  });
});
