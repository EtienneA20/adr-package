import { describe, expect, it } from "vitest";

import { toggleItem } from "./toggle-item";

describe("toggleItem", () => {
  it("ajoute l'élément à la fin s'il est absent", () => {
    expect(toggleItem(["roman"], "bd")).toEqual(["roman", "bd"]);
  });

  it("retire l'élément s'il est présent", () => {
    expect(toggleItem(["roman", "essai"], "essai")).toEqual(["roman"]);
  });

  it("retire toutes les occurrences de l'élément", () => {
    expect(toggleItem([1, 2, 1], 1)).toEqual([2]);
  });

  it("compare NaN et les zéros avec SameValueZero", () => {
    expect(toggleItem([Number.NaN, 1], Number.NaN)).toEqual([1]);
    expect(toggleItem([0], -0)).toEqual([]);
  });

  it("compare des objets par la clé fournie", () => {
    const selected = [{ id: 1 }, { id: 2 }];
    expect(toggleItem(selected, { id: 2 }, (book) => book.id)).toEqual([{ id: 1 }]);
    expect(toggleItem(selected, { id: 3 }, (book) => book.id)).toEqual([
      { id: 1 },
      { id: 2 },
      { id: 3 },
    ]);
  });

  it("ajoute l'élément à un tableau vide", () => {
    expect(toggleItem([], "a")).toEqual(["a"]);
  });

  it("ne modifie pas le tableau d'origine", () => {
    const items = Object.freeze(["a"]);
    toggleItem(items, "b");
    toggleItem(items, "a");
    expect(items).toEqual(["a"]);
  });
});
