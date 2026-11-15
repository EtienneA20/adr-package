import { describe, expect, it } from "vitest";

import type { CriteriaValue, ICriteriaCondition } from "../list-criteria";
import { compareForSort, matchesCriteria, readPath } from "./evaluate-criteria";

const book = {
  title: "Germinal",
  pages: 592,
  available: true,
  publishedAt: "1885-03-02",
  author: { name: "Émile Zola" },
  isbn: null,
};

function condition(
  path: string,
  op: ICriteriaCondition["op"],
  value: CriteriaValue,
  caseSensitive = false,
) {
  return { path, op, value, caseSensitive };
}

function matches(...args: Parameters<typeof condition>): boolean {
  return matchesCriteria(book, condition(...args));
}

describe("readPath", () => {
  it("lit un chemin pointé et renvoie undefined si un segment manque", () => {
    expect(readPath(book, "author.name")).toBe("Émile Zola");
    expect(readPath(book, "author.age")).toBeUndefined();
    expect(readPath(book, "title.length")).toBeUndefined();
    expect(readPath(book, "constructor")).toBeUndefined();
  });
});

describe("matchesCriteria", () => {
  it.each<[ICriteriaCondition["op"], CriteriaValue, boolean]>([
    ["eq", 592, true],
    ["ne", 592, false],
    ["gt", 500, true],
    ["gte", 592, true],
    ["lt", 592, false],
    ["lte", 600, true],
    ["between", [500, 600], true],
    ["between", [600, 700], false],
    ["in", [100, 592], true],
    ["nin", [100, 592], false],
  ])("compare un nombre : %s %j → %s", (op, value, expected) => {
    expect(matches("pages", op, value)).toBe(expected);
  });

  it("compare des dates stockées en texte à des Date", () => {
    expect(matches("publishedAt", "lt", new Date("1890-01-01"))).toBe(true);
    expect(
      matches("publishedAt", "between", [new Date("1880-01-01"), new Date("1889-12-31")]),
    ).toBe(true);
    expect(matches("publishedAt", "eq", new Date("1885-03-02"))).toBe(true);
  });

  it("recherche du texte sans casse par défaut, avec casse sur demande", () => {
    expect(matches("author.name", "contains", "zola")).toBe(true);
    expect(matches("author.name", "contains", "zola", true)).toBe(false);
    expect(matches("title", "startsWith", "germ")).toBe(true);
    expect(matches("title", "endsWith", "NAL")).toBe(true);
    expect(matches("pages", "contains", "59")).toBe(false);
  });

  it("teste l'absence de valeur", () => {
    expect(matches("isbn", "isNull", true)).toBe(true);
    expect(matches("missing", "isNull", true)).toBe(true);
    expect(matches("title", "isNull", false)).toBe(true);
  });

  it("refuse une comparaison entre types différents ou avec une valeur absente", () => {
    expect(matches("title", "gt", 3)).toBe(false);
    expect(matches("missing", "eq", "x")).toBe(false);
    expect(matches("available", "eq", true)).toBe(true);
  });

  it("combine les groupes and, or et not", () => {
    const zola = condition("author.name", "contains", "zola");
    const short = condition("pages", "lt", 200);
    expect(matchesCriteria(book, { and: [zola, { not: short }] })).toBe(true);
    expect(matchesCriteria(book, { or: [short, { not: zola }] })).toBe(false);
  });

  it("ignore un opérateur inconnu", () => {
    expect(matches("pages", "regex" as never, 1)).toBe(false);
  });
});

describe("compareForSort", () => {
  it("trie textes, nombres, dates et place les valeurs absentes en dernier", () => {
    expect(["Zola", "Éluard", "Balzac"].sort(compareForSort)).toEqual(["Balzac", "Éluard", "Zola"]);
    expect([3, 1, 2].sort(compareForSort)).toEqual([1, 2, 3]);
    expect(compareForSort(new Date("2020-01-01"), new Date("2019-01-01"))).toBe(1);
    expect(compareForSort(5, 5)).toBe(0);
    expect([null, "a", undefined, "b"].sort(compareForSort)).toEqual(["a", "b", null, undefined]);
  });
});
