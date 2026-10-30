import { describe, expectTypeOf, it } from "vitest";

import type { RequiredBy } from "./required-by";

interface IMember {
  id: string;
  email?: string;
  phone?: string | undefined;
}

describe("RequiredBy", () => {
  it("rend obligatoires uniquement les clés indiquées", () => {
    expectTypeOf<RequiredBy<IMember, "email">>().toEqualTypeOf<{
      id: string;
      email: string;
      phone?: string | undefined;
    }>();
  });

  it("retire undefined du type des clés rendues obligatoires", () => {
    expectTypeOf<RequiredBy<IMember, "phone">["phone"]>().toEqualTypeOf<string>();
  });

  it("refuse un objet sans les clés rendues obligatoires", () => {
    expectTypeOf({ id: "m-1" }).not.toExtend<RequiredBy<IMember, "email">>();
  });
});
