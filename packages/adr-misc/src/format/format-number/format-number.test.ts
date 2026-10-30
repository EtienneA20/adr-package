import { describe, expect, it } from "vitest";

import { formatNumber } from "./format-number";

describe("formatNumber", () => {
  it("formate au format français avec espace fine insécable et virgule décimale", () => {
    expect(formatNumber(1234567.891)).toBe("1\u202f234\u202f567,891");
    expect(formatNumber(-42)).toBe("-42");
    expect(formatNumber(0)).toBe("0");
  });

  it("arrondit à trois décimales par défaut", () => {
    expect(formatNumber(1.23456)).toBe("1,235");
  });

  it("respecte le nombre minimal et maximal de décimales", () => {
    expect(formatNumber(1234.5, { minimumFractionDigits: 2 })).toBe("1\u202f234,50");
    expect(formatNumber(2.345, { maximumFractionDigits: 1 })).toBe("2,3");
    expect(formatNumber(2.5, { maximumFractionDigits: 0 })).toBe("3");
    expect(formatNumber(1, { minimumFractionDigits: 5 })).toBe("1,00000");
  });

  it("affiche le signe sur demande", () => {
    expect(formatNumber(3, { signDisplay: "exceptZero" })).toBe("+3");
    expect(formatNumber(0, { signDisplay: "exceptZero" })).toBe("0");
    expect(formatNumber(-3, { signDisplay: "never" })).toBe("3");
  });

  it("accepte une autre locale", () => {
    expect(formatNumber(1234.5, { locale: "en-US" })).toBe("1,234.5");
  });

  it.each([null, undefined, Number.NaN, Number.POSITIVE_INFINITY])(
    "renvoie une chaîne vide pour %s",
    (value) => {
      expect(formatNumber(value)).toBe("");
    },
  );

  it("lève une RangeError pour un nombre de décimales invalide", () => {
    expect(() => formatNumber(1, { maximumFractionDigits: 101 })).toThrow(RangeError);
    expect(() => formatNumber(1, { minimumFractionDigits: 3, maximumFractionDigits: 1 })).toThrow(
      RangeError,
    );
  });

  it("lève une RangeError pour une locale invalide", () => {
    expect(() => formatNumber(1, { locale: "pas une locale" })).toThrow(RangeError);
  });
});
