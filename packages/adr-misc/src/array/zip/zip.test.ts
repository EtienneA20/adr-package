import { describe, expect, expectTypeOf, it } from "vitest";

import { zip } from "./zip";

describe("zip", () => {
  it("associe les éléments de même position", () => {
    expect(zip(["Titre", "Auteur"], ["Germinal", "Zola"])).toEqual([
      ["Titre", "Germinal"],
      ["Auteur", "Zola"],
    ]);
  });

  it("s'arrête au tableau le plus court", () => {
    expect(zip([1, 2, 3], ["a"])).toEqual([[1, "a"]]);
    expect(zip([1], ["a", "b"])).toEqual([[1, "a"]]);
  });

  it("renvoie un tableau vide si un tableau est vide", () => {
    expect(zip([], [1])).toEqual([]);
  });

  it("conserve les valeurs undefined présentes dans les tableaux", () => {
    expect(zip([undefined], [null])).toEqual([[undefined, null]]);
  });

  it("type les paires", () => {
    expectTypeOf(zip([1], ["a"])).toEqualTypeOf<[number, string][]>();
  });
});
