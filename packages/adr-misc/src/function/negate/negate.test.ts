import { describe, expect, expectTypeOf, it, vi } from "vitest";

import { negate } from "./negate";

describe("negate", () => {
  it("inverse le résultat du prédicat", () => {
    const isEven = (value: number): boolean => value % 2 === 0;
    expect([1, 2, 3, 4].filter(negate(isEven))).toEqual([1, 3]);
  });

  it("transmet tous les arguments au prédicat", () => {
    const predicate = vi.fn((value: number, index: number) => value > index);
    const inverted = negate(predicate);

    expect(inverted(1, 2)).toBe(true);
    expect(inverted(3, 2)).toBe(false);
    expect(predicate).toHaveBeenLastCalledWith(3, 2);
  });

  it("conserve la signature du prédicat", () => {
    expectTypeOf(negate((title: string) => title === "")).toEqualTypeOf<
      (title: string) => boolean
    >();
  });
});
