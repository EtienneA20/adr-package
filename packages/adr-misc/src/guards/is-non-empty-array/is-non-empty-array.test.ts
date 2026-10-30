import { describe, expect, expectTypeOf, it } from "vitest";

import { isNonEmptyArray } from "./is-non-empty-array";

describe("isNonEmptyArray", () => {
  it("accepte un tableau qui contient au moins un élément", () => {
    expect(isNonEmptyArray([1])).toBe(true);
    expect(isNonEmptyArray(["Dune", "Fondation"])).toBe(true);
    expect(isNonEmptyArray([undefined])).toBe(true);
  });

  it("refuse un tableau vide", () => {
    expect(isNonEmptyArray([])).toBe(false);
  });

  it("type le premier élément sans undefined", () => {
    const loans: string[] = ["L1", "L2"];
    const first = isNonEmptyArray(loans) ? loans[0] : "aucun";
    if (isNonEmptyArray(loans)) {
      expectTypeOf(loans[0]).toEqualTypeOf<string>();
    }
    expect(first).toBe("L1");
  });

  it("accepte un tableau en lecture seule", () => {
    const titles: readonly string[] = ["Dune"];
    if (isNonEmptyArray(titles)) {
      expectTypeOf(titles).toEqualTypeOf<readonly [string, ...string[]]>();
    }
    expect(isNonEmptyArray(titles)).toBe(true);
  });
});
