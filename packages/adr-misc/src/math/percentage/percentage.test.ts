import { describe, expect, it } from "vitest";

import { percentage } from "./percentage";

describe("percentage", () => {
  it("calcule le pourcentage", () => {
    expect(percentage(30, 120)).toBe(25);
  });

  it("ne l'arrondit pas sans nombre de décimales", () => {
    expect(percentage(1, 3)).toBeCloseTo(33.3333, 4);
  });

  it("l'arrondit au nombre de décimales demandé", () => {
    expect(percentage(1, 3, 1)).toBe(33.3);
    expect(percentage(2, 3, 0)).toBe(67);
  });

  it("peut dépasser 100 %", () => {
    expect(percentage(150, 100)).toBe(150);
  });

  it("renvoie 0 quand le total vaut 0", () => {
    expect(percentage(5, 0)).toBe(0);
    expect(percentage(0, 0, 2)).toBe(0);
  });

  it("lève une RangeError si decimals n'est pas un entier", () => {
    expect(() => percentage(1, 3, 0.5)).toThrow(RangeError);
  });
});
