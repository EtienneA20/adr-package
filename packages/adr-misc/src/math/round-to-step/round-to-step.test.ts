import { describe, expect, it } from "vitest";

import { roundToStep } from "./round-to-step";

describe("roundToStep", () => {
  it.each([
    [1.23, 0.05, 1.25],
    [1.22, 0.05, 1.2],
    [1.15, 0.05, 1.15],
    [1.125, 0.05, 1.15],
    [52, 15, 45],
    [53, 15, 60],
    [7, 10, 10],
    [-7, 10, -10],
    [0.3, 0.1, 0.3],
  ])("arrondit %d au multiple de %d le plus proche", (value, step, expected) => {
    expect(roundToStep(value, step)).toBe(expected);
  });

  it("gère un pas en notation exponentielle", () => {
    expect(roundToStep(3.3e-7, 2.5e-7)).toBe(2.5e-7);
    expect(roundToStep(3.3e-7, 1e-7)).toBe(3e-7);
  });

  it("gère un très grand pas", () => {
    expect(roundToStep(1.4e21, 1e21)).toBe(1e21);
  });

  it.each([0, -5, Number.NaN, Number.POSITIVE_INFINITY])(
    "lève une RangeError pour le pas %d",
    (step) => {
      expect(() => roundToStep(10, step)).toThrow(RangeError);
    },
  );

  it("précise le pas reçu dans le message", () => {
    expect(() => roundToStep(10, 0)).toThrow(
      "Le pas doit être un nombre fini strictement positif (reçu : 0).",
    );
  });
});
