import { describe, expect, it } from "vitest";

import { inRange } from "./in-range";

describe("inRange", () => {
  it("renvoie true pour une valeur intérieure", () => {
    expect(inRange(20, 18, 25)).toBe(true);
  });

  it.each([18, 25])("inclut la borne %d", (value) => {
    expect(inRange(value, 18, 25)).toBe(true);
  });

  it.each([17.9, 26, Number.NaN])("renvoie false pour %d", (value) => {
    expect(inRange(value, 18, 25)).toBe(false);
  });

  it("lève une RangeError si min est supérieur à max", () => {
    expect(() => inRange(1, 5, 0)).toThrow(RangeError);
  });
});
