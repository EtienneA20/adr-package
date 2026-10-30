import { describe, expect, expectTypeOf, it } from "vitest";

import { compact } from "./compact";

describe("compact", () => {
  it("retire toutes les valeurs falsy", () => {
    expect(compact([0, 1, false, 2, "", 3, null, undefined, Number.NaN, 0n, 4n])).toEqual([
      1,
      2,
      3,
      4n,
    ]);
  });

  it("conserve les valeurs truthy dans l'ordre", () => {
    const book = { title: "Germinal" };
    expect(compact(["a", book, [], {}])).toEqual(["a", book, [], {}]);
  });

  it("renvoie un tableau vide pour un tableau vide", () => {
    expect(compact([])).toEqual([]);
  });

  it("ne modifie pas le tableau d'origine", () => {
    const items = Object.freeze(["a", null]);
    expect(compact(items)).toEqual(["a"]);
    expect(items).toEqual(["a", null]);
  });

  it("affine le type des éléments", () => {
    const items: (string | null | undefined | false)[] = ["a", null];
    expectTypeOf(compact(items)).toEqualTypeOf<string[]>();
  });
});
