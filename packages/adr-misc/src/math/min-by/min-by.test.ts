import { describe, expect, it } from "vitest";

import { minBy } from "./min-by";

const books = [
  { title: "Germinal", price: 8 },
  { title: "Nana", price: 6.5 },
  { title: "L'Assommoir", price: 6.5 },
];

describe("minBy", () => {
  it("renvoie l'élément de plus petite valeur", () => {
    expect(minBy(books, (book) => book.price)?.title).toBe("Nana");
  });

  it("renvoie le premier élément en cas d'égalité", () => {
    expect(minBy(books, (book) => book.price)).toBe(books[1]);
  });

  it("renvoie undefined pour une liste vide", () => {
    expect(minBy<number>([], () => 0)).toBeUndefined();
  });

  it("ignore les valeurs NaN", () => {
    expect(minBy([Number.NaN, 3, 1], (value) => value)).toBe(1);
    expect(minBy([Number.NaN], (value) => value)).toBeUndefined();
  });
});
