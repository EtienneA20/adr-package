import { describe, expect, it } from "vitest";

import { formatBytes } from "./format-bytes";

describe("formatBytes", () => {
  it.each([
    [0, "0\u00a0o"],
    [512, "512\u00a0o"],
    [1500, "1,5\u00a0ko"],
    [1_500_000, "1,5\u00a0Mo"],
    [2_000_000_000, "2\u00a0Go"],
    [3.2e12, "3,2\u00a0To"],
    [5e15, "5\u00a0Po"],
    [5e18, "5\u202f000\u00a0Po"],
  ])("formate %d octets en « %s » (unités décimales)", (bytes, expected) => {
    expect(formatBytes(bytes)).toBe(expected);
  });

  it("passe à l'unité supérieure quand l'arrondi atteint la base", () => {
    expect(formatBytes(999_999)).toBe("1\u00a0Mo");
    expect(formatBytes(999)).toBe("999\u00a0o");
    expect(formatBytes(999.96)).toBe("1\u00a0ko");
  });

  it("utilise les unités binaires sur demande", () => {
    expect(formatBytes(1536, { binary: true })).toBe("1,5\u00a0Kio");
    expect(formatBytes(1024 ** 3, { binary: true })).toBe("1\u00a0Gio");
  });

  it("respecte le nombre de décimales et la locale", () => {
    expect(formatBytes(1_234_567, { decimals: 2 })).toBe("1,23\u00a0Mo");
    expect(formatBytes(1_234_567, { decimals: 0 })).toBe("1\u00a0Mo");
    expect(formatBytes(1500, { locale: "en-US" })).toBe("1.5\u00a0ko");
  });

  it("conserve le signe d'une valeur négative", () => {
    expect(formatBytes(-1500)).toBe("-1,5\u00a0ko");
  });

  it.each([null, undefined, Number.NaN, Number.POSITIVE_INFINITY])(
    "renvoie une chaîne vide pour %s",
    (value) => {
      expect(formatBytes(value)).toBe("");
    },
  );

  it("lève une RangeError pour un nombre de décimales invalide", () => {
    expect(() => formatBytes(1500, { decimals: -1 })).toThrow(RangeError);
  });
});
