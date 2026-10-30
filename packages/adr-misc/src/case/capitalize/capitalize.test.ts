import { describe, expect, it } from "vitest";

import { capitalize } from "./capitalize";

describe("capitalize", () => {
  it("met la première lettre en majuscule sans toucher au reste", () => {
    expect(capitalize("bonjour le MONDE")).toBe("Bonjour le MONDE");
  });

  it("gère les lettres accentuées et les ligatures", () => {
    expect(capitalize("élodie")).toBe("Élodie");
    expect(capitalize("œuvres complètes")).toBe("Œuvres complètes");
    expect(capitalize("æthelstan")).toBe("Æthelstan");
  });

  it("ignore la ponctuation et les espaces de tête", () => {
    expect(capitalize("« bonjour »")).toBe("« Bonjour »");
    expect(capitalize("  ¿qué?")).toBe("  ¿Qué?");
  });

  it("ne change rien quand le texte commence par un chiffre", () => {
    expect(capitalize("1er janvier")).toBe("1er janvier");
  });

  it("met le reste en minuscules avec l'option lowerRest", () => {
    expect(capitalize("DUPONT", { lowerRest: true })).toBe("Dupont");
    expect(capitalize("« ÉCOLE »", { lowerRest: true })).toBe("« École »");
  });

  it("renvoie le texte tel quel s'il ne contient aucune lettre ni chiffre", () => {
    expect(capitalize("")).toBe("");
    expect(capitalize(" … ")).toBe(" … ");
    expect(capitalize("", { lowerRest: true })).toBe("");
  });
});
