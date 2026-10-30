import { describe, expect, it } from "vitest";

import { formatOrdinal } from "./format-ordinal";

describe("formatOrdinal", () => {
  it("écrit « 1er » au masculin et « 1re » au féminin", () => {
    expect(formatOrdinal(1)).toBe("1er");
    expect(formatOrdinal(1, { gender: "masculine" })).toBe("1er");
    expect(formatOrdinal(1, { gender: "feminine" })).toBe("1re");
  });

  it.each([
    [0, "0e"],
    [2, "2e"],
    [11, "11e"],
    [21, "21e"],
    [101, "101e"],
  ])("écrit %d sous la forme « %s »", (value, expected) => {
    expect(formatOrdinal(value)).toBe(expected);
    expect(formatOrdinal(value, { gender: "feminine" })).toBe(expected);
  });

  it.each([-1, 1.5, Number.NaN, Number.POSITIVE_INFINITY])(
    "lève une RangeError pour %d",
    (value) => {
      expect(() => formatOrdinal(value)).toThrow(RangeError);
    },
  );
});
