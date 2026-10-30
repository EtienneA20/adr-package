import { describe, expect, expectTypeOf, it } from "vitest";

import { EMonth } from "../month";
import { MONTH_LABELS } from "./month-labels";

describe("MONTH_LABELS", () => {
  it("donne le libellé français en minuscules de chaque mois, accents compris", () => {
    expect(MONTH_LABELS[EMonth.FEBRUARY]).toBe("février");
    expect(MONTH_LABELS[EMonth.AUGUST]).toBe("août");
    expect(MONTH_LABELS[EMonth.DECEMBER]).toBe("décembre");
  });

  it("s'indexe par Date.prototype.getMonth() (heure locale)", () => {
    const month = new Date(2026, 9, 29).getMonth() as EMonth;
    expect(MONTH_LABELS[month]).toBe("octobre");
  });

  it("couvre les 12 mois", () => {
    expect(Object.keys(MONTH_LABELS)).toHaveLength(12);
    expectTypeOf(MONTH_LABELS).toEqualTypeOf<Readonly<Record<EMonth, string>>>();
  });
});
