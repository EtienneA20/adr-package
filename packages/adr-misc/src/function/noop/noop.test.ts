import { describe, expect, expectTypeOf, it } from "vitest";

import { noop } from "./noop";

describe("noop", () => {
  it("ne fait rien et ne lève aucune erreur", () => {
    expect(() => {
      noop();
    }).not.toThrow();
    expect(noop).toHaveLength(0);
  });

  it("peut remplacer un rappel qui reçoit des arguments", () => {
    const callback: (title: string, count: number) => void = noop;
    expect(() => {
      callback("Germinal", 2);
    }).not.toThrow();
    expectTypeOf(noop).returns.toBeVoid();
  });
});
