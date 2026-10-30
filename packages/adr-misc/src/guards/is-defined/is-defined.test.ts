import { describe, expect, expectTypeOf, it } from "vitest";

import { isDefined } from "./is-defined";

describe("isDefined", () => {
  it.each([0, "", false, Number.NaN, [], {}])("accepte la valeur définie %j", (value) => {
    expect(isDefined(value)).toBe(true);
  });

  it.each([null, undefined])("refuse %j", (value) => {
    expect(isDefined(value)).toBe(false);
  });

  it("retire les valeurs absentes d'un tableau en conservant les valeurs falsy", () => {
    const values = [1, null, 0, undefined, 2];
    const defined = values.filter(isDefined);
    expect(defined).toEqual([1, 0, 2]);
    expectTypeOf(defined).toEqualTypeOf<number[]>();
  });

  it("affine le type en retirant null et undefined", () => {
    const value = "Dune" as string | null | undefined;
    if (isDefined(value)) {
      expectTypeOf(value).toEqualTypeOf<string>();
    } else {
      expectTypeOf(value).toEqualTypeOf<null | undefined>();
    }
    expect(isDefined(value)).toBe(true);
  });
});
