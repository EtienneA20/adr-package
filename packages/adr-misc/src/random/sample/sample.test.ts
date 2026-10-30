import { describe, expect, it } from "vitest";

import { createSeededRandom } from "../create-seeded-random";
import { sample } from "./sample";

const titles = ["Germinal", "Nana", "L'Assommoir", "Au Bonheur des Dames"];

describe("sample", () => {
  it("tire le nombre d'éléments demandé, sans doublon", () => {
    const picked = sample(titles, 3, createSeededRandom(1));
    expect(picked).toHaveLength(3);
    expect(new Set(picked).size).toBe(3);
    for (const title of picked) {
      expect(titles).toContain(title);
    }
  });

  it("suit le générateur fourni", () => {
    // 0 : chaque position garde l'élément courant ; 0.99 : prend le dernier restant.
    expect(sample(titles, 2, () => 0)).toEqual(["Germinal", "Nana"]);
    expect(sample(titles, 2, () => 0.99)).toEqual(["Au Bonheur des Dames", "Germinal"]);
  });

  it("est reproductible avec un générateur déterministe", () => {
    expect(sample(titles, 2, createSeededRandom("démo"))).toEqual(
      sample(titles, 2, createSeededRandom("démo")),
    );
  });

  it("renvoie tous les éléments si count dépasse la taille de la liste", () => {
    const picked = sample(titles, 10);
    expect([...picked].sort()).toEqual([...titles].sort());
  });

  it("renvoie une liste vide pour count = 0 ou une liste vide", () => {
    expect(sample(titles, 0)).toEqual([]);
    expect(sample([], 3)).toEqual([]);
  });

  it("ne modifie pas la liste", () => {
    const copy = [...titles];
    sample(titles, 4, () => 0.99);
    expect(titles).toEqual(copy);
  });

  it.each([-1, 1.5, Number.NaN])("lève une RangeError pour count = %d", (count) => {
    expect(() => sample(titles, count)).toThrow(RangeError);
  });
});
