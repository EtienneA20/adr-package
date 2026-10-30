import { describe, expect, expectTypeOf, it } from "vitest";

import { getEnumValues } from "./get-enum-values";

const EColor = { RED: "red", GREEN: "green" } as const;
const ELevel = { LOW: 1, HIGH: 3 } as const;

describe("getEnumValues", () => {
  it("renvoie les valeurs dans l'ordre de déclaration", () => {
    expect(getEnumValues(EColor)).toEqual(["red", "green"]);
    expect(getEnumValues(ELevel)).toEqual([1, 3]);
  });

  it("renvoie un nouveau tableau à chaque appel", () => {
    expect(getEnumValues(EColor)).not.toBe(getEnumValues(EColor));
  });

  it("renvoie un tableau vide pour un objet vide", () => {
    expect(getEnumValues({})).toEqual([]);
  });

  it("type le résultat avec l'union des valeurs", () => {
    expectTypeOf(getEnumValues(EColor)).toEqualTypeOf<("red" | "green")[]>();
  });
});
