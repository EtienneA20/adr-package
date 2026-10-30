import { describe, expect, it } from "vitest";

import { createSeededRandom } from "../create-seeded-random";
import { shuffle } from "./shuffle";

describe("shuffle", () => {
  it("conserve tous les éléments", () => {
    const items = [1, 2, 3, 4, 5];
    expect([...shuffle(items)].sort()).toEqual(items);
  });

  it("suit le générateur fourni", () => {
    expect(shuffle([1, 2, 3, 4], () => 0)).toEqual([1, 2, 3, 4]);
    expect(shuffle([1, 2, 3, 4], () => 0.99)).toEqual([4, 1, 2, 3]);
  });

  it("est reproductible avec un générateur déterministe", () => {
    const items = ["a", "b", "c", "d", "e", "f"];
    expect(shuffle(items, createSeededRandom(42))).toEqual(shuffle(items, createSeededRandom(42)));
  });

  it("ne modifie pas la liste et renvoie un nouveau tableau", () => {
    const items = [1, 2, 3];
    const shuffled = shuffle(items, () => 0.99);
    expect(items).toEqual([1, 2, 3]);
    expect(shuffled).not.toBe(items);
  });

  it("renvoie une liste vide pour une liste vide", () => {
    expect(shuffle([])).toEqual([]);
  });

  it("produit chaque permutation de façon à peu près équiprobable", () => {
    const random = createSeededRandom(7);
    const counts = new Map<string, number>();
    for (let index = 0; index < 6000; index += 1) {
      const key = shuffle([1, 2, 3], random).join("");
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    expect(counts.size).toBe(6);
    for (const count of counts.values()) {
      expect(count).toBeGreaterThan(850);
      expect(count).toBeLessThan(1150);
    }
  });
});
