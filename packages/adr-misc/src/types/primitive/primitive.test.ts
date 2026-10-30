import { describe, expectTypeOf, it } from "vitest";

import type { Primitive } from "./primitive";

describe("Primitive", () => {
  it("regroupe les sept types primitifs", () => {
    expectTypeOf<Primitive>().toEqualTypeOf<
      string | number | bigint | boolean | symbol | null | undefined
    >();
  });

  it("exclut les objets, tableaux et fonctions", () => {
    expectTypeOf<Date>().not.toExtend<Primitive>();
    expectTypeOf<string[]>().not.toExtend<Primitive>();
    expectTypeOf<() => void>().not.toExtend<Primitive>();
    expectTypeOf<"Dune">().toExtend<Primitive>();
  });
});
