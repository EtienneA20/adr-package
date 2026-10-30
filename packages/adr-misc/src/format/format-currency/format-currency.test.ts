import { describe, expect, it } from "vitest";

import { formatCurrency } from "./format-currency";

describe("formatCurrency", () => {
  it("formate un montant en euros au format français", () => {
    expect(formatCurrency(1234.5)).toBe("1\u202f234,50\u00a0€");
    expect(formatCurrency(0)).toBe("0,00\u00a0€");
    expect(formatCurrency(-3.2)).toBe("-3,20\u00a0€");
  });

  it("impose le nombre de décimales", () => {
    expect(formatCurrency(-3, { fractionDigits: 0 })).toBe("-3\u00a0€");
    expect(formatCurrency(1.23456, { fractionDigits: 3 })).toBe("1,235\u00a0€");
  });

  it("accepte une autre devise et une autre locale", () => {
    expect(formatCurrency(1234.5, { currency: "USD", fractionDigits: 0 })).toBe(
      "1\u202f235\u00a0$US",
    );
    expect(formatCurrency(1234.5, { currency: "USD", locale: "en-US" })).toBe("$1,234.50");
  });

  it.each([null, undefined, Number.NaN, Number.NEGATIVE_INFINITY])(
    "renvoie une chaîne vide pour %s",
    (value) => {
      expect(formatCurrency(value)).toBe("");
    },
  );

  it("lève une RangeError pour un code de devise invalide", () => {
    expect(() => formatCurrency(1, { currency: "EURO" })).toThrow(RangeError);
  });

  it("lève une RangeError pour un nombre de décimales invalide", () => {
    expect(() => formatCurrency(1, { fractionDigits: -1 })).toThrow(RangeError);
  });
});
