import { describe, expect, it } from "vitest";

import { countWords } from "./count-words";

describe("countWords", () => {
  it("compte les mots séparés par des espaces", () => {
    expect(countWords("Le Petit Prince")).toBe(3);
    expect(countWords("  Le   Petit\tPrince\n")).toBe(3);
  });

  it("ne compte pas la ponctuation isolée", () => {
    expect(countWords("« Bonjour », dit-il — l’air las.")).toBe(4);
    expect(countWords("Titre : sous-titre !")).toBe(2);
  });

  it("compte un mot composé ou élidé pour un", () => {
    expect(countWords("Jean-Pierre aujourd’hui l’école")).toBe(3);
  });

  it("compte les nombres et sépare sur les espaces insécables", () => {
    expect(countWords("Tome\u00a02 sur\u202f10")).toBe(4);
  });

  it("renvoie 0 pour un texte vide ou blanc", () => {
    expect(countWords("")).toBe(0);
    expect(countWords(" \n\t ")).toBe(0);
    expect(countWords(" — … ")).toBe(0);
  });
});
