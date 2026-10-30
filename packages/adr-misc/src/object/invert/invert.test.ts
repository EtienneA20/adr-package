import { describe, expect, expectTypeOf, it } from "vitest";

import { invert } from "./invert";

describe("invert", () => {
  it("inverse les clés et les valeurs", () => {
    expect(invert({ ONGOING: "ongoing", RETURNED: "returned" })).toEqual({
      ongoing: "ONGOING",
      returned: "RETURNED",
    });
  });

  it("convertit les valeurs numériques en clés", () => {
    expect(invert({ MONDAY: 1, TUESDAY: 2 })).toEqual({ 1: "MONDAY", 2: "TUESDAY" });
  });

  it("garde la dernière clé en cas de valeur en double", () => {
    expect(invert({ a: "x", b: "x" })).toEqual({ x: "b" });
  });

  it("renvoie un objet vide pour un objet vide", () => {
    expect(invert({})).toEqual({});
  });

  it("type exactement le résultat d'un objet as const", () => {
    const EStatus = { ONGOING: "ongoing", LATE: 2 } as const;
    expectTypeOf(invert(EStatus)).toEqualTypeOf<{ ongoing: "ONGOING"; 2: "LATE" }>();
  });
});
