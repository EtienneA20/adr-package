import { describe, expect, it } from "vitest";

import { matchesSearch } from "./matches-search";

describe("matchesSearch", () => {
  it("trouve un texte contenant tous les mots de la requête, dans n'importe quel ordre", () => {
    expect(matchesSearch("Les Misérables, Victor Hugo", "hugo miserables")).toBe(true);
  });

  it("trouve des mots partiels", () => {
    expect(matchesSearch("Victor Hugo", "hug vic")).toBe(true);
  });

  it("échoue si un seul mot de la requête manque", () => {
    expect(matchesSearch("Le Petit Prince", "petit roi")).toBe(false);
  });

  it("ignore la casse, les accents et les ligatures", () => {
    expect(matchesSearch("L’Œuvre au noir", "OEUVRE")).toBe(true);
    expect(matchesSearch("Les Misérables", "MISÉRABLES")).toBe(true);
    expect(matchesSearch("Ecole", "école")).toBe(true);
  });

  it("ignore les types d'apostrophes et d'espaces", () => {
    expect(matchesSearch("L’Île mystérieuse", "l'ile")).toBe(true);
    expect(matchesSearch("1\u202f500\u00a0livres", "1 500")).toBe(true);
  });

  it("correspond à tout pour une requête vide ou blanche", () => {
    expect(matchesSearch("Le Horla", "")).toBe(true);
    expect(matchesSearch("Le Horla", "  \t ")).toBe(true);
    expect(matchesSearch("", "")).toBe(true);
  });

  it("ne trouve rien dans un texte vide pour une requête non vide", () => {
    expect(matchesSearch("", "horla")).toBe(false);
  });
});
