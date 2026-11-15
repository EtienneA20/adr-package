import { describe, expect, expectTypeOf, it } from "vitest";
import { z } from "zod";

import { type IPage, pageSchema } from "./page";

const bookPageSchema = pageSchema(
  z.object({ title: z.string(), publishedAt: z.iso.date().transform((value) => new Date(value)) }),
);

const page = {
  items: [{ title: "Dune", publishedAt: "1965-08-01" }],
  page: 1,
  pageSize: 20,
  total: 1,
  pageCount: 1,
  hasNextPage: false,
};

describe("pageSchema", () => {
  it("valide une page et applique le schéma de chaque élément", () => {
    const result = bookPageSchema.parse(page);
    expect(result.items[0]?.publishedAt).toEqual(new Date("1965-08-01"));
    expect(result.total).toBe(1);
  });

  it("accepte une page sans comptage", () => {
    const withoutTotal = { ...page, total: undefined, pageCount: undefined };
    expect(bookPageSchema.parse({ ...withoutTotal, hasNextPage: true }).hasNextPage).toBe(true);
  });

  it("accepte une page vide", () => {
    expect(bookPageSchema.parse({ ...page, items: [], total: 0, pageCount: 0 }).items).toEqual([]);
  });

  it("refuse un élément invalide en indiquant son chemin", () => {
    const { error } = bookPageSchema.safeParse({ ...page, items: [{ title: 1 }] });
    expect(error?.issues[0]?.path).toEqual(["items", 0, "title"]);
  });

  it.each([
    ["page", 0],
    ["pageSize", 0],
    ["total", -1],
    ["pageCount", 1.5],
  ])("refuse %s = %j", (key, value) => {
    expect(bookPageSchema.safeParse({ ...page, [key]: value }).success).toBe(false);
  });

  it("type la sortie et l'entrée à partir du schéma d'élément", () => {
    expectTypeOf<z.output<typeof bookPageSchema>>().toEqualTypeOf<
      IPage<{ title: string; publishedAt: Date }>
    >();
    expectTypeOf<z.input<typeof bookPageSchema>>().toEqualTypeOf<
      IPage<{ title: string; publishedAt: string }>
    >();
  });
});
