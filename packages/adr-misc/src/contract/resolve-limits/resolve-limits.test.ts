import { describe, expect, it } from "vitest";

import { DEFAULT_LIST_QUERY_LIMITS } from "../list-query-limits";
import { resolveLimits } from "./resolve-limits";

describe("resolveLimits", () => {
  it("renvoie les limites par défaut sans surcharge", () => {
    expect(resolveLimits()).toEqual(DEFAULT_LIST_QUERY_LIMITS);
  });

  it("applique une surcharge partielle", () => {
    const limits = resolveLimits({ maxDepth: 4, maxConditions: 50 });
    expect(limits.maxDepth).toBe(4);
    expect(limits.maxConditions).toBe(50);
    expect(limits.maxPageSize).toBe(100);
  });

  it("renvoie un objet figé", () => {
    expect(Object.isFrozen(resolveLimits({ maxDepth: 2 }))).toBe(true);
  });

  it.each([0, -1, 2.5, Number.NaN, Number.POSITIVE_INFINITY])("refuse la limite %j", (value) => {
    expect(() => resolveLimits({ maxPageSize: value })).toThrow(
      new RangeError(
        `La limite « maxPageSize » doit être un entier strictement positif (reçu : ${String(value)}).`,
      ),
    );
  });
});
