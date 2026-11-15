import { defineListQuery } from "@etiennea20/adr-misc/contract";
import { describe, expect, it } from "vitest";

import { toPrismaFindArgs, toPrismaWhere } from "./to-prisma-find-args";
import { type CriteriaValue, type ICriteriaCondition, parseListQuery } from "../../filtering";

const bookListQuery = defineListQuery({
  fields: {
    title: { type: "string", filter: true, sort: true, select: true, search: true },
    authorName: { type: "string", filter: true, sort: true, select: true },
    authorCountry: { type: "string", select: true },
    publishedAt: { type: "date", filter: true, sort: true },
  },
});
const columns = { authorName: "author.name", authorCountry: "author.country" };

function condition(op: ICriteriaCondition["op"], value: CriteriaValue, caseSensitive = false) {
  return { path: "title", op, value, caseSensitive };
}

describe("toPrismaWhere", () => {
  it.each<[ICriteriaCondition["op"], CriteriaValue, unknown]>([
    ["eq", "Dune", { equals: "Dune" }],
    ["ne", "Dune", { not: "Dune" }],
    ["gt", 1, { gt: 1 }],
    ["gte", 1, { gte: 1 }],
    ["lt", 1, { lt: 1 }],
    ["lte", 1, { lte: 1 }],
    ["between", [1, 2], { gte: 1, lte: 2 }],
    ["in", ["a"], { in: ["a"] }],
    ["nin", ["a"], { notIn: ["a"] }],
    ["contains", "du", { contains: "du", mode: "insensitive" }],
    ["startsWith", "du", { startsWith: "du", mode: "insensitive" }],
    ["endsWith", "ne", { endsWith: "ne", mode: "insensitive" }],
    ["isNull", true, { equals: null }],
    ["isNull", false, { not: null }],
  ])("traduit %s", (op, value, expected) => {
    expect(toPrismaWhere(condition(op, value))).toEqual({ title: expected });
  });

  it("respecte la casse sur demande", () => {
    expect(toPrismaWhere(condition("contains", "Du", true))).toEqual({ title: { contains: "Du" } });
  });

  it("imbrique les relations et les groupes", () => {
    expect(
      toPrismaWhere({
        or: [
          { path: "author.name", op: "eq", value: "Zola", caseSensitive: false },
          { not: { and: [condition("eq", "Nana")] } },
        ],
      }),
    ).toEqual({
      OR: [
        { author: { name: { equals: "Zola" } } },
        { NOT: { AND: [{ title: { equals: "Nana" } }] } },
      ],
    });
  });
});

describe("toPrismaFindArgs", () => {
  it("produit where, orderBy, select, skip et take depuis une requête client", () => {
    const criteria = parseListQuery(
      bookListQuery,
      {
        filter: { field: "publishedAt", op: "gte", value: "1880-01-01" },
        sort: [
          { field: "authorName", direction: "asc" },
          { field: "title", direction: "desc" },
        ],
        fields: ["title", "authorName", "authorCountry"],
        page: 3,
        pageSize: 10,
      },
      { source: "body", columns },
    );
    expect(toPrismaFindArgs(criteria)).toEqual({
      where: { publishedAt: { gte: new Date("1880-01-01") } },
      orderBy: [{ author: { name: "asc" } }, { title: "desc" }],
      select: { title: true, author: { select: { name: true, country: true } } },
      skip: 20,
      take: 11,
    });
  });

  it("omet where et select quand la requête n'en a pas", () => {
    const args = toPrismaFindArgs(parseListQuery(bookListQuery, {}, { source: "body" }));
    expect(args).toEqual({ orderBy: [], skip: 0, take: 21 });
  });
});
