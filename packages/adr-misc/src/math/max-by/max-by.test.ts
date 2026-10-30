import { describe, expect, it } from "vitest";

import { maxBy } from "./max-by";

const loans = [
  { bookId: "b1", daysLate: 3 },
  { bookId: "b2", daysLate: 12 },
  { bookId: "b3", daysLate: 12 },
];

describe("maxBy", () => {
  it("renvoie l'élément de plus grande valeur", () => {
    expect(maxBy(loans, (loan) => loan.daysLate)?.bookId).toBe("b2");
  });

  it("renvoie le premier élément en cas d'égalité", () => {
    expect(maxBy(loans, (loan) => loan.daysLate)).toBe(loans[1]);
  });

  it("renvoie undefined pour une liste vide", () => {
    expect(maxBy<number>([], () => 0)).toBeUndefined();
  });

  it("ignore les valeurs NaN", () => {
    expect(maxBy([Number.NaN, 3, 1], (value) => value)).toBe(3);
  });
});
