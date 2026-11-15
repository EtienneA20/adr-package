import { defineListQuery } from "@etiennea20/adr-misc/contract";
import { describe, expect, it } from "vitest";

import { parseListQuery } from "../parse-list-query";
import { applyCriteriaInMemory } from "./apply-criteria-in-memory";

const books = [
  { title: "Germinal", author: { name: "Émile Zola" }, publishedAt: "1885-03-02", pages: 592 },
  { title: "Nana", author: { name: "Émile Zola" }, publishedAt: "1880-03-01", pages: 480 },
  {
    title: "Bel-Ami",
    author: { name: "Guy de Maupassant" },
    publishedAt: "1885-05-01",
    pages: 400,
  },
  { title: "Dune", author: { name: "Frank Herbert" }, publishedAt: "1965-08-01", pages: 412 },
];

const bookListQuery = defineListQuery({
  fields: {
    title: { type: "string", filter: true, sort: true, search: true },
    authorName: { type: "string", filter: true, sort: true, search: true },
    publishedAt: { type: "date", filter: true, sort: true },
  },
  defaults: { sort: [{ field: "title", direction: "asc" }], pageSize: 2 },
});
const columns = { authorName: "author.name" };

function list(input: object) {
  return applyCriteriaInMemory(
    books,
    parseListQuery(bookListQuery, input, { source: "body", columns }),
  );
}

describe("applyCriteriaInMemory", () => {
  it("trie, pagine et compte avec les valeurs par défaut", () => {
    expect(list({})).toMatchObject({
      items: [{ title: "Bel-Ami" }, { title: "Dune" }],
      total: 4,
      pageCount: 2,
      hasNextPage: true,
    });
    expect(list({ page: 2 }).items.map((book) => book.title)).toEqual(["Germinal", "Nana"]);
    expect(list({ page: 2 }).hasNextPage).toBe(false);
  });

  it("filtre sur une relation et sur des dates stockées en texte", () => {
    const page = list({
      filter: {
        and: [
          { field: "authorName", op: "contains", value: "zola" },
          { field: "publishedAt", op: "gte", value: "1885-01-01" },
        ],
      },
    });
    expect(page.items.map((book) => book.title)).toEqual(["Germinal"]);
    expect(page.total).toBe(1);
  });

  it("recherche q sur les champs de recherche", () => {
    expect(list({ q: "MAUPASS" }).items.map((book) => book.title)).toEqual(["Bel-Ami"]);
  });

  it("trie sur plusieurs critères, en sens décroissant", () => {
    const page = list({
      sort: [
        { field: "publishedAt", direction: "desc" },
        { field: "title", direction: "desc" },
      ],
      pageSize: 4,
    });
    expect(page.items.map((book) => book.title)).toEqual(["Dune", "Bel-Ami", "Germinal", "Nana"]);
  });

  it("garde l'ordre d'origine sans tri et ne compte pas sans withTotal", () => {
    const criteria = {
      ...parseListQuery(bookListQuery, { withTotal: false }, { source: "body" }),
      orderBy: [],
    };
    const page = applyCriteriaInMemory(books, criteria);
    expect(page.items.map((book) => book.title)).toEqual(["Germinal", "Nana"]);
    expect(page).not.toHaveProperty("total");
  });

  it("ne modifie pas le tableau d'origine", () => {
    list({ sort: [{ field: "title", direction: "desc" }] });
    expect(books[0]?.title).toBe("Germinal");
  });
});
