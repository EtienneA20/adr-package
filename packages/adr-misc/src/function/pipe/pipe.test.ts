import { describe, expect, expectTypeOf, it, vi } from "vitest";

import { pipe } from "./pipe";

describe("pipe", () => {
  it("renvoie l'équivalent de la fonction seule", () => {
    const double = pipe((value: number) => value * 2);
    expect(double(4)).toBe(8);
  });

  it("applique les fonctions de gauche à droite", () => {
    const calls: string[] = [];
    const run = pipe(
      (value: string) => {
        calls.push("a");
        return `${value}a`;
      },
      (value) => {
        calls.push("b");
        return `${value}b`;
      },
    );

    expect(run(">")).toBe(">ab");
    expect(calls).toEqual(["a", "b"]);
  });

  it("transmet tous les arguments à la première fonction", () => {
    const first = vi.fn((memberId: string, year: number) => `${memberId}-${year}`);
    const run = pipe(first, (key) => key.length);

    expect(run("m1", 2026)).toBe(7);
    expect(first).toHaveBeenCalledWith("m1", 2026);
  });

  it("compose jusqu'à six fonctions en vérifiant les types", () => {
    const toSlug = pipe(
      (title: string) => title.trim(),
      (title) => title.toLowerCase(),
      (title) => title.normalize("NFD").replace(/\p{Diacritic}/gu, ""),
      (title) => title.split(/[^a-z0-9]+/),
      (words) => words.filter((word) => word !== ""),
      (words) => words.join("-"),
    );

    expect(toSlug("  Les Misérables ")).toBe("les-miserables");
    expectTypeOf(toSlug).toEqualTypeOf<(title: string) => string>();
  });

  it("compose trois, quatre et cinq fonctions", () => {
    const add = (value: number): number => value + 1;
    expect(pipe(add, add, add)(0)).toBe(3);
    expect(pipe(add, add, add, add)(0)).toBe(4);
    expect(pipe(add, add, add, add, String)(0)).toBe("4");
  });
});
