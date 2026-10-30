import { describe, expect, expectTypeOf, it } from "vitest";

import { partition } from "./partition";

describe("partition", () => {
  it("sépare les éléments selon le prédicat en conservant l'ordre", () => {
    expect(partition([1, 2, 3, 4, 5], (value) => value % 2 === 0)).toEqual([
      [2, 4],
      [1, 3, 5],
    ]);
  });

  it("transmet l'index au prédicat", () => {
    expect(partition(["a", "b", "c"], (_, index) => index === 0)).toEqual([["a"], ["b", "c"]]);
  });

  it("renvoie deux tableaux vides pour un tableau vide", () => {
    expect(partition([], () => true)).toEqual([[], []]);
  });

  it("ne modifie pas le tableau d'origine", () => {
    const items = Object.freeze([1, 2]);
    partition(items, (value) => value > 1);
    expect(items).toEqual([1, 2]);
  });

  it("affine les types avec un prédicat de type", () => {
    const values: (string | number)[] = ["a", 1];
    const [labels, counts] = partition(
      values,
      (value): value is string => typeof value === "string",
    );
    expect(labels).toEqual(["a"]);
    expect(counts).toEqual([1]);
    expectTypeOf(labels).toEqualTypeOf<string[]>();
    expectTypeOf(counts).toEqualTypeOf<number[]>();
  });

  it("garde le type d'origine avec un prédicat booléen", () => {
    expectTypeOf(partition([1, 2], (value) => value > 1)).toEqualTypeOf<[number[], number[]]>();
  });
});
