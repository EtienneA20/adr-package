import { describe, expect, it } from "vitest";

import { randomFloat } from "./random-float";

describe("randomFloat", () => {
  it("projette le générateur sur l'intervalle", () => {
    expect(randomFloat(10, 20, () => 0.5)).toBe(15);
    expect(randomFloat(10, 20, () => 0)).toBe(10);
  });

  it("renvoie min quand les bornes sont égales", () => {
    expect(randomFloat(3, 3, () => 0.9)).toBe(3);
  });

  it("utilise Math.random par défaut", () => {
    const value = randomFloat(-1, 1);
    expect(value).toBeGreaterThanOrEqual(-1);
    expect(value).toBeLessThan(1);
  });

  it.each([
    [5, 1],
    [Number.NaN, 1],
    [0, Number.POSITIVE_INFINITY],
  ])("lève une RangeError pour les bornes %d et %d", (min, max) => {
    expect(() => randomFloat(min, max)).toThrow(RangeError);
  });
});
