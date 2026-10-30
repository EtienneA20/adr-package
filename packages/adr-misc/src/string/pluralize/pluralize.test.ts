import { describe, expect, it } from "vitest";

import { pluralize } from "./pluralize";

describe("pluralize", () => {
  it.each([0, 1, 1.5, -1, 0.25])("garde le singulier pour %s (règle française)", (count) => {
    expect(pluralize(count, "livre")).toBe("livre");
  });

  it.each([2, 3, 1000, -2, Number.POSITIVE_INFINITY])("met au pluriel pour %s", (count) => {
    expect(pluralize(count, "livre")).toBe("livres");
  });

  it.each([
    ["prix", "prix"],
    ["nez", "nez"],
    ["bus", "bus"],
    ["bateau", "bateaux"],
    ["tuyau", "tuyaux"],
    ["jeu", "jeux"],
    ["pneu", "pneus"],
    ["landau", "landaus"],
    ["Bleu", "Bleus"],
    ["bijou", "bijoux"],
    ["Genou", "Genoux"],
    ["trou", "trous"],
    ["œuvre", "œuvres"],
  ])("déduit le pluriel régulier de « %s » : « %s »", (singular, expected) => {
    expect(pluralize(2, singular)).toBe(expected);
  });

  it("met le suffixe en majuscules pour un mot en majuscules", () => {
    expect(pluralize(2, "LIVRE")).toBe("LIVRES");
    expect(pluralize(2, "BATEAU")).toBe("BATEAUX");
  });

  it("utilise la forme plurielle fournie", () => {
    expect(pluralize(2, "cheval", "chevaux")).toBe("chevaux");
    expect(pluralize(1, "cheval", "chevaux")).toBe("cheval");
    expect(pluralize(3, "livre emprunté", { plural: "livres empruntés" })).toBe("livres empruntés");
  });

  it("inclut le nombre formaté en français, suivi d'une espace insécable", () => {
    expect(pluralize(3, "livre", { includeCount: true })).toBe("3\u00a0livres");
    expect(pluralize(0, "retard", { includeCount: true })).toBe("0\u00a0retard");
    expect(pluralize(1500, "livre", { includeCount: true })).toBe("1\u202f500\u00a0livres");
    expect(pluralize(1.5, "kilo", { includeCount: true })).toBe("1,5\u00a0kilo");
    expect(pluralize(2, "cheval", { plural: "chevaux", includeCount: true })).toBe(
      "2\u00a0chevaux",
    );
  });

  it("formate le nombre selon la locale fournie", () => {
    expect(pluralize(1500, "book", { includeCount: true, locale: "en-US" })).toBe(
      "1,500\u00a0books",
    );
  });

  it("lève une RangeError si le nombre vaut NaN", () => {
    expect(() => pluralize(Number.NaN, "livre")).toThrow(
      new RangeError("Le nombre utilisé pour accorder le mot doit être un nombre valide."),
    );
  });
});
