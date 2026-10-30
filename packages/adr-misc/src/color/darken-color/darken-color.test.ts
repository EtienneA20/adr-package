import { describe, expect, it } from "vitest";

import { darkenColor } from "./darken-color";

describe("darkenColor", () => {
  it("mélange la couleur avec du noir dans la proportion demandée", () => {
    expect(darkenColor("#2563eb", 0.2)).toBe("#1e4fbc");
  });

  it("renvoie la couleur inchangée pour 0 et du noir pour 1", () => {
    expect(darkenColor("#2563eb", 0)).toBe("#2563eb");
    expect(darkenColor("#2563eb", 1)).toBe("#000000");
  });

  it("normalise une couleur courte en #rrggbb", () => {
    expect(darkenColor("#FFF", 0.5)).toBe("#808080");
  });

  it("conserve l'opacité de la couleur d'origine", () => {
    expect(darkenColor("#ffffff80", 0.5)).toBe("#80808080");
  });

  it.each([-0.1, 1.5, Number.NaN])("lève une RangeError pour amount = %s", (amount) => {
    expect(() => darkenColor("#2563eb", amount)).toThrow(RangeError);
  });

  it("cite le paramètre fautif dans le message", () => {
    expect(() => darkenColor("#2563eb", 2)).toThrow(
      "Le paramètre « amount » doit être un nombre entre 0 et 1 (reçu : 2).",
    );
  });

  it("lève une erreur pour une couleur invalide", () => {
    expect(() => darkenColor("bleu", 0.2)).toThrow("Couleur hexadécimale invalide");
  });
});
