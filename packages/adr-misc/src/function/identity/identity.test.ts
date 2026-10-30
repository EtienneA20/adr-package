import { describe, expect, expectTypeOf, it } from "vitest";

import { identity } from "./identity";

describe("identity", () => {
  it.each([0, "", null, undefined, "Germinal", 42])("renvoie la valeur %j", (value) => {
    expect(identity(value)).toBe(value);
  });

  it("renvoie la même référence pour un objet", () => {
    const book = { title: "Germinal" };
    expect(identity(book)).toBe(book);
  });

  it("conserve le type de la valeur", () => {
    expectTypeOf(identity("a" as const)).toEqualTypeOf<"a">();
    expect(["a", "b"].map(identity)).toEqual(["a", "b"]);
  });
});
