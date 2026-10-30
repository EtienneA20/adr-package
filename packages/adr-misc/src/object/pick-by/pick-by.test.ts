import { describe, expect, expectTypeOf, it } from "vitest";

import { pickBy } from "./pick-by";

describe("pickBy", () => {
  it("conserve les propriétés qui vérifient le prédicat", () => {
    expect(pickBy({ title: "Germinal", author: "", year: 1885 }, (value) => value !== "")).toEqual({
      title: "Germinal",
      year: 1885,
    });
  });

  it("transmet la clé au prédicat", () => {
    expect(pickBy({ a: 1, b: 2 }, (_, key) => key === "b")).toEqual({ b: 2 });
  });

  it("renvoie un objet vide si rien ne correspond", () => {
    expect(pickBy({ a: 1 }, () => false)).toEqual({});
  });

  it("ne modifie pas l'objet d'origine", () => {
    const frozen = Object.freeze({ a: 1, b: 2 });
    pickBy(frozen, (value) => value > 1);
    expect(frozen).toEqual({ a: 1, b: 2 });
  });

  it("type le résultat comme partiel", () => {
    expectTypeOf(pickBy({ a: 1, b: "x" }, () => true)).toEqualTypeOf<
      Partial<{ a: number; b: string }>
    >();
  });
});
