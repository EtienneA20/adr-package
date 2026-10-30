import { describe, expect, it } from "vitest";

import { addBusinessDays } from "./add-business-days";

const iso = (date: { format: (template: string) => string }): string => date.format("YYYY-MM-DD");

describe("addBusinessDays", () => {
  it("ajoute des jours ouvrés en sautant le week-end (heure locale)", () => {
    expect(iso(addBusinessDays(new Date(2026, 9, 30), 1))).toBe("2026-11-02");
    expect(iso(addBusinessDays(new Date(2026, 9, 26), 4))).toBe("2026-10-30");
  });

  it("saute les jours fériés", () => {
    expect(iso(addBusinessDays(new Date(2026, 10, 10), 1))).toBe("2026-11-12");
  });

  it("recule avec un nombre négatif", () => {
    expect(iso(addBusinessDays(new Date(2026, 10, 2), -1))).toBe("2026-10-30");
    expect(iso(addBusinessDays(new Date(2026, 10, 12), -1))).toBe("2026-11-10");
  });

  it("renvoie la date inchangée pour 0 jour, même un jour non ouvré", () => {
    expect(iso(addBusinessDays(new Date(2026, 9, 31), 0))).toBe("2026-10-31");
  });

  it("conserve l'heure de la date de départ", () => {
    const result = addBusinessDays(new Date(2026, 9, 30, 14, 30), 1);
    expect(result.toDate()).toEqual(new Date(2026, 10, 2, 14, 30));
  });

  it("change d'année en tenant compte des jours fériés de l'année suivante", () => {
    expect(iso(addBusinessDays(new Date(2026, 11, 31), 1))).toBe("2027-01-04");
  });

  it("tient compte de l'option Alsace-Moselle", () => {
    expect(iso(addBusinessDays(new Date(2026, 3, 2), 1))).toBe("2026-04-03");
    expect(iso(addBusinessDays(new Date(2026, 3, 2), 1, { alsaceMoselle: true }))).toBe(
      "2026-04-07",
    );
  });

  it("lève une erreur pour une date invalide", () => {
    expect(() => addBusinessDays("n'importe quoi", 1)).toThrow(new Error("Date invalide."));
  });

  it.each([1.5, Number.NaN, Number.POSITIVE_INFINITY])(
    "lève une RangeError pour un nombre de jours non entier (%s)",
    (days) => {
      expect(() => addBusinessDays(new Date(2026, 0, 1), days)).toThrow(
        new RangeError("Le nombre de jours ouvrés doit être un entier."),
      );
    },
  );

  it("lève une RangeError quand le calcul sort des années gérées", () => {
    expect(() => addBusinessDays(new Date(1583, 0, 3), -5)).toThrow(RangeError);
  });
});
