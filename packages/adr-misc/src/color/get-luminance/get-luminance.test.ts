import { describe, expect, it } from "vitest";

import { getLuminance } from "./get-luminance";

describe("getLuminance", () => {
  it("vaut 1 pour le blanc et 0 pour le noir", () => {
    expect(getLuminance("#ffffff")).toBe(1);
    expect(getLuminance("#000")).toBe(0);
  });

  it("calcule la luminance relative d'une couleur", () => {
    expect(getLuminance("#2563eb")).toBeCloseTo(0.1532, 4);
  });

  it("linéarise directement les composantes très sombres", () => {
    expect(getLuminance("#010101")).toBeCloseTo(1 / 255 / 12.92, 8);
  });

  it("pondère les composantes selon la sensibilité de l'œil", () => {
    expect(getLuminance("#ff0000")).toBeCloseTo(0.2126, 4);
    expect(getLuminance("#00ff00")).toBeCloseTo(0.7152, 4);
    expect(getLuminance("#0000ff")).toBeCloseTo(0.0722, 4);
  });

  it("ignore l'opacité", () => {
    expect(getLuminance("#ffffff00")).toBe(1);
  });

  it("lève une erreur pour une couleur invalide", () => {
    expect(() => getLuminance("white")).toThrow("Couleur hexadécimale invalide");
  });
});
