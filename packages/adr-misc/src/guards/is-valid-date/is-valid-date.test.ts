import { describe, expect, expectTypeOf, it } from "vitest";

import { isValidDate } from "./is-valid-date";

describe("isValidDate", () => {
  it("accepte une date valide", () => {
    expect(isValidDate(new Date(2026, 0, 15))).toBe(true);
    expect(isValidDate(new Date(0))).toBe(true);
  });

  it("refuse une date invalide", () => {
    expect(isValidDate(new Date("pas une date"))).toBe(false);
    expect(isValidDate(new Date(Number.NaN))).toBe(false);
  });

  it.each(["2026-01-15", 1_768_435_200_000, null, undefined, {}])(
    "refuse la valeur qui n'est pas une Date %j",
    (value) => {
      expect(isValidDate(value)).toBe(false);
    },
  );

  it("affine le type en Date", () => {
    const value: unknown = new Date(2026, 0, 15);
    const year = isValidDate(value) ? value.getFullYear() : undefined;
    if (isValidDate(value)) {
      expectTypeOf(value).toEqualTypeOf<Date>();
    }
    expect(year).toBe(2026);
  });
});
