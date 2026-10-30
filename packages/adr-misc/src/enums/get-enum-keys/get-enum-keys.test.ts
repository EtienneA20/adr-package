import { describe, expect, expectTypeOf, it } from "vitest";

import { getEnumKeys } from "./get-enum-keys";

const ELevel = { LOW: 1, MEDIUM: 2, HIGH: 3 } as const;

describe("getEnumKeys", () => {
  it("renvoie les clés dans l'ordre de déclaration", () => {
    expect(getEnumKeys(ELevel)).toEqual(["LOW", "MEDIUM", "HIGH"]);
  });

  it("renvoie un tableau vide pour un objet vide", () => {
    expect(getEnumKeys({})).toEqual([]);
  });

  it("type le résultat avec l'union des clés", () => {
    expectTypeOf(getEnumKeys(ELevel)).toEqualTypeOf<("LOW" | "MEDIUM" | "HIGH")[]>();
  });
});
