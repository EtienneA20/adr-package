import { describe, expect, expectTypeOf, it } from "vitest";

import { omitBy } from "./omit-by";

describe("omitBy", () => {
  it("retire les propriétés qui vérifient le prédicat", () => {
    expect(
      omitBy({ title: "Germinal", author: null, year: 1885 }, (value) => value === null),
    ).toEqual({ title: "Germinal", year: 1885 });
  });

  it("transmet la clé au prédicat", () => {
    expect(omitBy({ a: 1, b: 2 }, (_, key) => key === "a")).toEqual({ b: 2 });
  });

  it("renvoie une copie complète si rien ne correspond", () => {
    const source = { a: 1 };
    const result = omitBy(source, () => false);
    expect(result).toEqual(source);
    expect(result).not.toBe(source);
  });

  it("type le résultat comme partiel", () => {
    expectTypeOf(omitBy({ a: 1 }, () => true)).toEqualTypeOf<Partial<{ a: number }>>();
  });
});
