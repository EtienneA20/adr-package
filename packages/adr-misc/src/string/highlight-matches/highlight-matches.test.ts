import { describe, expect, it } from "vitest";

import { highlightMatches } from "./highlight-matches";

describe("highlightMatches", () => {
  it("marque le passage trouvé en conservant le texte d'origine", () => {
    expect(highlightMatches("Les Misérables", "mise")).toEqual([
      { text: "Les ", match: false },
      { text: "Misé", match: true },
      { text: "rables", match: false },
    ]);
  });

  it("marque toutes les occurrences de chaque mot de la requête", () => {
    expect(highlightMatches("Victor Hugo, Hugo Victor", "hugo vic")).toEqual([
      { text: "Vic", match: true },
      { text: "tor ", match: false },
      { text: "Hugo", match: true },
      { text: ", ", match: false },
      { text: "Hugo", match: true },
      { text: " ", match: false },
      { text: "Vic", match: true },
      { text: "tor", match: false },
    ]);
  });

  it("fusionne les passages qui se chevauchent ou se touchent", () => {
    expect(highlightMatches("abcdef", "abc cde f")).toEqual([{ text: "abcdef", match: true }]);
  });

  it("ignore la casse, les accents, les ligatures et les apostrophes typographiques", () => {
    expect(highlightMatches("L’Œuvre", "l'oeuvre")).toEqual([{ text: "L’Œuvre", match: true }]);
    expect(highlightMatches("cœur", "o")).toEqual([
      { text: "c", match: false },
      { text: "œ", match: true },
      { text: "ur", match: false },
    ]);
  });

  it("garde les accents combinants avec leur lettre (texte NFD)", () => {
    expect(highlightMatches("e\u0301te\u0301", "ete")).toEqual([
      { text: "e\u0301te\u0301", match: true },
    ]);
  });

  it("produit des segments dont la concaténation redonne le texte", () => {
    const text = "Vingt mille lieues sous les mers";
    const segments = highlightMatches(text, "mi le");
    expect(segments.map((segment) => segment.text).join("")).toBe(text);
    expect(segments.every((segment) => segment.text !== "")).toBe(true);
  });

  it("renvoie un seul segment non marqué si rien ne correspond ou si la requête est vide", () => {
    expect(highlightMatches("Le Horla", "zola")).toEqual([{ text: "Le Horla", match: false }]);
    expect(highlightMatches("Le Horla", "  ")).toEqual([{ text: "Le Horla", match: false }]);
  });

  it("renvoie un tableau vide pour un texte vide", () => {
    expect(highlightMatches("", "horla")).toEqual([]);
  });
});
