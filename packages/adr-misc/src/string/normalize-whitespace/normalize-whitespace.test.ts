import { describe, expect, it } from "vitest";

import { normalizeWhitespace } from "./normalize-whitespace";

describe("normalizeWhitespace", () => {
  it("remplace les espaces multiples, tabulations et retours à la ligne par une espace", () => {
    expect(normalizeWhitespace("Le   Petit\tPrince\r\nde\n\nSaint-Exupéry")).toBe(
      "Le Petit Prince de Saint-Exupéry",
    );
  });

  it("remplace les espaces insécables et fines insécables", () => {
    expect(normalizeWhitespace("1\u202f500\u00a0€ «\u00a0Bonjour\u00a0»")).toBe(
      "1 500 € « Bonjour »",
    );
  });

  it("supprime les espaces de tête et de fin", () => {
    expect(normalizeWhitespace(" \t Bonjour \u00a0")).toBe("Bonjour");
  });

  it("renvoie une chaîne vide pour un texte vide ou blanc", () => {
    expect(normalizeWhitespace("")).toBe("");
    expect(normalizeWhitespace(" \n\t\u00a0")).toBe("");
  });
});
