import { describe, expect, expectTypeOf, it } from "vitest";

import { isPromiseLike } from "./is-promise-like";

describe("isPromiseLike", () => {
  it("accepte une promesse native", () => {
    expect(isPromiseLike(Promise.resolve(1))).toBe(true);
  });

  it("accepte un objet ou une fonction « thenable »", () => {
    const thenable: unknown = {
      then: (resolve: (value: number) => void) => {
        resolve(1);
      },
    };
    const thenableFunction: unknown = Object.assign(() => 1, { then: () => undefined });
    expect(isPromiseLike(thenable)).toBe(true);
    expect(isPromiseLike(thenableFunction)).toBe(true);
  });

  it.each([null, undefined, 1, "then", {}, { then: 1 }, () => 1])("refuse %o", (value) => {
    expect(isPromiseLike(value)).toBe(false);
  });

  it("distingue une valeur synchrone d'une promesse dans une union", async () => {
    const load = (async: boolean): string[] | Promise<string[]> =>
      async ? Promise.resolve(["Dune"]) : ["Fondation"];
    const results: string[][] = [];
    for (const result of [load(true), load(false)]) {
      if (isPromiseLike(result)) {
        expectTypeOf(result).toEqualTypeOf<Promise<string[]>>();
        results.push(await result);
      } else {
        expectTypeOf(result).toEqualTypeOf<string[]>();
        results.push(result);
      }
    }
    expect(results).toEqual([["Dune"], ["Fondation"]]);
  });

  it("affine une valeur unknown en PromiseLike<unknown>", () => {
    const value: unknown = Promise.resolve(1);
    if (isPromiseLike(value)) {
      expectTypeOf(value).toEqualTypeOf<PromiseLike<unknown>>();
    }
    expect(isPromiseLike(value)).toBe(true);
  });
});
