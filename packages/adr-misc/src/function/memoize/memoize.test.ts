import { describe, expect, expectTypeOf, it, vi } from "vitest";

import type { IMemoizedFunction } from "./memoize";
import { memoize } from "./memoize";

describe("memoize", () => {
  it("met en cache le résultat selon le premier argument", () => {
    const fn = vi.fn((id: string) => ({ id }));
    const getBook = memoize(fn);

    const first = getBook("b1");
    expect(getBook("b1")).toBe(first);
    expect(getBook("b2")).toEqual({ id: "b2" });
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("utilise resolveKey pour calculer la clé", () => {
    const fn = vi.fn((memberId: string, year: number) => `${memberId}-${year}`);
    const count = memoize(fn, { resolveKey: (memberId, year) => `${memberId}:${year}` });

    count("m1", 2025);
    count("m1", 2025);
    count("m1", 2026);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("ignore les arguments suivants avec la clé par défaut", () => {
    const fn = vi.fn((memberId: string, year: number) => `${memberId}-${year}`);
    const count = memoize(fn);

    expect(count("m1", 2025)).toBe("m1-2025");
    expect(count("m1", 2026)).toBe("m1-2025");
  });

  it("met en cache un résultat undefined", () => {
    const fn = vi.fn<(id: string) => undefined>(() => undefined);
    const find = memoize(fn);
    find("x");
    find("x");
    expect(fn).toHaveBeenCalledOnce();
  });

  it("supprime l'entrée utilisée le moins récemment au-delà de maxSize", () => {
    const fn = vi.fn((id: string) => id.toUpperCase());
    const format = memoize(fn, { maxSize: 2 });

    format("a");
    format("b");
    format("a"); // « a » devient la plus récente
    format("c"); // évince « b »
    expect(fn).toHaveBeenCalledTimes(3);

    format("a");
    format("c");
    expect(fn).toHaveBeenCalledTimes(3);
    format("b");
    expect(fn).toHaveBeenCalledTimes(4);
  });

  it("vide le cache avec clear()", () => {
    const fn = vi.fn((id: string) => id);
    const getBook = memoize(fn);

    getBook("b1");
    getBook.clear();
    getBook("b1");
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("ne met pas en cache une erreur levée", () => {
    const fn = vi
      .fn<(id: string) => string>()
      .mockImplementationOnce(() => {
        throw new Error("Échec");
      })
      .mockReturnValue("ok");
    const getBook = memoize(fn);

    expect(() => getBook("b1")).toThrow("Échec");
    expect(getBook("b1")).toBe("ok");
  });

  it.each([0, -1, 1.5, Number.NaN])("lève une RangeError pour maxSize = %d", (maxSize) => {
    expect(() => memoize((id: string) => id, { maxSize })).toThrow(RangeError);
  });

  it("indique la valeur reçue dans le message d'erreur", () => {
    expect(() => memoize((id: string) => id, { maxSize: 0 })).toThrow(
      "maxSize doit être un entier supérieur ou égal à 1 (reçu : 0).",
    );
  });

  it("conserve la signature de la fonction", () => {
    expectTypeOf(memoize((id: string) => id.length)).toEqualTypeOf<
      IMemoizedFunction<[id: string], number>
    >();
  });
});
