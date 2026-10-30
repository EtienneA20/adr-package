import { describe, expect, it } from "vitest";

import { sum } from "./sum";

describe("sum", () => {
  it("additionne les nombres", () => {
    expect(sum([12, 8.5, 3])).toBe(23.5);
  });

  it("renvoie 0 pour une liste vide", () => {
    expect(sum([])).toBe(0);
  });

  it("gère les nombres négatifs", () => {
    expect(sum([10, -4, -6])).toBe(0);
  });

  it("propage NaN", () => {
    expect(sum([1, Number.NaN])).toBeNaN();
  });
});
