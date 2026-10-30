import { describe, expect, expectTypeOf, it } from "vitest";

import { EHttpMethod } from "./http-method";

describe("EHttpMethod", () => {
  it("utilise le nom de la méthode en majuscules comme valeur", () => {
    for (const [key, value] of Object.entries(EHttpMethod)) {
      expect(value).toBe(key);
    }
    expect(Object.keys(EHttpMethod)).toEqual([
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "HEAD",
      "OPTIONS",
    ]);
  });

  it("expose le type union des valeurs", () => {
    expectTypeOf<EHttpMethod>().toEqualTypeOf<
      "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS"
    >();
  });
});
