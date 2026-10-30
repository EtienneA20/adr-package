import { describe, expect, expectTypeOf, it } from "vitest";

import { isString } from "./is-string";

describe("isString", () => {
  it.each(["Dune", "", " "])("accepte la chaîne %j", (value) => {
    expect(isString(value)).toBe(true);
  });

  it.each([42, null, undefined, ["a"], { title: "Dune" }])("refuse %j", (value) => {
    expect(isString(value)).toBe(false);
  });

  it("refuse un objet String", () => {
    expect(isString(new String("Dune"))).toBe(false);
  });

  it("affine le type en string", () => {
    const value: unknown = "Dune";
    if (isString(value)) {
      expectTypeOf(value).toEqualTypeOf<string>();
    }
    expect(isString(value)).toBe(true);
  });
});
