import { describe, expectTypeOf, it } from "vitest";

import type { Brand } from "./brand";

type BookId = Brand<string, "BookId">;
type MemberId = Brand<string, "MemberId">;

describe("Brand", () => {
  it("rend deux marques de même type sous-jacent incompatibles", () => {
    expectTypeOf<MemberId>().not.toExtend<BookId>();
    expectTypeOf<BookId>().not.toExtend<MemberId>();
  });

  it("refuse la valeur brute non marquée", () => {
    expectTypeOf<string>().not.toExtend<BookId>();
  });

  it("reste utilisable comme le type sous-jacent", () => {
    expectTypeOf<BookId>().toExtend<string>();
    expectTypeOf<Brand<number, "Cents">>().toExtend<number>();
  });
});
