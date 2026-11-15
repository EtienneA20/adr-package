import { describe, expect, expectTypeOf, it } from "vitest";

import { EApiErrorCode } from "./api-error-code";

describe("EApiErrorCode", () => {
  it("associe chaque clé à une valeur identique", () => {
    for (const [key, value] of Object.entries(EApiErrorCode)) {
      expect(value).toBe(key);
    }
  });

  it("contient les codes utilisés par les packages", () => {
    expect(Object.keys(EApiErrorCode)).toEqual([
      "BAD_REQUEST",
      "VALIDATION_FAILED",
      "INVALID_QUERY",
      "QUERY_LIMIT_EXCEEDED",
      "UNAUTHENTICATED",
      "FORBIDDEN",
      "NOT_FOUND",
      "CONFLICT",
      "EXPORT_LIMIT_EXCEEDED",
      "INTERNAL_ERROR",
    ]);
  });

  it("expose le type union des valeurs", () => {
    expectTypeOf<EApiErrorCode>().toExtend<string>();
    expectTypeOf<"FORBIDDEN">().toExtend<EApiErrorCode>();
  });
});
