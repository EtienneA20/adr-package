import { describe, expect, it } from "vitest";

import { lightenColor } from "./lighten-color";

describe("lightenColor", () => {
  it("mélange la couleur avec du blanc dans la proportion demandée", () => {
    expect(lightenColor("#2563eb", 0.2)).toBe("#5182ef");
    expect(lightenColor("#2563eb", 0.9)).toBe("#e9effd");
  });

  it("renvoie la couleur inchangée pour 0 et du blanc pour 1", () => {
    expect(lightenColor("#2563eb", 0)).toBe("#2563eb");
    expect(lightenColor("#2563eb", 1)).toBe("#ffffff");
  });

  it("conserve l'opacité de la couleur d'origine", () => {
    expect(lightenColor("#00000080", 0.5)).toBe("#80808080");
  });

  it.each([-1, 1.01, Number.NaN])("lève une RangeError pour amount = %s", (amount) => {
    expect(() => lightenColor("#2563eb", amount)).toThrow(RangeError);
  });

  it("cite le paramètre fautif dans le message", () => {
    expect(() => lightenColor("#2563eb", -0.5)).toThrow(
      "Le paramètre « amount » doit être un nombre entre 0 et 1 (reçu : -0.5).",
    );
  });

  it("lève une erreur pour une couleur invalide", () => {
    expect(() => lightenColor("#12", 0.2)).toThrow("Couleur hexadécimale invalide");
  });
});
