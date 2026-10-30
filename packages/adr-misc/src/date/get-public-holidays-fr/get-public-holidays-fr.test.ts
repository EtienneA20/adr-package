import { describe, expect, expectTypeOf, it } from "vitest";

import { getPublicHolidaysFr } from "./get-public-holidays-fr";
import type { IPublicHoliday } from "./get-public-holidays-fr";

const format = (holidays: IPublicHoliday[]): string[] =>
  holidays.map(({ date, name }) => `${date.format("YYYY-MM-DD")} ${name}`);

describe("getPublicHolidaysFr", () => {
  it("renvoie les 11 jours fériés de métropole dans l'ordre chronologique", () => {
    expect(format(getPublicHolidaysFr(2026))).toEqual([
      "2026-01-01 Jour de l'an",
      "2026-04-06 Lundi de Pâques",
      "2026-05-01 Fête du Travail",
      "2026-05-08 Victoire 1945",
      "2026-05-14 Ascension",
      "2026-05-25 Lundi de Pentecôte",
      "2026-07-14 Fête nationale",
      "2026-08-15 Assomption",
      "2026-11-01 Toussaint",
      "2026-11-11 Armistice 1918",
      "2026-12-25 Noël",
    ]);
  });

  it("ajoute le Vendredi saint et la Saint-Étienne pour l'Alsace-Moselle", () => {
    const holidays = format(getPublicHolidaysFr(2026, { alsaceMoselle: true }));
    expect(holidays).toHaveLength(13);
    expect(holidays[1]).toBe("2026-04-03 Vendredi saint");
    expect(holidays.at(-1)).toBe("2026-12-26 Saint-Étienne");
  });

  it("ignore les jours propres à l'Alsace-Moselle quand l'option est fausse", () => {
    expect(getPublicHolidaysFr(2026, { alsaceMoselle: false })).toHaveLength(11);
  });

  it("garde les deux jours fériés quand ils tombent le même jour", () => {
    const sameDay = format(getPublicHolidaysFr(2008)).filter((holiday) =>
      holiday.startsWith("2008-05-01"),
    );
    expect(sameDay).toEqual(["2008-05-01 Fête du Travail", "2008-05-01 Ascension"]);
  });

  it("renvoie des dates à minuit (heure locale)", () => {
    const [newYear] = getPublicHolidaysFr(2026);
    expect(newYear?.date.toDate()).toEqual(new Date(2026, 0, 1));
    expectTypeOf(getPublicHolidaysFr(2026)).toEqualTypeOf<IPublicHoliday[]>();
  });

  it("lève une RangeError pour une année invalide", () => {
    expect(() => getPublicHolidaysFr(1500)).toThrow(RangeError);
  });
});
