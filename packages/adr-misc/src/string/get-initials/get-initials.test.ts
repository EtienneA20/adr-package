import { describe, expect, it } from "vitest";

import { getInitials } from "./get-initials";

describe("getInitials", () => {
  it("prend la première lettre de chaque mot, en majuscules", () => {
    expect(getInitials("victor hugo")).toBe("VH");
    expect(getInitials("  Marie   Curie  ")).toBe("MC");
  });

  it("compte chaque partie d'un nom composé par défaut", () => {
    expect(getInitials("Jean-Pierre Dupont")).toBe("JPD");
  });

  it("ne compte qu'une initiale par nom composé avec splitHyphens à false", () => {
    expect(getInitials("Jean-Pierre Dupont", { splitHyphens: false })).toBe("JD");
  });

  it("conserve les accents et les ligatures", () => {
    expect(getInitials("Émile Zola")).toBe("ÉZ");
    expect(getInitials("œdipe roi")).toBe("ŒR");
  });

  it("ignore les particules et les élisions", () => {
    expect(getInitials("Charles de Gaulle")).toBe("CG");
    expect(getInitials("Jean d’Ormesson")).toBe("JO");
    expect(getInitials("Ludwig van Beethoven")).toBe("LB");
  });

  it("garde les particules si le nom n'est fait que de particules", () => {
    expect(getInitials("de la")).toBe("DL");
  });

  it("ignore la ponctuation et les mots sans lettre", () => {
    expect(getInitials("« Colette » - (1873)")).toBe("C1");
    expect(getInitials("Dr. House")).toBe("DH");
  });

  it("garde les premières initiales et la dernière au-delà de maxLetters", () => {
    expect(getInitials("Jean-Pierre Dupont", { maxLetters: 2 })).toBe("JD");
    expect(getInitials("Anne Marie Louise Durand", { maxLetters: 3 })).toBe("AMD");
    expect(getInitials("Jean-Pierre Dupont", { maxLetters: 1 })).toBe("J");
    expect(getInitials("Victor Hugo", { maxLetters: 5 })).toBe("VH");
  });

  it("renvoie une chaîne vide pour un nom sans lettre", () => {
    expect(getInitials("")).toBe("");
    expect(getInitials(" - ")).toBe("");
  });

  it.each([0, -1, 1.5, Number.NaN])("lève une RangeError pour maxLetters %s", (maxLetters) => {
    expect(() => getInitials("Victor Hugo", { maxLetters })).toThrow(RangeError);
  });

  it("précise la valeur reçue dans le message d'erreur", () => {
    expect(() => getInitials("Victor Hugo", { maxLetters: 0 })).toThrow(
      "Le nombre maximal d'initiales doit être un entier supérieur ou égal à 1 (reçu : 0).",
    );
  });
});
