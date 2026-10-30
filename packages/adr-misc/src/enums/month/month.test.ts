import { describe, expect, expectTypeOf, it } from "vitest";

import { EMonth } from "./month";

describe("EMonth", () => {
  it("suit la numérotation de Date.prototype.getMonth() (heure locale)", () => {
    expect(new Date(2026, EMonth.OCTOBER, 29).getMonth()).toBe(9);
    expect(new Date(2026, 0, 1).getMonth()).toBe(EMonth.JANUARY);
    expect(new Date(2026, 11, 31).getMonth()).toBe(EMonth.DECEMBER);
  });

  it("contient les 12 mois, de 0 à 11", () => {
    expect(Object.values(EMonth)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
  });

  it("expose le type union des valeurs", () => {
    expectTypeOf(EMonth.MAY).toEqualTypeOf<4>();
    expectTypeOf<EMonth>().toExtend<number>();
  });
});
