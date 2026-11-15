import { describe, expect, it } from "vitest";

import { DEFAULT_LIST_QUERY_LIMITS } from "./list-query-limits";

describe("DEFAULT_LIST_QUERY_LIMITS", () => {
  it("fixe les limites par défaut du contrat", () => {
    expect(DEFAULT_LIST_QUERY_LIMITS).toEqual({
      maxDepth: 3,
      maxConditions: 20,
      maxInValues: 100,
      maxStringLength: 255,
      maxPageSize: 100,
      maxSortFields: 3,
      maxSearchLength: 100,
      maxParamLength: 4096,
    });
  });

  it("est figé", () => {
    expect(Object.isFrozen(DEFAULT_LIST_QUERY_LIMITS)).toBe(true);
  });
});
