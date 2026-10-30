import { describe, expectTypeOf, it } from "vitest";

import type { Maybe } from "./maybe";

describe("Maybe", () => {
  it("ajoute null et undefined au type", () => {
    expectTypeOf<Maybe<string>>().toEqualTypeOf<string | null | undefined>();
  });

  it("est idempotent", () => {
    expectTypeOf<Maybe<Maybe<number>>>().toEqualTypeOf<number | null | undefined>();
  });
});
