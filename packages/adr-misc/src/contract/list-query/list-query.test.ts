import { describe, expect, expectTypeOf, it } from "vitest";
import type { z } from "zod";

import type { FilterNode } from "../filter-node";
import { toListQuerySearchParams } from "../search-params";
import {
  type IListQuery,
  type IListQueryDefinition,
  type ISortItem,
  defineListQuery,
} from "./list-query";

const bookListQuery = defineListQuery({
  fields: {
    id: { type: "uuid", filter: ["eq", "in"], select: true },
    title: { type: "string", filter: true, sort: true, select: true, search: true },
    status: { type: "enum", values: ["available", "loaned"], filter: true, select: true },
    publishedAt: { type: "date", filter: true, sort: true, select: true },
    "author.name": { type: "string", filter: ["eq", "contains"], sort: true, search: true },
    internalNote: { type: "string" },
  },
  defaults: { sort: [{ field: "title", direction: "asc" }], pageSize: 20 },
  limits: { maxDepth: 4, maxConditions: 50 },
});

type BookListQuery = z.infer<typeof bookListQuery.schema>;

const defaults = {
  sort: [{ field: "title", direction: "asc" }],
  page: 1,
  pageSize: 20,
  withTotal: true,
};

function paths(input: unknown): string[] {
  return (bookListQuery.schema.safeParse(input).error?.issues ?? []).map((issue) =>
    issue.path.join("."),
  );
}

