import { describe, expect, it } from "vitest";

import { randomInt } from "./random-int";

describe("randomInt", () => {
  it("renvoie la borne inférieure quand le générateur renvoie 0", () => {
    expect(randomInt(1, 6, () => 0)).toBe(1);
  });

  it("renvoie la borne supérieure quand le générateur approche 1", () => {
    expect(randomInt(1, 6, () => 0.999_999)).toBe(6);
  });

  it("ne dépasse pas max avec un générateur qui renvoie 1", () => {
    expect(randomInt(1, 6, () => 1)).toBe(6);
  });

  it("répartit le tirage sur tout l'intervalle", () => {
    expect(randomInt(0, 9, () => 0.55)).toBe(5);
    expect(randomInt(-3, 3, () => 0.5)).toBe(0);
  });

  it("renvoie la borne quand min et max sont égaux", () => {
    expect(randomInt(4, 4, () => 0.7)).toBe(4);
  });

  it("utilise Math.random par défaut", () => {
    for (let index = 0; index < 50; index += 1) {
      const value = randomInt(1, 3);
      expect(Number.isInteger(value) && value >= 1 && value <= 3).toBe(true);
    }
  });

  it.each([
    [1.5, 3],
    [1, Number.NaN],
    [5, 1],
    [0, Number.POSITIVE_INFINITY],
  ])("lève une RangeError pour les bornes %d et %d", (min, max) => {
    expect(() => randomInt(min, max)).toThrow(RangeError);
  });
});
