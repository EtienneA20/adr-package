import { describe, expectTypeOf, it } from "vitest";

import type { Nullable } from "./nullable";

describe("Nullable", () => {
  it("ajoute null au type", () => {
    expectTypeOf<Nullable<string>>().toEqualTypeOf<string | null>();
  });

  it("n'ajoute pas undefined", () => {
    expectTypeOf<undefined>().not.toExtend<Nullable<string>>();
  });

  it("est idempotent", () => {
    expectTypeOf<Nullable<Nullable<Date>>>().toEqualTypeOf<Date | null>();
  });
});