describe("defineListQuery", () => {
  it("applique les valeurs par défaut à une requête vide", () => {
    expect(bookListQuery.schema.parse({})).toEqual(defaults);
  });

  it("valide une requête complète", () => {
    const query = {
      filter: {
        or: [
          { field: "status", op: "eq", value: "available" },
          {
            and: [
              { field: "publishedAt", op: "gte", value: "2020-01-01T00:00:00Z" },
              { not: { field: "author.name", op: "contains", value: "herbert" } },
            ],
          },
        ],
      },
      q: "dune",
      sort: [
        { field: "publishedAt", direction: "desc" },
        { field: "title", direction: "asc" },
      ],
      page: 2,
      pageSize: 50,
      fields: ["id", "title"],
      withTotal: false,
    };
    expect(bookListQuery.schema.parse(query)).toEqual(query);
  });

  it("ignore les clés inconnues au premier niveau", () => {
    expect(bookListQuery.schema.parse({ tab: "catalogue" })).toEqual(defaults);
  });

  it("ne partage pas le tri par défaut entre deux requêtes", () => {
    const first = bookListQuery.schema.parse({});
    first.sort.push({ field: "publishedAt", direction: "desc" });
    expect(bookListQuery.schema.parse({}).sort).toHaveLength(1);
  });

  it("retire les espaces de la recherche et ignore une recherche vide", () => {
    expect(bookListQuery.schema.parse({ q: "  dune " }).q).toBe("dune");
    expect(bookListQuery.schema.parse({ q: "   " }).q).toBeUndefined();
  });

  it.each([
    ["un champ non triable", { sort: [{ field: "status", direction: "asc" }] }, "sort.0.field"],
    ["un sens de tri inconnu", { sort: [{ field: "title", direction: "up" }] }, "sort.0.direction"],
    [
      "un tri en double",
      {
        sort: [
          { field: "title", direction: "asc" },
          { field: "title", direction: "desc" },
        ],
      },
      "sort",
    ],
    ["un champ non sélectionnable", { fields: ["internalNote"] }, "fields.0"],
    ["une sélection vide", { fields: [] }, "fields"],
    ["une sélection en double", { fields: ["id", "id"] }, "fields"],
    ["une page 0", { page: 0 }, "page"],
    ["une page non entière", { page: 1.5 }, "page"],
    ["une taille de page trop grande", { pageSize: 101 }, "pageSize"],
    ["une recherche trop longue", { q: "x".repeat(101) }, "q"],
    [
      "un filtre sur un champ non filtrable",
      { filter: { field: "internalNote", op: "eq", value: "x" } },
      "filter.field",
    ],
    ["withTotal non booléen", { withTotal: "non" }, "withTotal"],
  ])("refuse %s", (_label, input, path) => {
    expect(paths(input)).toEqual([path]);
  });

  it("refuse trop de champs de tri", () => {
    const sort = ["title", "publishedAt", "author.name", "title"].map((field) => ({
      field,
      direction: "asc",
    }));
    expect(paths({ sort })).toContain("sort");
  });

  it("nomme le champ refusé dans le message", () => {
    const { error } = bookListQuery.schema.safeParse({ fields: ["internalNote"] });
    expect(error?.issues[0]?.message).toBe("Champ « internalNote » non sélectionnable.");
  });

  it("expose les champs résolus, les limites et les valeurs par défaut", () => {
    expect(bookListQuery.fields.status.operators).toEqual(["eq", "ne", "in", "nin", "isNull"]);
    expect(bookListQuery.fields.internalNote.operators).toEqual([]);
    expect(bookListQuery.limits).toMatchObject({
      maxDepth: 4,
      maxConditions: 50,
      maxPageSize: 100,
    });
    expect(bookListQuery.defaults).toEqual({
      sort: [{ field: "title", direction: "asc" }],
      pageSize: 20,
      withTotal: true,
    });
    expect(Object.isFrozen(bookListQuery)).toBe(true);
  });

  it("type la requête à partir des définitions de champs", () => {
    expectTypeOf<BookListQuery>().toEqualTypeOf<
      typeof bookListQuery extends IListQueryDefinition<infer T> ? IListQuery<T> : never
    >();
    expectTypeOf<BookListQuery["sort"]>().toEqualTypeOf<
      ISortItem<"title" | "publishedAt" | "author.name">[]
    >();
    expectTypeOf<BookListQuery["fields"]>().toEqualTypeOf<
      ("id" | "title" | "status" | "publishedAt")[] | undefined
    >();
    expectTypeOf<BookListQuery["filter"]>().toEqualTypeOf<
      FilterNode<"id" | "title" | "status" | "publishedAt" | "author.name"> | undefined
    >();
  });

  it("expose l'interface Standard Schema (TanStack Router, NestJS 12, react-hook-form)", async () => {
    for (const schema of [bookListQuery.schema, bookListQuery.searchParamsSchema]) {
      expect(schema["~standard"]).toMatchObject({ version: 1, vendor: "zod" });
    }
    const valid = await bookListQuery.schema["~standard"].validate({ page: 2 });
    expect(valid).toEqual({ value: { ...defaults, page: 2 } });
    const invalid = await bookListQuery.searchParamsSchema["~standard"].validate({ page: "0" });
    expect("issues" in invalid && invalid.issues?.[0]?.path).toEqual(["page"]);
  });
});

