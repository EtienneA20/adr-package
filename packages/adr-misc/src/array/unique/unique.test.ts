import { describe, expect, it } from "vitest";

import { unique } from "./unique";

describe("unique", () => {
  it("retire les doublons en gardant l'ordre des premières occurrences", () => {
    expect(unique([3, 1, 3, 2, 1])).toEqual([3, 1, 2]);
  });

  it("dédoublonne NaN", () => {
    expect(unique([Number.NaN, Number.NaN])).toEqual([Number.NaN]);
  });

  it("conserve les objets distincts de même contenu", () => {
    expect(unique([{ id: 1 }, { id: 1 }])).toHaveLength(2);
  });

  it("renvoie un tableau vide pour un tableau vide", () => {
    expect(unique([])).toEqual([]);
  });

  it("renvoie une nouvelle instance", () => {
    const items = Object.freeze([1, 2]);
    expect(unique(items)).not.toBe(items);
  });
});
