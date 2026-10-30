import { describe, expect, it } from "vitest";

import { countBusinessDays } from "./count-business-days";

describe("countBusinessDays", () => {
  it("compte les jours ouvrés d'une semaine, bornes incluses (heure locale)", () => {
    expect(countBusinessDays(new Date(2026, 10, 2), new Date(2026, 10, 6))).toBe(5);
  });

  it("exclut les week-ends et les jours fériés", () => {
    expect(countBusinessDays(new Date(2026, 10, 9), new Date(2026, 10, 15))).toBe(4);
  });

  it("renvoie 1 ou 0 pour une période d'un seul jour", () => {
    expect(countBusinessDays(new Date(2026, 10, 2, 18), new Date(2026, 10, 2, 8))).toBe(1);
    expect(countBusinessDays(new Date(2026, 10, 1), new Date(2026, 10, 1))).toBe(0);
  });

  it("traverse un changement d'année", () => {
    expect(countBusinessDays(new Date(2026, 11, 24), new Date(2027, 0, 4))).toBe(6);
  });

  it("tient compte de l'option Alsace-Moselle", () => {
    const start = new Date(2026, 11, 21);
    const end = new Date(2026, 11, 31);
    expect(countBusinessDays(start, end)).toBe(8);
    expect(countBusinessDays(start, end, { alsaceMoselle: true })).toBe(8);
    expect(countBusinessDays(new Date(2026, 3, 1), new Date(2026, 3, 3))).toBe(3);
    expect(
      countBusinessDays(new Date(2026, 3, 1), new Date(2026, 3, 3), { alsaceMoselle: true }),
    ).toBe(2);
  });

  it("lève une erreur pour une borne invalide", () => {
    expect(() => countBusinessDays("x", new Date(2026, 0, 1))).toThrow(
      new Error("Date de début invalide."),
    );
    expect(() => countBusinessDays(new Date(2026, 0, 1), "x")).toThrow(
      new Error("Date de fin invalide."),
    );
  });

  it("lève une erreur si le début est postérieur à la fin", () => {
    expect(() => countBusinessDays(new Date(2026, 0, 2), new Date(2026, 0, 1))).toThrow(
      new Error("La date de début est postérieure à la date de fin."),
    );
  });

  it("lève une RangeError pour une année hors de l'intervalle géré", () => {
    expect(() => countBusinessDays(new Date(1500, 0, 1), new Date(1500, 0, 5))).toThrow(RangeError);
  });
});
