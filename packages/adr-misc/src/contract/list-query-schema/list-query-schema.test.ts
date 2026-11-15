import { describe, expect, it } from "vitest";

import { createFilterSchema } from "../filter-schema";
import { resolveFields } from "../resolve-fields";
import { resolveLimits } from "../resolve-limits";
import { createListQuerySchema } from "./list-query-schema";

const limits = resolveLimits({ maxSortFields: 2, maxPageSize: 50, maxSearchLength: 5 });

function build(fields: Parameters<typeof resolveFields>[0]) {
  const resolved = resolveFields(fields);
  return createListQuerySchema({
    fields: resolved,
    limits,
    defaults: { sort: [], pageSize: 10, withTotal: false },
    filter: createFilterSchema(resolved, limits),
  });
}

describe("createListQuerySchema", () => {
  const schema = build({
    title: { type: "string", sort: true, select: true, search: true },
    year: { type: "number", filter: true, sort: true },
  });

  it("applique les valeurs par défaut fournies", () => {
    expect(schema.parse({})).toEqual({ sort: [], page: 1, pageSize: 10, withTotal: false });
  });

  it("applique les limites de tri, de page et de recherche", () => {
    const sort = [
      { field: "title", direction: "asc" },
      { field: "year", direction: "desc" },
    ];
    expect(schema.safeParse({ sort }).success).toBe(true);
    expect(schema.safeParse({ sort: [...sort, sort[0]] }).success).toBe(false);
    expect(schema.safeParse({ pageSize: 51 }).success).toBe(false);
    expect(schema.safeParse({ q: "abcdef" }).success).toBe(false);
  });

  it("refuse un critère de tri avec une clé inconnue", () => {
    expect(
      schema.safeParse({ sort: [{ field: "title", direction: "asc", nulls: "last" }] }).success,
    ).toBe(false);
  });

  it("refuse le tri et la sélection quand aucun champ ne les permet", () => {
    const minimal = build({ a: { type: "string" } });
    const { error } = minimal.safeParse({
      sort: [{ field: "a", direction: "asc" }],
      fields: ["a"],
    });
    expect(error?.issues.map((issue) => issue.message)).toEqual([
      "Champ « a » non triable.",
      "Champ « a » non sélectionnable.",
    ]);
  });
});
