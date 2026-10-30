import { describe, expect, expectTypeOf, it } from "vitest";

import { countBy } from "./count-by";

const books = [
  { title: "Germinal", genre: "roman" },
  { title: "Le Deuxième Sexe", genre: "essai" },
  { title: "Nana", genre: "roman" },
] as const;

describe("countBy", () => {
  it("compte les éléments par clé", () => {
    expect(countBy(books, (book) => book.genre)).toEqual({ roman: 2, essai: 1 });
  });

  it("transmet l'index à la fonction de clé", () => {
    expect(countBy(["a", "b", "c"], (_, index) => (index % 2 === 0 ? "pair" : "impair"))).toEqual({
      pair: 2,
      impair: 1,
    });
  });

  it("renvoie un objet vide pour un tableau vide", () => {
    expect(countBy([], String)).toEqual({});
  });

  it("stocke la clé __proto__ comme propriété propre", () => {
    const result = countBy(["__proto__"], (key) => key);
    expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
    expect(Object.hasOwn(result, "__proto__")).toBe(true);
  });

  it("type le résultat par les clés possibles", () => {
    expectTypeOf(countBy(books, (book) => book.genre)).toEqualTypeOf<
      Partial<Record<"roman" | "essai", number>>
    >();
  });
});
