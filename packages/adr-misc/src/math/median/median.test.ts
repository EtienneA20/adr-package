import { describe, expect, it } from "vitest";

import { median } from "./median";

describe("median", () => {
  it("renvoie la valeur centrale pour une taille impaire", () => {
    expect(median([3, 1, 2])).toBe(2);
  });

  it("renvoie la moyenne des deux valeurs centrales pour une taille paire", () => {
    expect(median([10, 2, 4, 6])).toBe(5);
  });

  it("trie numériquement et non alphabétiquement", () => {
    expect(median([100, 9, 20])).toBe(20);
  });

  it("renvoie la valeur pour une liste d'un élément", () => {
    expect(median([42])).toBe(42);
  });

  it("renvoie NaN pour une liste vide", () => {
    expect(median([])).toBeNaN();
  });

  it("ne modifie pas la liste", () => {
    const values = [3, 1, 2];
    median(values);
    expect(values).toEqual([3, 1, 2]);
  });
});
