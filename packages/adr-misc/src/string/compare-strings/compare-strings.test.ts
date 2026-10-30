import { describe, expect, it } from "vitest";

import { compareStrings } from "./compare-strings";

describe("compareStrings", () => {
  it("trie dans l'ordre alphabétique français", () => {
    expect(["Zola", "balzac", "Hugo", "Éluard", "Camus"].sort(compareStrings)).toEqual([
      "balzac",
      "Camus",
      "Éluard",
      "Hugo",
      "Zola",
    ]);
  });

  it("ignore la casse et les accents", () => {
    expect(compareStrings("Élève", "eleve")).toBe(0);
    expect(compareStrings("ŒUVRE", "œuvre")).toBe(0);
    expect(compareStrings("ecole", "École")).toBe(0);
  });

  it("range les nombres dans l'ordre naturel", () => {
    expect(["Tome 10", "tome 2", "Tome 1"].sort(compareStrings)).toEqual([
      "Tome 1",
      "tome 2",
      "Tome 10",
    ]);
  });

  it("renvoie un nombre négatif ou positif selon l'ordre", () => {
    expect(compareStrings("a", "b")).toBeLessThan(0);
    expect(compareStrings("b", "a")).toBeGreaterThan(0);
    expect(compareStrings("", "")).toBe(0);
  });

  it("conserve l'ordre d'origine des textes équivalents (tri stable)", () => {
    expect(["été", "Ete", "ETE"].sort(compareStrings)).toEqual(["été", "Ete", "ETE"]);
  });

  it("accepte une autre locale", () => {
    expect(compareStrings("ä", "z", "sv-SE")).toBeGreaterThan(0);
    expect(compareStrings("ä", "z", "de-DE")).toBeLessThan(0);
  });
});
