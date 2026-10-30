import { describe, expect, expectTypeOf, it } from "vitest";

import { safeJsonParse } from "./safe-json-parse";

describe("safeJsonParse", () => {
  it("analyse un JSON valide", () => {
    expect(safeJsonParse('{"id": 1, "tags": ["a"]}')).toEqual({ id: 1, tags: ["a"] });
    expect(safeJsonParse("42")).toBe(42);
    expect(safeJsonParse('"texte"')).toBe("texte");
  });

  it("renvoie undefined pour un JSON invalide sans valeur de repli", () => {
    expect(safeJsonParse("{invalide")).toBeUndefined();
    expect(safeJsonParse("")).toBeUndefined();
  });

  it("renvoie la valeur de repli pour un JSON invalide ou absent", () => {
    expect(safeJsonParse("{invalide", { theme: "clair" })).toEqual({ theme: "clair" });
    expect(safeJsonParse(null, [])).toEqual([]);
    expect(safeJsonParse(undefined, 0)).toBe(0);
  });

  it("renvoie null pour le JSON « null », même avec une valeur de repli", () => {
    expect(safeJsonParse("null", [])).toBeNull();
  });

  it("type le résultat avec le générique ou la valeur de repli", () => {
    expectTypeOf(safeJsonParse<{ id: number }>('{"id":1}')).toEqualTypeOf<
      { id: number } | undefined
    >();
    expectTypeOf(safeJsonParse("[]", [] as string[])).toEqualTypeOf<string[] | undefined>();
  });
});
