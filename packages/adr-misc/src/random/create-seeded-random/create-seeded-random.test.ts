import { describe, expect, it } from "vitest";

import { createSeededRandom } from "./create-seeded-random";

/**
 * Tire `count` nombres successifs d'un générateur.
 *
 * @param random - Générateur.
 * @param count - Nombre de tirages.
 * @returns Les nombres tirés.
 */
function draw(random: () => number, count: number): number[] {
  return Array.from({ length: count }, () => random());
}

describe("createSeededRandom", () => {
  it("produit la même suite pour la même graine numérique", () => {
    expect(draw(createSeededRandom(42), 5)).toEqual(draw(createSeededRandom(42), 5));
  });

  it("produit la même suite pour la même graine textuelle", () => {
    expect(draw(createSeededRandom("démo"), 5)).toEqual(draw(createSeededRandom("démo"), 5));
  });

  it("produit des suites différentes pour des graines différentes", () => {
    expect(draw(createSeededRandom(1), 5)).not.toEqual(draw(createSeededRandom(2), 5));
    expect(draw(createSeededRandom("a"), 5)).not.toEqual(draw(createSeededRandom("b"), 5));
  });

  it("produit la suite de référence de mulberry32", () => {
    const random = createSeededRandom(0);
    expect(random()).toBe(0.266_429_208_684_712_65);
    expect(random()).toBe(0.000_329_745_700_582_861_9);
  });

  it("renvoie des nombres dans [0, 1) répartis sur l'intervalle", () => {
    const values = draw(createSeededRandom(123), 10_000);
    expect(values.every((value) => value >= 0 && value < 1)).toBe(true);
    const mean = values.reduce((total, value) => total + value, 0) / values.length;
    expect(mean).toBeGreaterThan(0.48);
    expect(mean).toBeLessThan(0.52);
  });

  it("accepte une graine vide ou décimale", () => {
    expect(draw(createSeededRandom(""), 2)).toEqual(draw(createSeededRandom(""), 2));
    expect(draw(createSeededRandom(7.9), 2)).toEqual(draw(createSeededRandom(7), 2));
  });

  it.each([Number.NaN, Number.POSITIVE_INFINITY])(
    "lève une RangeError pour la graine %d",
    (seed) => {
      expect(() => createSeededRandom(seed)).toThrow(RangeError);
    },
  );
});
