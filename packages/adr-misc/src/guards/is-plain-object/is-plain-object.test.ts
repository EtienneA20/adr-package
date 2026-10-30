import { describe, expect, expectTypeOf, it } from "vitest";

import { isPlainObject } from "./is-plain-object";

class Book {
  public title = "Dune";
}

describe("isPlainObject", () => {
  it.each([{}, { title: "Dune" }, Object.create(null), new Object()])(
    "accepte l'objet simple %o",
    (value) => {
      expect(isPlainObject(value)).toBe(true);
    },
  );

  it.each([
    new Book(),
    new Date(2026, 0, 15),
    new Map(),
    [],
    Object.create({ inherited: true }),
    null,
    undefined,
    "Dune",
    () => 1,
  ])("refuse %o", (value) => {
    expect(isPlainObject(value)).toBe(false);
  });

  it("accepte un objet dont le prototype vient d'un autre contexte d'exécution", () => {
    const foreignPrototype = Object.create(null) as object;
    const value: unknown = Object.create(foreignPrototype);
    expect(isPlainObject(value)).toBe(true);
  });

  it("affine une valeur unknown en objet indexable", () => {
    const value: unknown = { title: "Dune" };
    const title = isPlainObject(value) ? value.title : undefined;
    if (isPlainObject(value)) {
      expectTypeOf(value).toEqualTypeOf<Record<PropertyKey, unknown>>();
    }
    expect(title).toBe("Dune");
  });
});
