import { describe, expectTypeOf, it } from "vitest";

import type { Mutable } from "./mutable";

interface IDefaultLoan {
  readonly days: 21;
  readonly renewals: 1;
}

describe("Mutable", () => {
  it("retire readonly des propriétés", () => {
    expectTypeOf<Mutable<IDefaultLoan>>().toEqualTypeOf<{ days: 21; renewals: 1 }>();
  });

  it("rend modifiable un tableau en lecture seule", () => {
    expectTypeOf<Mutable<readonly string[]>>().toEqualTypeOf<string[]>();
  });

  it("n'agit que sur le premier niveau", () => {
    type Nested = Mutable<{ readonly shelf: { readonly code: string } }>;
    expectTypeOf<Nested>().toEqualTypeOf<{ shelf: { readonly code: string } }>();
  });
});
