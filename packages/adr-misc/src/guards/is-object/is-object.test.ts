import { describe, expect, expectTypeOf, it } from "vitest";

import { isObject } from "./is-object";

describe("isObject", () => {
  it.each([{}, { title: "Dune" }, Object.create(null), new Date(2026, 0, 15), new Map()])(
    "accepte l'objet %o",
    (value) => {
      expect(isObject(value)).toBe(true);
    },
  );

  it.each([null, undefined, [], ["Dune"], "Dune", 1, () => 1])("refuse %o", (value) => {
    expect(isObject(value)).toBe(false);
  });

  it("affine une valeur unknown en objet indexable", () => {
    const value: unknown = { title: "Dune" };
    const title = isObject(value) ? value.title : undefined;
    if (isObject(value)) {
      expectTypeOf(value).toEqualTypeOf<Record<PropertyKey, unknown>>();
    }
    expect(title).toBe("Dune");
  });
});
