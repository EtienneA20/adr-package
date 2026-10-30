import { describe, expect, it } from "vitest";

import { mixColors } from "./mix-colors";

describe("mixColors", () => {
  it("mélange à parts égales par défaut", () => {
    expect(mixColors("#ff0000", "#0000ff")).toBe("#800080");
  });

  it("applique le poids de la seconde couleur", () => {
    expect(mixColors("#16a34a", "#dc2626", 0.25)).toBe("#488441");
  });

  it("renvoie la première couleur pour 0 et la seconde pour 1", () => {
    expect(mixColors("#16a34a", "#dc2626", 0)).toBe("#16a34a");
    expect(mixColors("#16a34a", "#dc2626", 1)).toBe("#dc2626");
  });

  it("mélange l'opacité si l'une des couleurs en précise une", () => {
    expect(mixColors("#00000000", "#000000")).toBe("#00000080");
    expect(mixColors("#000000", "#00000000", 0.75)).toBe("#00000040");
  });

  it("n'écrit pas d'opacité pour deux couleurs opaques", () => {
    expect(mixColors("#000", "#fff")).toBe("#808080");
  });

  it.each([-0.01, 1.2, Number.NaN])("lève une RangeError pour weight = %s", (weight) => {
    expect(() => mixColors("#000", "#fff", weight)).toThrow(RangeError);
  });

  it("cite le paramètre fautif dans le message", () => {
    expect(() => mixColors("#000", "#fff", 3)).toThrow(
      "Le paramètre « weight » doit être un nombre entre 0 et 1 (reçu : 3).",
    );
  });

  it("lève une erreur si l'une des couleurs est invalide", () => {
    expect(() => mixColors("rouge", "#fff")).toThrow("Couleur hexadécimale invalide");
    expect(() => mixColors("#fff", "bleu")).toThrow("Couleur hexadécimale invalide");
  });
});
