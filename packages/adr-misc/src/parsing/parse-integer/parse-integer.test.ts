import { describe, expect, it } from "vitest";

import { parseInteger } from "./parse-integer";

describe("parseInteger", () => {
  it.each([
    ["42", 42],
    ["1 234", 1234],
    ["1.234.567", 1234567],
    ["-12", -12],
    ["12,0", 12],
  ])("lit « %s » comme %d", (input, expected) => {
    expect(parseInteger(input)).toBe(expected);
  });

  it("transmet le séparateur décimal imposé", () => {
    expect(parseInteger("1,234", { decimalSeparator: "." })).toBe(1234);
    expect(parseInteger("1,234")).toBeUndefined();
  });

  it("renvoie un entier fourni sous forme de nombre", () => {
    expect(parseInteger(7)).toBe(7);
  });

  it.each(["12,5", "abc", "", "50 %", "9007199254740993"])(
    "renvoie undefined pour « %s »",
    (input) => {
      expect(parseInteger(input)).toBeUndefined();
    },
  );

  it("renvoie undefined pour un nombre décimal, null et undefined", () => {
    expect(parseInteger(1.5)).toBeUndefined();
    expect(parseInteger(null)).toBeUndefined();
    expect(parseInteger(undefined)).toBeUndefined();
  });
});
