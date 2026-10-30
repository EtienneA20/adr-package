import { describe, expect, it } from "vitest";

import { isLuhnValid } from "./is-luhn-valid";

describe("isLuhnValid", () => {
  it.each(["4532015112830366", "4532 0151 1283 0366", "732829320", "18", "00"])(
    "accepte la suite %j",
    (value) => {
      expect(isLuhnValid(value)).toBe(true);
    },
  );

  it.each(["4532015112830367", "732829321", "19"])("refuse la clé invalide de %j", (value) => {
    expect(isLuhnValid(value)).toBe(false);
  });

  it.each(["", "0", " ", "4532-0151-1283-0366", "45320151128303a6"])(
    "refuse la chaîne mal formée %j",
    (value) => {
      expect(isLuhnValid(value)).toBe(false);
    },
  );
});
