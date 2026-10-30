import { describe, expect, expectTypeOf, it } from "vitest";

import { isFunction } from "./is-function";

describe("isFunction", () => {
  it("accepte les différentes formes de fonctions", () => {
    expect(isFunction(() => 1)).toBe(true);
    expect(
      isFunction(function named() {
        return 1;
      }),
    ).toBe(true);
    expect(isFunction(async () => Promise.resolve(1))).toBe(true);
    expect(
      isFunction(
        class Book {
          public title = "Dune";
        },
      ),
    ).toBe(true);
    expect(isFunction(Math.max)).toBe(true);
  });

  it.each([null, undefined, "fn", 1, {}, []])("refuse %j", (value) => {
    expect(isFunction(value)).toBe(false);
  });

  it("conserve le type exact de la fonction sur une union", () => {
    const label = (() => "Emprunts") as string | (() => string);
    const resolved = isFunction(label) ? label() : label;
    if (isFunction(label)) {
      expectTypeOf(label).toEqualTypeOf<() => string>();
    } else {
      expectTypeOf(label).toEqualTypeOf<string>();
    }
    expect(resolved).toBe("Emprunts");
  });

  it("permet d'appeler sans argument une valeur unknown affinée", () => {
    const value: unknown = () => 42;
    const result = isFunction(value) ? value() : undefined;
    expectTypeOf(result).toEqualTypeOf<unknown>();
    expect(result).toBe(42);
  });
});
