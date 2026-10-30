import { describe, expect, it } from "vitest";

import { stringToColor } from "./string-to-color";

describe("stringToColor", () => {
  it("renvoie toujours la même couleur pour le même texte", () => {
    expect(stringToColor("Marie Curie")).toBe(stringToColor("Marie Curie"));
  });

  it("renvoie une couleur au format #rrggbb", () => {
    expect(stringToColor("Science-fiction")).toMatch(/^#[\da-f]{6}$/);
  });

  it("produit une couleur stable d'un environnement à l'autre", () => {
    expect(stringToColor("")).toBe("#bbbd28");
  });

  it("tient compte de la casse", () => {
    expect(stringToColor("policier")).not.toBe(stringToColor("Policier"));
  });

  it("donne des couleurs différentes pour des textes différents", () => {
    const genres = ["Roman", "Policier", "Poésie", "Bande dessinée"];
    expect(new Set(genres.map((genre) => stringToColor(genre))).size).toBe(genres.length);
  });

  it("applique la saturation et la luminosité demandées", () => {
    expect(stringToColor("Roman", { saturation: 0 })).toBe("#737373");
    expect(stringToColor("Roman", { lightness: 100 })).toBe("#ffffff");
    expect(stringToColor("Roman", { lightness: 0 })).toBe("#000000");
  });

  it.each([{ saturation: 101 }, { saturation: -1 }, { lightness: 150 }, { lightness: Number.NaN }])(
    "lève une RangeError pour %o",
    (options) => {
      expect(() => stringToColor("Roman", options)).toThrow(RangeError);
    },
  );

  it("cite l'option fautive dans le message", () => {
    expect(() => stringToColor("Roman", { lightness: 120 })).toThrow(
      "L'option « lightness » doit être un pourcentage entre 0 et 100 (reçu : 120).",
    );
  });
});
