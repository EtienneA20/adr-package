import { describe, expect, it } from "vitest";

import { isPublicHolidayFr } from "./is-public-holiday-fr";

describe("isPublicHolidayFr", () => {
  it("reconnaît un jour férié fixe et un jour férié mobile", () => {
    expect(isPublicHolidayFr(new Date(2026, 6, 14))).toBe(true);
    expect(isPublicHolidayFr(new Date(2026, 4, 25))).toBe(true);
  });

  it("ignore l'heure de la date (heure locale)", () => {
    expect(isPublicHolidayFr(new Date(2026, 10, 11, 23, 59))).toBe(true);
  });

  it("renvoie false pour un jour ordinaire", () => {
    expect(isPublicHolidayFr(new Date(2026, 9, 29))).toBe(false);
  });

  it("tient compte de l'option Alsace-Moselle", () => {
    expect(isPublicHolidayFr(new Date(2026, 11, 26))).toBe(false);
    expect(isPublicHolidayFr(new Date(2026, 11, 26), { alsaceMoselle: true })).toBe(true);
    expect(isPublicHolidayFr(new Date(2026, 3, 3), { alsaceMoselle: true })).toBe(true);
  });

  it("lève une erreur pour une date invalide", () => {
    expect(() => isPublicHolidayFr("31/12/2026")).toThrow(new Error("Date invalide."));
  });

  it("lève une RangeError pour une année hors de l'intervalle géré", () => {
    expect(() => isPublicHolidayFr(new Date(1500, 0, 1))).toThrow(RangeError);
  });
});
