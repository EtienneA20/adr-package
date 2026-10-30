import { describe, expect, expectTypeOf, it } from "vitest";

import { isEnumValue } from "./is-enum-value";

const ESort = { ASC: "asc", DESC: "desc" } as const;
const EDay = { SUNDAY: 0, MONDAY: 1 } as const;

describe("isEnumValue", () => {
  it("renvoie true pour une valeur de l'énumération", () => {
    expect(isEnumValue(ESort, "asc")).toBe(true);
    expect(isEnumValue(EDay, 0)).toBe(true);
  });

  it("renvoie false pour une clé, une valeur inconnue ou un autre type", () => {
    expect(isEnumValue(ESort, "ASC")).toBe(false);
    expect(isEnumValue(ESort, "up")).toBe(false);
    expect(isEnumValue(EDay, "1")).toBe(false);
    expect(isEnumValue(EDay, null)).toBe(false);
    expect(isEnumValue(EDay, undefined)).toBe(false);
  });

  it("affine le type de la valeur testée", () => {
    const value: unknown = "desc";
    if (isEnumValue(ESort, value)) {
      expectTypeOf(value).toEqualTypeOf<"asc" | "desc">();
    }
    expect(isEnumValue(ESort, value)).toBe(true);
  });
});
