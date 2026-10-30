import { describe, expect, expectTypeOf, it } from "vitest";

import { EPasswordCriterion, getPasswordStrength } from "./get-password-strength";

describe("getPasswordStrength", () => {
  it("donne le score maximal à un mot de passe qui respecte tous les critères", () => {
    expect(getPasswordStrength("Livre2026!Lecture")).toEqual({ score: 4, missingCriteria: [] });
  });

  it("donne un score nul à une chaîne vide et liste tous les critères", () => {
    expect(getPasswordStrength("")).toEqual({
      score: 0,
      missingCriteria: ["minLength", "uppercase", "lowercase", "digit", "specialChar"],
    });
  });

  it("liste les critères manquants dans l'ordre de l'énumération", () => {
    expect(getPasswordStrength("livre")).toEqual({
      score: 0,
      missingCriteria: [
        EPasswordCriterion.MIN_LENGTH,
        EPasswordCriterion.UPPERCASE,
        EPasswordCriterion.DIGIT,
        EPasswordCriterion.SPECIAL_CHAR,
      ],
    });
  });

  it("calcule un score proportionnel aux critères respectés", () => {
    expect(getPasswordStrength("bibliothequemunicipale").score).toBe(1);
    expect(getPasswordStrength("Bibliothequemunicipale").score).toBe(2);
    expect(getPasswordStrength("Bibliotheque2026").score).toBe(3);
  });

  it("plafonne le score à 2 quand la longueur minimale n'est pas atteinte", () => {
    expect(getPasswordStrength("Li2!")).toEqual({ score: 2, missingCriteria: ["minLength"] });
  });

  it("compte les lettres accentuées et les espaces", () => {
    expect(getPasswordStrength("ÉTÉ été 2026 à la plage").missingCriteria).toEqual([]);
  });

  it("compte la longueur en points de code Unicode", () => {
    expect(getPasswordStrength("Ab1!😀", { minLength: 5 }).missingCriteria).toEqual([]);
    expect(getPasswordStrength("Ab1!😀", { minLength: 6 }).missingCriteria).toEqual(["minLength"]);
  });

  it("ne tient compte que des critères exigés par les règles", () => {
    const rules = {
      minLength: 8,
      requireUppercase: false,
      requireDigit: false,
      requireSpecialChar: false,
    };
    expect(getPasswordStrength("bibliotheque", rules)).toEqual({ score: 4, missingCriteria: [] });
    expect(getPasswordStrength("biblio", rules)).toEqual({
      score: 2,
      missingCriteria: ["minLength"],
    });
  });

  it("accepte une longueur minimale nulle", () => {
    expect(
      getPasswordStrength("a", {
        minLength: 0,
        requireUppercase: false,
        requireDigit: false,
        requireSpecialChar: false,
      }),
    ).toEqual({ score: 4, missingCriteria: [] });
  });

  it("type le score et les critères", () => {
    expectTypeOf(getPasswordStrength("x").score).toEqualTypeOf<0 | 1 | 2 | 3 | 4>();
    expectTypeOf(getPasswordStrength("x").missingCriteria).toEqualTypeOf<EPasswordCriterion[]>();
  });
});
