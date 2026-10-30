import { describe, expect, expectTypeOf, it } from "vitest";

import { isNil } from "./is-nil";

describe("isNil", () => {
  it.each([null, undefined])("accepte %j", (value) => {
    expect(isNil(value)).toBe(true);
  });

  it.each([0, "", false, Number.NaN, [], {}])("refuse la valeur définie %j", (value) => {
    expect(isNil(value)).toBe(false);
  });

  it("affine le type dans les deux branches", () => {
    const value = 3 as number | null | undefined;
    if (isNil(value)) {
      expectTypeOf(value).toEqualTypeOf<null | undefined>();
    } else {
      expectTypeOf(value).toEqualTypeOf<number>();
    }
    expect(isNil(value)).toBe(false);
  });
});
