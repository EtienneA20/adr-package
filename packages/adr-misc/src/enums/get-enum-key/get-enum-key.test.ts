import { describe, expect, expectTypeOf, it } from "vitest";

import { getEnumKey } from "./get-enum-key";

const EStatus = { OK: 200, NOT_FOUND: 404 } as const;
const EAlias = { FIRST: "a", SECOND: "a" } as const;

describe("getEnumKey", () => {
  it("renvoie la clé qui porte la valeur", () => {
    expect(getEnumKey(EStatus, 404)).toBe("NOT_FOUND");
  });

  it("renvoie undefined pour une valeur absente ou d'un autre type", () => {
    expect(getEnumKey(EStatus, 418)).toBeUndefined();
    expect(getEnumKey(EStatus, "200")).toBeUndefined();
  });

  it("renvoie la première clé déclarée quand plusieurs clés portent la valeur", () => {
    expect(getEnumKey(EAlias, "a")).toBe("FIRST");
  });

  it("type le résultat avec l'union des clés", () => {
    expectTypeOf(getEnumKey(EStatus, 200)).toEqualTypeOf<"OK" | "NOT_FOUND" | undefined>();
  });
});
