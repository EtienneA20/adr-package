import { describe, expect, it } from "vitest";

import { resolveFields } from "../resolve-fields";
import { resolveLimits } from "../resolve-limits";
import { createFilterSchema } from "./filter-schema";

const fields = resolveFields({
  title: { type: "string", filter: true },
  price: { type: "number", filter: ["gte", "lte", "between"] },
  status: { type: "enum", values: ["available", "loaned"], filter: ["eq", "in"] },
  "author.name": { type: "string", filter: ["contains"] },
  isbn: { type: "string" },
});
const schema = createFilterSchema(fields, resolveLimits({ maxDepth: 3, maxConditions: 3 }));

const title = { field: "title", op: "contains", value: "dune" };

function issues(input: unknown): { path: string; message: string; params?: unknown }[] {
  return (schema.safeParse(input).error?.issues ?? []).map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
    ...("params" in issue ? { params: issue.params } : {}),
  }));
}

describe("createFilterSchema", () => {
  it("accepte une condition et la renvoie telle quelle", () => {
    expect(schema.parse(title)).toEqual(title);
  });

  it("accepte des groupes and, or et not imbriqués", () => {
    const filter = {
      or: [
        { field: "status", op: "in", value: ["available"] },
        { and: [{ field: "price", op: "between", value: [5, 20] }, { not: title }] },
      ],
    };
    expect(schema.parse(filter)).toEqual(filter);
  });

  it("accepte un chemin de relation déclaré et caseSensitive sur un opérateur de texte", () => {
    const condition = {
      field: "author.name",
      op: "contains",
      value: "Herbert",
      caseSensitive: true,
    };
    expect(schema.parse(condition)).toEqual(condition);
  });

  it("refuse un champ hors de la liste blanche", () => {
    expect(issues({ field: "isbn", op: "eq", value: "x" })).toEqual([
      { path: "field", message: "Le champ « isbn » n'est pas filtrable." },
    ]);
    expect(issues({ field: "password", op: "eq", value: "x" })[0]?.path).toBe("field");
  });

  it("refuse un opérateur non permis pour le champ", () => {
    expect(issues({ field: "price", op: "eq", value: 3 })).toEqual([
      {
        path: "op",
        message:
          "Opérateur « eq » non permis pour le champ « price » (permis : gte, lte, between).",
      },
    ]);
  });

  it("refuse caseSensitive hors des opérateurs de texte", () => {
    expect(issues({ field: "title", op: "eq", value: "x", caseSensitive: false })[0]?.path).toBe(
      "caseSensitive",
    );
  });

  it("indique le chemin d'une valeur invalide dans un groupe", () => {
    expect(issues({ or: [title, { field: "price", op: "gte", value: "10" }] })[0]?.path).toBe(
      "or.1.value",
    );
    expect(issues({ field: "price", op: "between", value: [1, "x"] })[0]?.path).toBe("value.1");
  });

  it.each([
    ["une valeur non objet", 42],
    ["un tableau", [title]],
    ["null", null],
    ["un objet vide", {}],
    ["deux groupes dans un même nœud", { and: [title], or: [title] }],
  ])("refuse %s comme nœud", (_label, input) => {
    expect(issues(input)[0]?.message).toMatch(/^Nœud de filtre invalide/);
  });

  it("refuse un groupe vide", () => {
    expect(issues({ and: [] })[0]?.path).toBe("and");
  });

  it("refuse les clés inconnues, y compris __proto__", () => {
    expect(issues({ ...title, extra: 1 })[0]?.message).toMatch(/extra/);
    expect(
      issues(
        JSON.parse('{"and":[{"field":"title","op":"eq","value":"x"}],"__proto__":{"admin":true}}'),
      ),
    ).not.toEqual([]);
    expect(({} as Record<string, unknown>).admin).toBeUndefined();
  });

  it("refuse un arbre trop profond avec le code de limite", () => {
    expect(issues({ not: { not: { not: { not: title } } } })).toEqual([
      {
        path: "",
        message: "Le filtre dépasse 3 niveaux de groupes imbriqués.",
        params: { code: "QUERY_LIMIT_EXCEEDED", limit: "maxDepth" },
      },
    ]);
  });

  it("refuse trop de conditions avec le code de limite", () => {
    expect(issues({ and: [title, title, title, title] })[0]?.params).toEqual({
      code: "QUERY_LIMIT_EXCEEDED",
      limit: "maxConditions",
    });
  });
});
