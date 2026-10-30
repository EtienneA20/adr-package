import { describe, expect, it } from "vitest";

import { range } from "./range";

describe("range", () => {
  it("génère une suite croissante avec un pas de 1 par défaut", () => {
    expect(range(0, 5)).toEqual([0, 1, 2, 3, 4]);
  });

  it("utilise le pas fourni sans dépasser la borne de fin", () => {
    expect(range(0, 10, 3)).toEqual([0, 3, 6, 9]);
  });

  it("génère une suite décroissante avec un pas négatif", () => {
    expect(range(5, 0, -2)).toEqual([5, 3, 1]);
  });

  it("renvoie un tableau vide si le pas ne va pas vers la fin", () => {
    expect(range(5, 0)).toEqual([]);
    expect(range(0, 5, -1)).toEqual([]);
    expect(range(3, 3)).toEqual([]);
  });

  it("accepte des pas décimaux", () => {
    expect(range(0, 1, 0.25)).toEqual([0, 0.25, 0.5, 0.75]);
  });

  it("lève une RangeError pour un pas nul", () => {
    expect(() => range(0, 5, 0)).toThrow(new RangeError("Le pas de range ne doit pas être nul."));
  });

  it.each([
    [0, Number.POSITIVE_INFINITY, 1],
    [Number.NaN, 5, 1],
    [0, 5, Number.NaN],
  ])("lève une RangeError pour des valeurs non finies (%s, %s, %s)", (start, end, step) => {
    expect(() => range(start, end, step)).toThrow(RangeError);
  });
});
