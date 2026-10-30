import { describe, expect, it } from "vitest";

import { clamp } from "./clamp";

describe("clamp", () => {
  it("renvoie la valeur quand elle est dans l'intervalle", () => {
    expect(clamp(4, 0, 5)).toBe(4);
  });

  it("ramène la valeur à la borne inférieure", () => {
    expect(clamp(-3, 0, 5)).toBe(0);
  });

  it("ramène la valeur à la borne supérieure", () => {
    expect(clamp(12, 1, 10)).toBe(10);
  });

  it("accepte des bornes égales", () => {
    expect(clamp(7, 3, 3)).toBe(3);
  });

  it("renvoie NaN pour une valeur NaN", () => {
    expect(clamp(Number.NaN, 0, 5)).toBeNaN();
  });

  it("accepte des bornes infinies", () => {
    expect(clamp(42, 0, Number.POSITIVE_INFINITY)).toBe(42);
  });

  it("lève une RangeError si min est supérieur à max", () => {
    expect(() => clamp(1, 10, 0)).toThrow(RangeError);
    expect(() => clamp(1, 10, 0)).toThrow(
      "Bornes invalides : min (10) doit être inférieur ou égal à max (0).",
    );
  });

  it("lève une RangeError si une borne vaut NaN", () => {
    expect(() => clamp(1, Number.NaN, 5)).toThrow(RangeError);
  });
});
