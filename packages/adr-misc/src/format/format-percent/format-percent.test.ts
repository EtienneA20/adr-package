import { describe, expect, it } from "vitest";

import { formatPercent } from "./format-percent";

describe("formatPercent", () => {
  it("formate un ratio en pourcentage avec une décimale au plus", () => {
    expect(formatPercent(0.125)).toBe("12,5\u00a0%");
    expect(formatPercent(0.4567)).toBe("45,7\u00a0%");
    expect(formatPercent(1)).toBe("100\u00a0%");
    expect(formatPercent(-0.05)).toBe("-5\u00a0%");
  });

  it("respecte le nombre minimal de décimales, même au-delà du maximum par défaut", () => {
    expect(formatPercent(0.5, { minimumFractionDigits: 2 })).toBe("50,00\u00a0%");
  });

  it("respecte le nombre maximal de décimales", () => {
    expect(formatPercent(0.12345, { maximumFractionDigits: 2 })).toBe("12,35\u00a0%");
    expect(formatPercent(0.125, { maximumFractionDigits: 0 })).toBe("13\u00a0%");
  });

  it("accepte une autre locale", () => {
    expect(formatPercent(0.125, { locale: "en-US" })).toBe("12.5%");
  });

  it.each([null, undefined, Number.NaN, Number.POSITIVE_INFINITY])(
    "renvoie une chaîne vide pour %s",
    (value) => {
      expect(formatPercent(value)).toBe("");
    },
  );

  it("lève une RangeError si le minimum de décimales dépasse le maximum", () => {
    expect(() =>
      formatPercent(0.5, { minimumFractionDigits: 3, maximumFractionDigits: 1 }),
    ).toThrow(RangeError);
  });
});
