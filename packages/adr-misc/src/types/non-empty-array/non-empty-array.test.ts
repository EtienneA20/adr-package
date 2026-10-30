import { describe, expectTypeOf, it } from "vitest";

import type { NonEmptyArray } from "./non-empty-array";

describe("NonEmptyArray", () => {
  it("est un tuple d'au moins un élément", () => {
    expectTypeOf<NonEmptyArray<string>>().toEqualTypeOf<[string, ...string[]]>();
  });

  it("type le premier élément sans undefined", () => {
    expectTypeOf<NonEmptyArray<number>[0]>().toEqualTypeOf<number>();
  });

  it("accepte un tableau non vide et refuse un tableau vide", () => {
    expectTypeOf<["a", "b"]>().toExtend<NonEmptyArray<string>>();
    expectTypeOf<[]>().not.toExtend<NonEmptyArray<string>>();
    expectTypeOf<string[]>().not.toExtend<NonEmptyArray<string>>();
  });
});
