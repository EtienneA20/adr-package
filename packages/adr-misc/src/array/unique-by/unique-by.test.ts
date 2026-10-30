import { describe, expect, it } from "vitest";

import { uniqueBy } from "./unique-by";

describe("uniqueBy", () => {
  it("garde le premier élément de chaque clé", () => {
    const books = [
      { isbn: "1", title: "Germinal" },
      { isbn: "2", title: "Nana" },
      { isbn: "1", title: "Germinal (poche)" },
    ];
    expect(uniqueBy(books, (book) => book.isbn)).toEqual([
      { isbn: "1", title: "Germinal" },
      { isbn: "2", title: "Nana" },
    ]);
  });

  it("transmet l'index à la fonction de clé", () => {
    expect(uniqueBy(["a", "b", "c", "d"], (_, index) => index % 2)).toEqual(["a", "b"]);
  });

  it("renvoie un tableau vide pour un tableau vide", () => {
    expect(uniqueBy([], String)).toEqual([]);
  });

  it("ne modifie pas le tableau d'origine", () => {
    const items = Object.freeze(["A", "a"]);
    expect(uniqueBy(items, (value) => value.toLowerCase())).toEqual(["A"]);
    expect(items).toEqual(["A", "a"]);
  });
});
