import { describe, expect, it } from "vitest";

import { truncate } from "./truncate";

const TITLE = "Le Comte de Monte-Cristo";

describe("truncate", () => {
  it("tronque et ajoute des points de suspension, suffixe compris dans la longueur", () => {
    const result = truncate(TITLE, 15);
    expect(result).toBe("Le Comte de Mo…");
    expect(result).toHaveLength(15);
  });

  it("renvoie le texte tel quel s'il ne dépasse pas la longueur maximale", () => {
    expect(truncate("Court", 15)).toBe("Court");
    expect(truncate(TITLE, TITLE.length)).toBe(TITLE);
    expect(truncate("", 0)).toBe("");
  });

  it("coupe à la fin du dernier mot complet avec wordBoundary", () => {
    expect(truncate(TITLE, 15, { wordBoundary: true })).toBe("Le Comte de…");
  });

  it("garde le mot entier quand la coupe tombe juste avant un espace", () => {
    expect(truncate(TITLE, 9, { wordBoundary: true })).toBe("Le Comte…");
  });

  it("coupe au milieu du mot si le premier mot dépasse la longueur disponible", () => {
    expect(truncate("Anticonstitutionnellement", 10, { wordBoundary: true })).toBe("Anticonst…");
  });

  it("retire les espaces et la ponctuation avant le suffixe", () => {
    expect(truncate("Bonjour, le monde", 10)).toBe("Bonjour…");
    expect(truncate("Monte - Cristo", 9)).toBe("Monte…");
  });

  it("accepte un suffixe personnalisé", () => {
    expect(truncate("Vingt mille lieues sous les mers", 20, { suffix: " [...]" })).toBe(
      "Vingt mille li [...]",
    );
    expect(truncate(TITLE, 8, { suffix: "" })).toBe("Le Comte");
  });

  it("tronque le suffixe lui-même s'il ne laisse aucune place au texte", () => {
    expect(truncate(TITLE, 2, { suffix: "..." })).toBe("..");
    expect(truncate(TITLE, 1)).toBe("…");
    expect(truncate(TITLE, 0)).toBe("");
  });

  it("ne coupe jamais un emoji en deux", () => {
    expect(truncate("Bravo🎉🎉🎉", 8)).toBe("Bravo🎉…");
    expect(truncate("Bravo🎉🎉🎉", 7)).toBe("Bravo…");
  });

  it.each([-1, 1.5, Number.NaN, Number.POSITIVE_INFINITY])(
    "lève une RangeError pour la longueur maximale %s",
    (maxLength) => {
      expect(() => truncate(TITLE, maxLength)).toThrow(RangeError);
    },
  );

  it("précise la longueur reçue dans le message d'erreur", () => {
    expect(() => truncate(TITLE, -3)).toThrow(
      "La longueur maximale doit être un entier positif ou nul (reçu : -3).",
    );
  });
});
