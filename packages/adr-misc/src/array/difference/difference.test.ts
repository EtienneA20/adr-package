import { describe, expect, it } from "vitest";

import { difference } from "./difference";

describe("difference", () => {
  it("retire les éléments présents dans le second tableau", () => {
    expect(difference([1, 2, 3, 4], [2, 4])).toEqual([1, 3]);
  });

  it("conserve l'ordre et les doublons du premier tableau", () => {
    expect(difference(["b", "a", "b", "c"], ["c"])).toEqual(["b", "a", "b"]);
  });

  it("compare NaN avec SameValueZero", () => {
    expect(difference([Number.NaN, 1], [Number.NaN])).toEqual([1]);
  });

  it("compare des objets par la clé fournie", () => {
    const books = [
      { id: 1, title: "Germinal" },
      { id: 2, title: "Nana" },
    ];
    expect(difference(books, [{ id: 2, title: "Nana (réédition)" }], (book) => book.id)).toEqual([
      { id: 1, title: "Germinal" },
    ]);
  });

  it("gère les tableaux vides", () => {
    expect(difference([], [1])).toEqual([]);
    expect(difference([1], [])).toEqual([1]);
  });

  it("ne modifie pas les tableaux d'origine", () => {
    const items = Object.freeze([1, 2]);
    const excluded = Object.freeze([2]);
    difference(items, excluded);
    expect(items).toEqual([1, 2]);
    expect(excluded).toEqual([2]);
  });
});
