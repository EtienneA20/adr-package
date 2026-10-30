import { describe, expect, expectTypeOf, it } from "vitest";

import { isBoolean } from "./is-boolean";

describe("isBoolean", () => {
  it.each([true, false])("accepte %j", (value) => {
    expect(isBoolean(value)).toBe(true);
  });

  it.each(["true", "false", 0, 1, null, undefined])("refuse %j", (value) => {
    expect(isBoolean(value)).toBe(false);
  });

  it("affine le type en boolean", () => {
    const value: unknown = false;
    if (isBoolean(value)) {
      expectTypeOf(value).toEqualTypeOf<boolean>();
    }
    expect(isBoolean(value)).toBe(true);
  });
});
