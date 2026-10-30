import { describe, expect, expectTypeOf, it } from "vitest";

import { EWeekDay } from "./week-day";

describe("EWeekDay", () => {
  it("suit la numérotation de Date.prototype.getDay() (heure locale)", () => {
    expect(new Date(2026, 10, 1).getDay()).toBe(EWeekDay.SUNDAY);
    expect(new Date(2026, 10, 2).getDay()).toBe(EWeekDay.MONDAY);
    expect(new Date(2026, 9, 31).getDay()).toBe(EWeekDay.SATURDAY);
  });

  it("contient les 7 jours, de 0 à 6", () => {
    expect(Object.values(EWeekDay)).toEqual([0, 1, 2, 3, 4, 5, 6]);
  });

  it("expose le type union des valeurs", () => {
    expectTypeOf<EWeekDay>().toEqualTypeOf<0 | 1 | 2 | 3 | 4 | 5 | 6>();
  });
});
