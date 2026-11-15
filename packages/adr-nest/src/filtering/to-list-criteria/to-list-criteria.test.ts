import { defineListQuery } from "@etiennea20/adr-misc/contract";
import { describe, expect, it } from "vitest";

import { ListQueryConfigError } from "../list-query-config-error";
import { toListCriteria } from "./to-list-criteria";

const bookListQuery = defineListQuery({
  fields: {
    title: { type: "string", filter: true, sort: true, select: true, search: true },
    authorName: { type: "string", filter: ["contains"], sort: true, select: true, search: true },
    publishedAt: { type: "date", filter: true, sort: true },
    status: { type: "enum", values: ["available", "loaned"], filter: true },
  },
  defaults: { sort: [{ field: "title", direction: "asc" }] },
});
const columns = { authorName: "author.name" };

describe("toListCriteria", () => {
  it("traduit une requête vide : tri par défaut, première page, une ligne de plus", () => {
    expect(toListCriteria(bookListQuery, bookListQuery.schema.parse({}))).toEqual({
      where: undefined,
      orderBy: [{ path: "title", direction: "asc" }],
      select: undefined,
      skip: 0,
      take: 21,
      page: 1,
      pageSize: 20,
      withTotal: true,
    });
  });

  it("remplace les noms publics par les colonnes et convertit les dates", () => {
    const query = bookListQuery.schema.parse({
      filter: {
        and: [
          { field: "authorName", op: "contains", value: "Zola", caseSensitive: true },
          { not: { field: "publishedAt", op: "between", value: ["1880-01-01", "1889-12-31"] } },
          {
            or: [
              { field: "status", op: "in", value: ["available"] },
              { field: "publishedAt", op: "lt", value: "1870-01-01T00:00:00Z" },
            ],
          },
        ],
      },
      sort: [{ field: "authorName", direction: "desc" }],
      fields: ["title", "authorName"],
      page: 3,
      pageSize: 10,
      withTotal: false,
    });
    const criteria = toListCriteria(bookListQuery, query, { columns });
    expect(criteria.where).toEqual({
      and: [
        { path: "author.name", op: "contains", value: "Zola", caseSensitive: true },
        {
          not: {
            path: "publishedAt",
            op: "between",
            value: [new Date("1880-01-01"), new Date("1889-12-31")],
            caseSensitive: false,
          },
        },
        {
          or: [
            { path: "status", op: "in", value: ["available"], caseSensitive: false },
            {
              path: "publishedAt",
              op: "lt",
              value: new Date("1870-01-01T00:00:00Z"),
              caseSensitive: false,
            },
          ],
        },
      ],
    });
    expect(criteria).toMatchObject({
      orderBy: [{ path: "author.name", direction: "desc" }],
      select: ["title", "author.name"],
      skip: 20,
      take: 11,
      withTotal: false,
    });
  });

  it("transforme q en OU de contains sur les champs de recherche, combiné au filtre", () => {
    const query = bookListQuery.schema.parse({
      q: "germ",
      filter: { field: "status", op: "eq", value: "available" },
    });
    expect(toListCriteria(bookListQuery, query, { columns }).where).toEqual({
      and: [
        { path: "status", op: "eq", value: "available", caseSensitive: false },
        {
          or: [
            { path: "title", op: "contains", value: "germ", caseSensitive: false },
            { path: "author.name", op: "contains", value: "germ", caseSensitive: false },
          ],
        },
      ],
    });
    expect(
      toListCriteria(bookListQuery, bookListQuery.schema.parse({ q: "germ" })).where,
    ).toMatchObject({
      or: [{ path: "title" }, { path: "authorName" }],
    });
  });

  it("lève une erreur de configuration pour une colonne inconnue", () => {
    expect(() =>
      toListCriteria(bookListQuery, bookListQuery.schema.parse({}), {
        columns: { isbn: "x" } as never,
      }),
    ).toThrow(ListQueryConfigError);
  });
});
