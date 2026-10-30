import { describe, expect, it } from "vitest";

import { slugify } from "./slugify";

describe("slugify", () => {
  it("produit un slug en minuscules, sans accents, avec des tirets", () => {
    expect(slugify("L’Île mystérieuse : tome 2")).toBe("l-ile-mysterieuse-tome-2");
  });

  it("décompose les ligatures", () => {
    expect(slugify("Œuvres complètes, ex æquo")).toBe("oeuvres-completes-ex-aequo");
  });

  it("fusionne les séparateurs et supprime ceux de tête et de fin", () => {
    expect(slugify("  --« Bonjour »\u00a0!!  le   monde__ ")).toBe("bonjour-le-monde");
  });

  it("accepte un séparateur personnalisé", () => {
    expect(slugify("Le Petit Prince", { separator: "_" })).toBe("le_petit_prince");
    expect(slugify("Le Petit Prince", { separator: "" })).toBe("lepetitprince");
  });

  it("conserve la casse avec lowercase à false", () => {
    expect(slugify("Rapport Annuel 2026", { lowercase: false })).toBe("Rapport-Annuel-2026");
  });

  it("supprime les caractères non latins et peut renvoyer une chaîne vide", () => {
    expect(slugify("Война и мир 1869")).toBe("1869");
    expect(slugify("你好")).toBe("");
    expect(slugify("")).toBe("");
  });
});
