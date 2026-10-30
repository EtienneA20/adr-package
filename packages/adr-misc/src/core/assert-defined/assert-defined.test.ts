import { describe, expect, expectTypeOf, it } from "vitest";

import { assertDefined } from "./assert-defined";

describe("assertDefined", () => {
  it("ne lève rien pour une valeur définie", () => {
    expect(() => {
      assertDefined({ title: "Germinal" }, "jamais levé");
    }).not.toThrow();
  });

  it.each([0, "", false, Number.NaN])("accepte la valeur falsy %j", (value) => {
    expect(() => {
      assertDefined(value, "jamais levé");
    }).not.toThrow();
  });

  it.each([null, undefined])("lève une erreur pour %j", (value) => {
    expect(() => {
      assertDefined(value, "Valeur absente");
    }).toThrow(new Error("Valeur absente"));
  });

  it("affine le type de la valeur après l'appel", () => {
    const value = 0 as number | null | undefined;
    assertDefined(value, "valeur absente");
    expectTypeOf(value).toEqualTypeOf<number>();
  });
});
