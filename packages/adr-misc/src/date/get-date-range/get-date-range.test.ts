import { describe, expect, it } from "vitest";

import { getDateRange } from "./get-date-range";

describe("getDateRange", () => {
  it("liste les jours entre deux dates, bornes incluses, à minuit (heure locale)", () => {
    const days = getDateRange(new Date(2026, 9, 30, 15), new Date(2026, 10, 2, 9));
    expect(days.map((day) => day.format("YYYY-MM-DD"))).toEqual([
      "2026-10-30",
      "2026-10-31",
      "2026-11-01",
      "2026-11-02",
    ]);
    expect(days[0]?.toDate()).toEqual(new Date(2026, 9, 30));
  });

  it("renvoie un seul jour quand les bornes tombent le même jour", () => {
    expect(getDateRange(new Date(2026, 9, 29, 20), new Date(2026, 9, 29, 8))).toHaveLength(1);
  });

  it("traverse le changement d'heure sans doublon ni trou", () => {
    const days = getDateRange(new Date(2026, 9, 24), new Date(2026, 9, 27));
    expect(days.map((day) => day.date())).toEqual([24, 25, 26, 27]);
  });

  it("liste les mois au 1er du mois", () => {
    const months = getDateRange(new Date(2026, 8, 15), new Date(2027, 0, 1), "month");
    expect(months.map((month) => month.format("YYYY-MM-DD"))).toEqual([
      "2026-09-01",
      "2026-10-01",
      "2026-11-01",
      "2026-12-01",
      "2027-01-01",
    ]);
  });

  it("liste les années au 1er janvier", () => {
    const years = getDateRange(new Date(2024, 5, 1), new Date(2026, 0, 1), "year");
    expect(years.map((year) => year.format("YYYY-MM-DD"))).toEqual([
      "2024-01-01",
      "2025-01-01",
      "2026-01-01",
    ]);
  });

  it("lève une erreur pour une borne invalide", () => {
    expect(() => getDateRange(new Date(2026, 0, 1), null)).toThrow(
      new Error("Date de fin invalide."),
    );
  });

  it("lève une erreur si le début est postérieur à la fin (à l'unité près)", () => {
    expect(() => getDateRange(new Date(2026, 1, 1), new Date(2026, 0, 31), "month")).toThrow(
      new Error("La date de début est postérieure à la date de fin."),
    );
    expect(getDateRange(new Date(2026, 0, 31), new Date(2026, 0, 1), "month")).toHaveLength(1);
  });
});
