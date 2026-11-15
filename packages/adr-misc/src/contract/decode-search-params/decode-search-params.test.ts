import { describe, expect, it } from "vitest";
import { z } from "zod";

import { LIST_QUERY_KEYS, createSearchParamsSchema } from "./decode-search-params";

const target = z.object({
  q: z.string().optional(),
  page: z.number().optional(),
  sort: z.array(z.string()).optional(),
});
const schema = createSearchParamsSchema(target, 10);

describe("createSearchParamsSchema", () => {
  it("lit les valeurs JSON et garde les textes bruts", () => {
    expect(schema.parse({ page: "2", sort: '["a"]', q: "dune" })).toEqual({
      page: 2,
      sort: ["a"],
      q: "dune",
    });
  });

  it("ne lit que les clés de la requête de liste", () => {
    expect(LIST_QUERY_KEYS).toEqual([
      "filter",
      "q",
      "sort",
      "page",
      "pageSize",
      "fields",
      "withTotal",
    ]);
    expect(schema.parse({ tab: "1", page: undefined })).toEqual({});
  });

  it("garde q en texte quand il serait lu comme un autre type JSON", () => {
    expect(schema.parse({ q: "42" }).q).toBe("42");
    expect(schema.parse({ q: '"42"' }).q).toBe("42");
  });

  it("refuse un paramètre trop long sans le décoder", () => {
    const { error } = schema.safeParse({ sort: '["abcdefghij"]' });
    expect(error?.issues).toEqual([
      expect.objectContaining({
        path: ["sort"],
        message: "Le paramètre « sort » dépasse 10 caractères.",
      }),
    ]);
  });

  it("accepte un objet sans prototype (parseur querystring de Node)", () => {
    const params = Object.assign(Object.create(null) as Record<string, unknown>, { page: "3" });
    expect(schema.parse(params)).toEqual({ page: 3 });
  });

  it.each([null, "page=2", ["page"]])("refuse %j comme objet de paramètres", (input) => {
    expect(schema.safeParse(input).success).toBe(false);
  });
});
