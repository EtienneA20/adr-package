import { describe, expect, expectTypeOf, it } from "vitest";

import { groupBy } from "./group-by";

interface IBook {
  title: string;
  genre: "roman" | "essai";
}

const germinal: IBook = { title: "Germinal", genre: "roman" };
const essay: IBook = { title: "Le Deuxième Sexe", genre: "essai" };
const nana: IBook = { title: "Nana", genre: "roman" };

describe("groupBy", () => {
  it("regroupe les éléments par clé en conservant l'ordre", () => {
    expect(groupBy([germinal, essay, nana], (book) => book.genre)).toEqual({
      roman: [germinal, nana],
      essai: [essay],
    });
  });

  it("transmet l'index à la fonction de clé", () => {
    expect(groupBy(["a", "b", "c"], (_, index) => index % 2)).toEqual({
      0: ["a", "c"],
      1: ["b"],
    });
  });

  it("renvoie un objet vide pour un tableau vide", () => {
    expect(groupBy([], String)).toEqual({});
  });

  it("stocke la clé __proto__ comme propriété propre", () => {
    const result = groupBy(["x"], () => "__proto__");
    expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
    expect(Object.getOwnPropertyDescriptor(result, "__proto__")?.value).toEqual(["x"]);
  });

  it("type le résultat par les clés possibles", () => {
    expectTypeOf(groupBy([germinal], (book) => book.genre)).toEqualTypeOf<
      Partial<Record<"roman" | "essai", IBook[]>>
    >();
  });
});
