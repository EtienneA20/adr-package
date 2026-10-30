import { describe, expect, it } from "vitest";

import { isBusinessDay } from "./is-business-day";

describe("isBusinessDay", () => {
  it("renvoie true pour un jour de semaine ordinaire (heure locale)", () => {
    expect(isBusinessDay(new Date(2026, 10, 2))).toBe(true);
  });

  it("renvoie false le week-end", () => {
    expect(isBusinessDay(new Date(2026, 9, 31))).toBe(false);
    expect(isBusinessDay(new Date(2026, 10, 1))).toBe(false);
  });

  it("renvoie false un jour férié de semaine", () => {
    expect(isBusinessDay(new Date(2026, 10, 11))).toBe(false);
  });

  it("tient compte de l'option Alsace-Moselle", () => {
    expect(isBusinessDay(new Date(2026, 3, 3))).toBe(true);
    expect(isBusinessDay(new Date(2026, 3, 3), { alsaceMoselle: true })).toBe(false);
  });

  it("lève une erreur pour une date invalide", () => {
    expect(() => isBusinessDay(null)).toThrow(new Error("Date invalide."));
  });

  it("lève une RangeError pour une année hors de l'intervalle géré", () => {
    expect(() => isBusinessDay(new Date(1500, 0, 2))).toThrow(RangeError);
  });
});