describe("defineListQuery : paramètres d'URL", () => {
  it("décode une requête encodée par toListQuerySearchParams", () => {
    const query = {
      filter: { field: "title", op: "contains", value: "dune" },
      q: "123",
      sort: [{ field: "publishedAt", direction: "desc" }],
      page: 3,
      pageSize: 10,
      fields: ["id"],
      withTotal: false,
    };
    const params = toListQuerySearchParams(query);
    expect(bookListQuery.searchParamsSchema.parse(params)).toEqual(query);
  });

  it("lit les valeurs saisies à la main dans l'URL", () => {
    expect(
      bookListQuery.searchParamsSchema.parse({
        q: "dune",
        page: "2",
        withTotal: "false",
        utm: "x",
      }),
    ).toEqual({ ...defaults, q: "dune", page: 2, withTotal: false });
  });

  it("garde q en texte même s'il ressemble à du JSON", () => {
    expect(bookListQuery.searchParamsSchema.parse({ q: "2026" }).q).toBe("2026");
    expect(bookListQuery.searchParamsSchema.parse({ q: "true" }).q).toBe("true");
  });

  it("refuse un paramètre répété ou imbriqué", () => {
    const { error } = bookListQuery.searchParamsSchema.safeParse({ page: ["1", "2"] });
    expect(error?.issues[0]).toMatchObject({
      path: ["page"],
      message: "Le paramètre « page » doit apparaître une seule fois, sous forme de texte.",
    });
    expect(bookListQuery.searchParamsSchema.safeParse({ filter: { field: "title" } }).success).toBe(
      false,
    );
  });

  it("refuse un paramètre trop long avant de le décoder, avec le code de limite", () => {
    const { error } = bookListQuery.searchParamsSchema.safeParse({ filter: " ".repeat(4097) });
    expect(error?.issues).toEqual([
      expect.objectContaining({
        path: ["filter"],
        params: { code: "QUERY_LIMIT_EXCEEDED", limit: "maxParamLength" },
      }),
    ]);
  });

  it("refuse un filtre qui n'est pas du JSON valide", () => {
    expect(
      bookListQuery.searchParamsSchema.safeParse({ filter: "{oops" }).error?.issues[0]?.path,
    ).toEqual(["filter"]);
  });

  it("refuse autre chose qu'un objet de paramètres", () => {
    expect(bookListQuery.searchParamsSchema.safeParse("page=2").error?.issues[0]?.message).toBe(
      "Les paramètres de la requête doivent être un objet.",
    );
  });

  it("ignore une clé __proto__ sans modifier de prototype", () => {
    const params = JSON.parse('{"__proto__":{"admin":true},"page":"2"}') as Record<string, unknown>;
    const query = bookListQuery.searchParamsSchema.parse(params);
    expect(query.page).toBe(2);
    expect(Object.getPrototypeOf(query)).toBe(Object.prototype);
    expect(({} as Record<string, unknown>).admin).toBeUndefined();
  });
});

describe("defineListQuery : erreurs de définition", () => {
  it("refuse une définition sans champ", () => {
    expect(() => defineListQuery({ fields: {} })).toThrow(RangeError);
  });

  it("refuse une limite invalide", () => {
    expect(() =>
      defineListQuery({ fields: { a: { type: "string" } }, limits: { maxDepth: 0 } }),
    ).toThrow("La limite « maxDepth »");
  });

  it.each([0, 101, 2.5])("refuse la taille de page par défaut %j", (pageSize) => {
    expect(() =>
      defineListQuery({ fields: { a: { type: "string" } }, defaults: { pageSize } }),
    ).toThrow("La taille de page par défaut doit être un entier entre 1 et 100");
  });

  it("borne la taille de page par défaut à maxPageSize", () => {
    const definition = defineListQuery({
      fields: { a: { type: "string" } },
      limits: { maxPageSize: 10 },
    });
    expect(definition.defaults.pageSize).toBe(10);
  });

  it("refuse un tri par défaut sur un champ non triable, en double ou trop long", () => {
    const fields = { a: { type: "string", sort: true }, b: { type: "string" } } as const;
    const invalid = [
      [{ field: "b", direction: "asc" }],
      [
        { field: "a", direction: "asc" },
        { field: "a", direction: "desc" },
      ],
    ] as const;
    for (const sort of invalid) {
      expect(() => defineListQuery({ fields, defaults: { sort: sort as never } })).toThrow(
        "Tri par défaut invalide",
      );
    }
    expect(() =>
      defineListQuery({
        fields,
        defaults: { sort: [{ field: "a", direction: "asc" }] },
        limits: { maxSortFields: 1 },
      }),
    ).not.toThrow();
  });

  it("refuse q quand aucun champ n'est inclus dans la recherche", () => {
    const definition = defineListQuery({ fields: { a: { type: "string", sort: true } } });
    expect(definition.schema.safeParse({ q: "x" }).error?.issues[0]?.message).toBe(
      "La recherche « q » n'est pas disponible pour cette liste.",
    );
    expect(definition.schema.safeParse({ fields: ["a"] }).error?.issues[0]?.message).toBe(
      "Champ « a » non sélectionnable.",
    );
  });
});
