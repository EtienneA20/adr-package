import { describe, expect, it } from "vitest";

import { getContrastRatio } from "./get-contrast-ratio";

describe("getContrastRatio", () => {
  it("vaut 21 pour du noir sur blanc", () => {
    expect(getContrastRatio("#000000", "#ffffff")).toBe(21);
  });

  it("vaut 1 pour deux couleurs identiques", () => {
    expect(getContrastRatio("#2563eb", "#2563EB")).toBe(1);
  });

  it("calcule le contraste d'un couple texte / fond", () => {
    expect(getContrastRatio("#2563eb", "#ffffff")).toBeCloseTo(5.17, 2);
  });

  it("ne dépend pas de l'ordre des couleurs", () => {
    expect(getContrastRatio("#ffffff", "#2563eb")).toBe(getContrastRatio("#2563eb", "#ffffff"));
  });

  it("ignore l'opacité", () => {
    expect(getContrastRatio("#00000000", "#fff")).toBe(21);
  });

  it("lève une erreur si l'une des couleurs est invalide", () => {
    expect(() => getContrastRatio("noir", "#fff")).toThrow("Couleur hexadécimale invalide");
    expect(() => getContrastRatio("#000", "blanc")).toThrow("Couleur hexadécimale invalide");
  });
});
