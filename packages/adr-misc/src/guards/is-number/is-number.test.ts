import { describe, expect, expectTypeOf, it } from "vitest";

import { isNumber } from "./is-number";

describe("isNumber", () => {
  it.each([0, -1, 3.5, Number.MAX_SAFE_INTEGER, Infinity, -Infinity])(
    "accepte le nombre %d",
    (value) => {
      expect(isNumber(value)).toBe(true);
    },
  );

  it("refuse NaN", () => {
    expect(isNumber(Number.NaN)).toBe(false);
    expect(isNumber(Number("abc"))).toBe(false);
  });

  it.each(["3", null, undefined, 3n, true])("refuse la valeur non numérique %s", (value) => {
    expect(isNumber(value)).toBe(false);
  });

  it("affine le type en number", () => {
    const value: unknown = 3;
    if (isNumber(value)) {
      expectTypeOf(value).toEqualTypeOf<number>();
    }
    expect(isNumber(value)).toBe(true);
  });
});
