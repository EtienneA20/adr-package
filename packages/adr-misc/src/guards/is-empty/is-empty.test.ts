import { describe, expect, expectTypeOf, it } from "vitest";

import { isEmpty } from "./is-empty";

describe("isEmpty", () => {
  it.each([null, undefined, "", [], {}, Object.create(null), new Map(), new Set()])(
    "considère %o comme vide",
    (value) => {
      expect(isEmpty(value)).toBe(true);
    },
  );

  it.each([
    " ",
    "Dune",
    [0],
    { title: "Dune" },
    new Map([["id", 1]]),
    new Set([1]),
    0,
    false,
    Number.NaN,
    new Date(2026, 0, 15),
    () => 1,
  ])("considère %o comme non vide", (value) => {
    expect(isEmpty(value)).toBe(false);
  });

  it("ignore les clés symboles et non énumérables d'un objet simple", () => {
    const value = Object.defineProperty({ [Symbol("id")]: 1 }, "hidden", { value: 1 });
    expect(isEmpty(value)).toBe(true);
  });

  it("renvoie un booléen sans affiner le type", () => {
    expectTypeOf(isEmpty).returns.toEqualTypeOf<boolean>();
    expect(isEmpty([])).toBe(true);
  });
});
