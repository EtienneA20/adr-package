import { describe, expectTypeOf, it } from "vitest";

import type { ValueOf } from "./value-of";

interface ILoanStatus {
  readonly BORROWED: "borrowed";
  readonly RETURNED: "returned";
}

describe("ValueOf", () => {
  it("renvoie l'union des valeurs d'un objet as const", () => {
    expectTypeOf<ValueOf<ILoanStatus>>().toEqualTypeOf<"borrowed" | "returned">();
  });

  it("renvoie l'union des types des valeurs d'une interface", () => {
    expectTypeOf<ValueOf<{ title: string; pages: number }>>().toEqualTypeOf<string | number>();
  });

  it("renvoie le type des éléments d'un tableau ou d'un tuple", () => {
    expectTypeOf<ValueOf<string[]>>().toEqualTypeOf<string>();
    expectTypeOf<ValueOf<readonly ["Dune", 42]>>().toEqualTypeOf<"Dune" | 42>();
  });

  it("renvoie never pour un tuple vide", () => {
    expectTypeOf<ValueOf<[]>>().toBeNever();
  });
});
