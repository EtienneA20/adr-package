import { describe, expect, expectTypeOf, it } from "vitest";

import { EWeekDay } from "../week-day";
import { WEEK_DAY_LABELS } from "./week-day-labels";

describe("WEEK_DAY_LABELS", () => {
  it("donne le libellé français en minuscules de chaque jour", () => {
    expect(WEEK_DAY_LABELS[EWeekDay.MONDAY]).toBe("lundi");
    expect(WEEK_DAY_LABELS[EWeekDay.SUNDAY]).toBe("dimanche");
  });

  it("s'indexe par Date.prototype.getDay() (heure locale)", () => {
    const day = new Date(2026, 9, 31).getDay() as EWeekDay;
    expect(WEEK_DAY_LABELS[day]).toBe("samedi");
  });

  it("couvre les 7 jours dans l'ordre de getDay()", () => {
    expect(Object.values(WEEK_DAY_LABELS)).toEqual([
      "dimanche",
      "lundi",
      "mardi",
      "mercredi",
      "jeudi",
      "vendredi",
      "samedi",
    ]);
    expectTypeOf(WEEK_DAY_LABELS).toEqualTypeOf<Readonly<Record<EWeekDay, string>>>();
  });
});
