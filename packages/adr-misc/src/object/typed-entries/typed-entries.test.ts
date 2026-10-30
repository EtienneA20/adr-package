import { describe, expect, expectTypeOf, it } from "vitest";

import { typedEntries } from "./typed-entries";

describe("typedEntries", () => {
  it("renvoie les paires clé / valeur propres", () => {
    expect(typedEntries({ title: "Germinal", year: 1885 })).toEqual([
      ["title", "Germinal"],
      ["year", 1885],
    ]);
  });

  it("ignore les clés symboles et les propriétés héritées", () => {
    const parent = { inherited: true };
    const object = Object.assign(Object.create(parent) as object, {
      own: 1,
      [Symbol("hidden")]: 2,
    });
    expect(typedEntries(object)).toEqual([["own", 1]]);
  });

  it("renvoie un tableau vide pour un objet vide", () => {
    expect(typedEntries({})).toEqual([]);
  });

  it("type chaque clé avec sa valeur", () => {
    const book = { title: "Germinal", year: 1885 } as { title: string; year?: number };
    expectTypeOf(typedEntries(book)).toEqualTypeOf<
      (["title", string] | ["year", number | undefined])[]
    >();
  });
});
