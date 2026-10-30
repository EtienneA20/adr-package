import { describe, expect, expectTypeOf, it } from "vitest";

import { keyBy } from "./key-by";

describe("keyBy", () => {
  it("indexe les éléments par clé", () => {
    const books = [
      { id: "b-1", title: "Germinal" },
      { id: "b-2", title: "Nana" },
    ];
    expect(keyBy(books, (book) => book.id)).toEqual({
      "b-1": { id: "b-1", title: "Germinal" },
      "b-2": { id: "b-2", title: "Nana" },
    });
  });

  it("garde le dernier élément en cas de clé en double", () => {
    expect(keyBy(["a1", "a2", "b1"], (value) => value.charAt(0))).toEqual({ a: "a2", b: "b1" });
  });

  it("transmet l'index à la fonction de clé", () => {
    expect(keyBy(["x", "y"], (_, index) => index)).toEqual({ 0: "x", 1: "y" });
  });

  it("renvoie un objet vide pour un tableau vide", () => {
    expect(keyBy([], String)).toEqual({});
  });

  it("type le résultat comme un index partiel", () => {
    expectTypeOf(keyBy([{ id: 1 }], (item) => item.id)).toEqualTypeOf<
      Partial<Record<number, { id: number }>>
    >();
  });
});
