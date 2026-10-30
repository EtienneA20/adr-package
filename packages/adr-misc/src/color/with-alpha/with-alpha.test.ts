import { describe, expect, it } from "vitest";

import { withAlpha } from "./with-alpha";

describe("withAlpha", () => {
  it("ajoute une opacité à une couleur opaque", () => {
    expect(withAlpha("#2563eb", 0.5)).toBe("#2563eb80");
    expect(withAlpha("#fff", 0.2)).toBe("#ffffff33");
  });

  it("remplace l'opacité existante au lieu de la multiplier", () => {
    expect(withAlpha("#2563eb80", 0.25)).toBe("#2563eb40");
  });

  it("renvoie #rrggbb pour une opacité de 1", () => {
    expect(withAlpha("#2563eb80", 1)).toBe("#2563eb");
  });

  it("accepte une opacité nulle", () => {
    expect(withAlpha("#2563eb", 0)).toBe("#2563eb00");
  });

  it.each([-0.2, 1.1, Number.NaN])("lève une RangeError pour alpha = %s", (alpha) => {
    expect(() => withAlpha("#2563eb", alpha)).toThrow(RangeError);
  });

  it("cite le paramètre fautif dans le message", () => {
    expect(() => withAlpha("#2563eb", 50)).toThrow(
      "Le paramètre « alpha » doit être un nombre entre 0 et 1 (reçu : 50).",
    );
  });

  it("lève une erreur pour une couleur invalide", () => {
    expect(() => withAlpha("transparent", 0.5)).toThrow("Couleur hexadécimale invalide");
  });
});
