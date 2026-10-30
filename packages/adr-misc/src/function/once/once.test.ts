import { describe, expect, expectTypeOf, it, vi } from "vitest";

import { once } from "./once";

describe("once", () => {
  it("n'exécute la fonction qu'une seule fois", () => {
    const fn = vi.fn((title: string) => title.toUpperCase());
    const format = once(fn);

    expect(format("germinal")).toBe("GERMINAL");
    expect(format("nana")).toBe("GERMINAL");
    expect(fn).toHaveBeenCalledExactlyOnceWith("germinal");
  });

  it("mémorise un résultat undefined", () => {
    const fn = vi.fn(() => undefined);
    const run = once(fn);
    run();
    run();
    expect(fn).toHaveBeenCalledOnce();
  });

  it("réessaie au prochain appel si la fonction lève une erreur", () => {
    const fn = vi
      .fn<() => number>()
      .mockImplementationOnce(() => {
        throw new Error("Échec");
      })
      .mockReturnValue(1);
    const run = once(fn);

    expect(run).toThrow("Échec");
    expect(run()).toBe(1);
    expect(run()).toBe(1);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("conserve la signature de la fonction", () => {
    expectTypeOf(once((id: string, count: number) => id.repeat(count))).toEqualTypeOf<
      (id: string, count: number) => string
    >();
  });
});
