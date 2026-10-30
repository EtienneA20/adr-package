import { afterEach, describe, expect, it, vi } from "vitest";

import { getSchoolYear } from "./get-school-year";

describe("getSchoolYear", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("rattache l'automne à l'année scolaire qui commence (heure locale)", () => {
    expect(getSchoolYear(new Date(2026, 9, 29))).toBe("2026-2027");
  });

  it("change d'année scolaire le 1er septembre", () => {
    expect(getSchoolYear(new Date(2026, 7, 31, 23, 59))).toBe("2025-2026");
    expect(getSchoolYear(new Date(2026, 8, 1))).toBe("2026-2027");
  });

  it("rattache janvier à l'année scolaire commencée l'année précédente", () => {
    expect(getSchoolYear(new Date(2027, 0, 15))).toBe("2026-2027");
  });

  it("accepte un mois de début personnalisé", () => {
    expect(getSchoolYear(new Date(2026, 7, 31), { startMonth: 7 })).toBe("2026-2027");
    expect(getSchoolYear(new Date(2026, 0, 1), { startMonth: 0 })).toBe("2026-2027");
    expect(getSchoolYear(new Date(2026, 10, 30), { startMonth: 11 })).toBe("2025-2026");
  });

  it("utilise la date du jour par défaut (heure locale)", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 9, 29, 10));
    expect(getSchoolYear()).toBe("2026-2027");
  });

  it("lève une erreur pour une date invalide", () => {
    expect(() => getSchoolYear("rentrée")).toThrow(new Error("Date invalide."));
  });

  it.each([-1, 12, 8.5])("lève une RangeError pour le mois de début %s", (startMonth) => {
    expect(() => getSchoolYear(new Date(2026, 0, 1), { startMonth })).toThrow(
      new RangeError(
        "Le mois de rentrée doit être un entier compris entre 0 (janvier) et 11 (décembre).",
      ),
    );
  });
});
