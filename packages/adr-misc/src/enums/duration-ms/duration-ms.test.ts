import { describe, expect, expectTypeOf, it } from "vitest";

import { EDurationMs } from "./duration-ms";

describe("EDurationMs", () => {
  it("exprime chaque durée en millisecondes", () => {
    expect(EDurationMs.SECOND).toBe(1000);
    expect(EDurationMs.MINUTE).toBe(60 * EDurationMs.SECOND);
    expect(EDurationMs.HOUR).toBe(60 * EDurationMs.MINUTE);
    expect(EDurationMs.DAY).toBe(24 * EDurationMs.HOUR);
    expect(EDurationMs.WEEK).toBe(7 * EDurationMs.DAY);
  });

  it("expose des types littéraux", () => {
    expectTypeOf(EDurationMs.MINUTE).toEqualTypeOf<60_000>();
    expectTypeOf<EDurationMs>().toExtend<number>();
  });
});
