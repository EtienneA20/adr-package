import { describe, expect, expectTypeOf, it } from "vitest";

import { chunk } from "./chunk";

describe("chunk", () => {
  it("découpe le tableau en paquets de la taille demandée", () => {
    expect(chunk([1, 2, 3, 4, 5, 6], 3)).toEqual([
      [1, 2, 3],
      [4, 5, 6],
    ]);
  });

  it("produit un dernier paquet plus court si nécessaire", () => {
    expect(chunk(["a", "b", "c"], 2)).toEqual([["a", "b"], ["c"]]);
  });

  it("renvoie un seul paquet si la taille dépasse la longueur", () => {
    expect(chunk([1, 2], 10)).toEqual([[1, 2]]);
  });

  it("renvoie un tableau vide pour un tableau vide", () => {
    expect(chunk([], 2)).toEqual([]);
  });

  it("ne modifie pas le tableau d'origine", () => {
    const items = Object.freeze([1, 2, 3]);
    chunk(items, 2);
    expect(items).toEqual([1, 2, 3]);
  });

  it.each([0, -1, 1.5, Number.NaN])("lève une RangeError pour la taille %s", (size) => {
    expect(() => chunk([1, 2], size)).toThrow(RangeError);
  });

  it("type les paquets avec le type des éléments", () => {
    expectTypeOf(chunk(["a"], 1)).toEqualTypeOf<string[][]>();
  });
});
