import { describe, expect, it } from "vitest";

import { moveItem } from "./move-item";

describe("moveItem", () => {
  it("déplace un élément vers une position plus loin", () => {
    expect(moveItem(["a", "b", "c", "d"], 0, 2)).toEqual(["b", "c", "a", "d"]);
  });

  it("déplace un élément vers une position plus proche", () => {
    expect(moveItem(["a", "b", "c", "d"], 3, 1)).toEqual(["a", "d", "b", "c"]);
  });

  it("déplace vers la dernière position", () => {
    expect(moveItem([1, 2, 3], 0, 2)).toEqual([2, 3, 1]);
  });

  it("renvoie une copie identique si les positions sont égales", () => {
    const items = [1, 2, 3];
    const result = moveItem(items, 1, 1);
    expect(result).toEqual([1, 2, 3]);
    expect(result).not.toBe(items);
  });

  it("conserve les valeurs undefined", () => {
    expect(moveItem([undefined, 1], 0, 1)).toEqual([1, undefined]);
  });

  it("ne modifie pas le tableau d'origine", () => {
    const items = Object.freeze(["a", "b"]);
    moveItem(items, 0, 1);
    expect(items).toEqual(["a", "b"]);
  });

  it.each([
    [-1, 0],
    [0, 3],
    [3, 0],
    [0.5, 1],
    [0, Number.NaN],
  ])("lève une RangeError pour le déplacement de %s vers %s", (fromIndex, toIndex) => {
    expect(() => moveItem(["a", "b", "c"], fromIndex, toIndex)).toThrow(RangeError);
  });

  it("lève une RangeError pour un tableau vide", () => {
    expect(() => moveItem([], 0, 0)).toThrow(
      "Index hors bornes : déplacement de 0 vers 0 dans un tableau de 0 élément(s).",
    );
  });
});
