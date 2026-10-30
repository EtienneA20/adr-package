import { describe, expect, expectTypeOf, it } from "vitest";

import { isNonEmptyString } from "./is-non-empty-string";

describe("isNonEmptyString", () => {
  it.each(["Dune", " a ", "0"])("accepte la chaîne non vide %j", (value) => {
    expect(isNonEmptyString(value)).toBe(true);
  });

  it.each(["", "   ", "\t\n", " "])("refuse la chaîne vide ou blanche %j", (value) => {
    expect(isNonEmptyString(value)).toBe(false);
  });

  it.each([null, undefined, 42, ["Dune"]])(
    "refuse la valeur qui n'est pas une chaîne %j",
    (value) => {
      expect(isNonEmptyString(value)).toBe(false);
    },
  );

  it("affine le type en string", () => {
    const value: unknown = "Dune";
    if (isNonEmptyString(value)) {
      expectTypeOf(value).toEqualTypeOf<string>();
    }
    expect(isNonEmptyString(value)).toBe(true);
  });
});
