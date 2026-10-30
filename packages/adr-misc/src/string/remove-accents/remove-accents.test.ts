import { describe, expect, it } from "vitest";

import { removeAccents } from "./remove-accents";

describe("removeAccents", () => {
  it("retire les accents des lettres françaises en conservant la casse", () => {
    expect(removeAccents("àâäçéèêëîïôöùûüÿ")).toBe("aaaceeeeiioouuuy");
    expect(removeAccents("ÀÂÄÇÉÈÊËÎÏÔÖÙÛÜŸ")).toBe("AAACEEEEIIOOUUUY");
  });

  it("décompose les ligatures œ et æ", () => {
    expect(removeAccents("Cœur d’Œdipe, ex æquo, Æsope")).toBe("Coeur d’OEdipe, ex aequo, AEsope");
  });

  it("remplace les lettres latines particulières", () => {
    expect(removeAccents("Straße, Søren, Łódź, Đorđe")).toBe("Strasse, Soren, Lodz, Dorde");
  });

  it("accepte un texte décomposé (NFD)", () => {
    expect(removeAccents("e\u0301le\u0300ve")).toBe("eleve");
  });

  it("conserve la ponctuation, les apostrophes typographiques et les espaces insécables", () => {
    expect(removeAccents("« Été », l’été\u00a0!")).toBe("« Ete », l’ete\u00a0!");
  });

  it("laisse intactes les écritures non latines", () => {
    expect(removeAccents("한국어 日本語 が")).toBe("한국어 日本語 が");
  });

  it("renvoie une chaîne vide pour une chaîne vide", () => {
    expect(removeAccents("")).toBe("");
  });
});
