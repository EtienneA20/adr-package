import { describe, expect, it } from "vitest";

import { getIsoWeek } from "./get-iso-week";

describe("getIsoWeek", () => {
  it.each([
    [new Date(2026, 9, 29), 44],
    [new Date(2026, 0, 1), 1],
    [new Date(2026, 0, 4), 1],
    [new Date(2026, 0, 5), 2],
    [new Date(2026, 11, 31), 53],
    [new Date(2027, 0, 1), 53],
    [new Date(2027, 0, 3), 53],
    [new Date(2027, 0, 4), 1],
    [new Date(2024, 11, 30), 1],
    [new Date(2021, 0, 3), 53],
    [new Date(2022, 0, 2), 52],
  ])("renvoie la semaine ISO de %s (heure locale)", (date, expected) => {
    expect(getIsoWeek(date)).toBe(expected);
  });

  it("ignore l'heure et le changement d'heure", () => {
    expect(getIsoWeek(new Date(2026, 2, 29, 23, 59))).toBe(13);
    expect(getIsoWeek(new Date(2026, 2, 30, 0, 1))).toBe(14);
  });

  it("lève une erreur pour une date invalide", () => {
    expect(() => getIsoWeek("semaine")).toThrow(new Error("Date invalide."));
  });
});
