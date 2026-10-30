import { describe, expect, it } from "vitest";

import { foldText, foldTextWithOffsets } from "./fold-for-search";

describe("foldText", () => {
  it("met en minuscules, retire les accents et décompose les ligatures", () => {
    expect(foldText("L’Œuvre d’Émile")).toBe("l'oeuvre d'emile");
  });

  it("remplace toute espace par une espace simple, sans fusionner", () => {
    expect(foldText("1\u202f500\u00a0€\t!")).toBe("1 500 € !");
  });

  it("replie le İ turc en i", () => {
    expect(foldText("İstanbul")).toBe("istanbul");
  });
});

describe("foldTextWithOffsets", () => {
  it("associe chaque caractère replié à sa position d'origine", () => {
    expect(foldTextWithOffsets("Été")).toEqual({
      value: "ete",
      starts: [0, 1, 2],
      ends: [1, 2, 3],
    });
  });

  it("fait pointer les deux lettres d'une ligature vers le même caractère", () => {
    expect(foldTextWithOffsets("cœur")).toEqual({
      value: "coeur",
      starts: [0, 1, 1, 2, 3],
      ends: [1, 2, 2, 3, 4],
    });
  });

  it("regroupe une lettre et ses accents combinants (texte NFD)", () => {
    expect(foldTextWithOffsets("e\u0301t")).toEqual({
      value: "et",
      starts: [0, 2],
      ends: [2, 3],
    });
  });

  it("ignore un accent combinant isolé en tête de texte", () => {
    expect(foldTextWithOffsets("\u0301a")).toEqual({ value: "a", starts: [1], ends: [2] });
  });

  it("renvoie un texte vide pour une chaîne vide", () => {
    expect(foldTextWithOffsets("")).toEqual({ value: "", starts: [], ends: [] });
  });
});
