import { describe, expect, expectTypeOf, it } from "vitest";

import { EFilterOperator } from "./filter-operator";

describe("EFilterOperator", () => {
  it("contient les 13 opérateurs du contrat", () => {
    expect(Object.values(EFilterOperator)).toEqual([
      "eq",
      "ne",
      "gt",
      "gte",
      "lt",
      "lte",
      "between",
      "in",
      "nin",
      "contains",
      "startsWith",
      "endsWith",
      "isNull",
    ]);
  });

  it("expose le type union des valeurs", () => {
    expectTypeOf<EFilterOperator>().toEqualTypeOf<
      | "eq"
      | "ne"
      | "gt"
      | "gte"
      | "lt"
      | "lte"
      | "between"
      | "in"
      | "nin"
      | "contains"
      | "startsWith"
      | "endsWith"
      | "isNull"
    >();
  });
});
