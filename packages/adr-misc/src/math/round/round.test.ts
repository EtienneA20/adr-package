import { describe, expect, it } from "vitest";

import { round } from "./round";

describe("round", () => {
  it("arrondit à l'entier le plus proche par défaut", () => {
    expect(round(2.4)).toBe(2);
    expect(round(2.5)).toBe(3);
  });

  it.each([
    [1.005, 2, 1.01],
    [1.255, 2, 1.26],
    [10.075, 2, 10.08],
    [0.1 + 0.2, 2, 0.3],
    [3.14159, 3, 3.142],
  ])("arrondit %d à %d décimales sans erreur flottante", (value, decimals, expected) => {
    expect(round(value, decimals)).toBe(expected);
  });

  it("arrondit les demis négatifs en s'éloignant de zéro", () => {
    expect(round(-2.5)).toBe(-3);
    expect(round(-1.005, 2)).toBe(-1.01);
  });

  it("ne renvoie pas -0", () => {
    expect(Object.is(round(-0.4), 0)).toBe(true);
  });

  it("accepte un nombre de décimales négatif", () => {
    expect(round(1234.5, -2)).toBe(1200);
  });

  it("gère les nombres en notation exponentielle", () => {
    expect(round(1.23456e-7, 9)).toBe(1.23e-7);
    expect(round(1e21, 2)).toBe(1e21);
  });

  it.each([Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY])(
    "renvoie %d tel quel",
    (value) => {
      expect(round(value, 2)).toBe(value);
    },
  );

  it("renvoie la valeur telle quelle si la précision dépasse celle d'un flottant", () => {
    expect(round(1.5, 400)).toBe(1.5);
  });

  it("lève une RangeError si decimals n'est pas un entier", () => {
    expect(() => round(1.5, 1.5)).toThrow(RangeError);
    expect(() => round(1.5, 1.5)).toThrow(
      "Le nombre de décimales doit être un entier (reçu : 1.5).",
    );
  });
});
