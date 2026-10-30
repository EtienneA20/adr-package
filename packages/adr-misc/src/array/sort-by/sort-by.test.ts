import { describe, expect, expectTypeOf, it } from "vitest";

import { sortBy } from "./sort-by";

interface IBook {
  title: string;
  author: string;
  year: number | null;
}

const books: IBook[] = [
  { title: "Nana", author: "Zola", year: 1880 },
  { title: "Les Misérables", author: "Hugo", year: 1862 },
  { title: "Germinal", author: "Zola", year: 1885 },
  { title: "Inconnu", author: "Anonyme", year: null },
];

const titles = (list: readonly IBook[]): string[] => list.map((book) => book.title);

describe("sortBy", () => {
  it("trie par ordre croissant avec une fonction", () => {
    expect(sortBy([3, 1, 2], (value) => value)).toEqual([1, 2, 3]);
  });

  it("trie par ordre décroissant avec un critère détaillé", () => {
    expect(sortBy([3, 1, 2], { by: (value) => value, direction: "desc" })).toEqual([3, 2, 1]);
  });

  it("trie par ordre croissant avec un critère détaillé sans sens", () => {
    expect(sortBy([3, 1, 2], { by: (value) => value })).toEqual([1, 2, 3]);
  });

  it("applique les critères suivants pour départager les égalités", () => {
    const result = sortBy(books, (book) => book.author, {
      by: (book) => book.year,
      direction: "desc",
    });
    expect(titles(result)).toEqual(["Inconnu", "Les Misérables", "Germinal", "Nana"]);
  });

  it("est stable à égalité", () => {
    const result = sortBy(books, (book) => book.author === "Zola");
    expect(titles(result)).toEqual(["Les Misérables", "Inconnu", "Nana", "Germinal"]);
  });

  it("compare les chaînes dans l'ordre alphabétique français", () => {
    expect(sortBy(["Zoé", "eva", "Émile", "étienne"], (name) => name)).toEqual([
      "Émile",
      "étienne",
      "eva",
      "Zoé",
    ]);
  });

  it("place null, undefined, NaN et les dates invalides en dernier dans les deux sens", () => {
    const values = [null, 2, undefined, Number.NaN, 1];
    expect(sortBy(values, (value) => value)).toEqual([1, 2, null, undefined, Number.NaN]);
    expect(sortBy(values, { by: (value) => value, direction: "desc" })).toEqual([
      2,
      1,
      null,
      undefined,
      Number.NaN,
    ]);
    const invalid = new Date(Number.NaN);
    const valid = new Date(2026, 0, 15);
    expect(sortBy([invalid, valid], (date) => date)).toEqual([valid, invalid]);
  });

  it("compare les dates, les booléens et les bigint", () => {
    const later = new Date(2026, 5, 1);
    const earlier = new Date(2026, 0, 1);
    expect(sortBy([later, earlier], (date) => date)).toEqual([earlier, later]);
    expect(sortBy([true, false], (value) => value)).toEqual([false, true]);
    expect(sortBy([3n, 1n, 2n], (value) => value)).toEqual([1n, 2n, 3n]);
  });

  it("compare un mélange de chaînes et de nombres sous forme de chaînes", () => {
    expect(sortBy<string | number>(["b", 10, "a"], (value) => value)).toEqual([10, "a", "b"]);
  });

  it("n'évalue chaque critère qu'une fois par élément", () => {
    let calls = 0;
    sortBy([3, 1, 2, 5, 4], (value) => {
      calls += 1;
      return value;
    });
    expect(calls).toBe(5);
  });

  it("ne modifie pas le tableau d'origine", () => {
    const items = Object.freeze([2, 1]);
    expect(sortBy(items, (value) => value)).toEqual([1, 2]);
    expect(items).toEqual([2, 1]);
  });

  it("renvoie un tableau du type des éléments", () => {
    expectTypeOf(sortBy(books, (book) => book.title)).toEqualTypeOf<IBook[]>();
  });
});
