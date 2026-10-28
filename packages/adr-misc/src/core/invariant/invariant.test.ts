import { describe, expect, expectTypeOf, it } from "vitest";

import { invariant } from "./invariant";

describe("invariant", () => {
  it("ne lève rien quand la condition est vraie", () => {
    expect(() => {
      invariant(true, "jamais levé");
    }).not.toThrow();
  });

  it.each([1, "texte", {}, []])("accepte la valeur truthy %j", (value) => {
    expect(() => {
      invariant(value, "jamais levé");
    }).not.toThrow();
  });

  it.each([false, 0, "", null, undefined, Number.NaN])(
    "lève une erreur pour la valeur falsy %j",
    (value) => {
      expect(() => {
        invariant(value, "Condition non respectée");
      }).toThrow(new Error("Condition non respectée"));
    },
  );

  it("affine le type de la condition après l'appel", () => {
    const value = "a" as string | undefined;
    invariant(value, "valeur absente");
    expectTypeOf(value).toEqualTypeOf<string>();
  });
});
