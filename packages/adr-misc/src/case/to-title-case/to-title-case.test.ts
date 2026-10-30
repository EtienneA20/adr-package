import { describe, expect, it } from "vitest";

import { toTitleCase } from "./to-title-case";

describe("toTitleCase", () => {
  it("met une majuscule au début de chaque mot", () => {
    expect(toTitleCase("le petit prince")).toBe("Le Petit Prince");
  });

  it("met le reste de chaque mot en minuscules", () => {
    expect(toTitleCase("LES MISÉRABLES")).toBe("Les Misérables");
  });

  it("conserve la ponctuation et les espaces d'origine", () => {
    expect(toTitleCase("  « madame bovary » ; tome 2  ")).toBe("  « Madame Bovary » ; Tome 2  ");
  });

  it("met une majuscule à chaque partie d'un mot composé", () => {
    expect(toTitleCase("jean-pierre dupont")).toBe("Jean-Pierre Dupont");
  });

  it("gère les accents et les ligatures", () => {
    expect(toTitleCase("œuvres complètes d’émile zola")).toBe("Œuvres Complètes D’Émile Zola");
  });

  it("met une majuscule après une élision mais pas dans un mot avec apostrophe", () => {
    expect(toTitleCase("l’île mystérieuse")).toBe("L’Île Mystérieuse");
    expect(toTitleCase("d'artagnan")).toBe("D'Artagnan");
    expect(toTitleCase("aujourd’hui et demain")).toBe("Aujourd’hui Et Demain");
    expect(toTitleCase("conseil des prud'hommes")).toBe("Conseil Des Prud'hommes");
  });

  it("laisse les petits mots français en minuscules avec lowercaseMinorWords", () => {
    const options = { lowercaseMinorWords: true };
    expect(toTitleCase("vingt mille lieues sous les mers", options)).toBe(
      "Vingt Mille Lieues sous les Mers",
    );
    expect(toTitleCase("le comte de monte-cristo", options)).toBe("Le Comte de Monte-Cristo");
    expect(toTitleCase("voyage au centre de l’île", options)).toBe("Voyage au Centre de l’Île");
    expect(toTitleCase("« la peste »", options)).toBe("« La Peste »");
  });

  it("accepte une liste personnalisée de petits mots", () => {
    expect(
      toTitleCase("the lord OF the rings", {
        lowercaseMinorWords: true,
        minorWords: ["OF", "the"],
      }),
    ).toBe("The Lord of the Rings");
  });

  it("ignore la liste de petits mots sans lowercaseMinorWords", () => {
    expect(toTitleCase("lord of the rings", { minorWords: ["of", "the"] })).toBe(
      "Lord Of The Rings",
    );
  });

  it("renvoie le texte tel quel s'il ne contient aucun mot", () => {
    expect(toTitleCase("")).toBe("");
    expect(toTitleCase(" — ")).toBe(" — ");
  });
});
