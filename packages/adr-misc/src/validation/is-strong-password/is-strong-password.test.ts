import { describe, expect, it } from "vitest";

import { isStrongPassword } from "./is-strong-password";

describe("isStrongPassword", () => {
  it("accepte un mot de passe qui respecte les règles par défaut", () => {
    expect(isStrongPassword("Livre2026!Lecture")).toBe(true);
  });

  it.each([
    ["trop court", "Livre2026!"],
    ["sans majuscule", "livre2026!lecture"],
    ["sans minuscule", "LIVRE2026!LECTURE"],
    ["sans chiffre", "LivreLecture!!"],
    ["sans caractère spécial", "Livre2026Lecture"],
    ["vide", ""],
  ])("refuse un mot de passe %s", (_label, value) => {
    expect(isStrongPassword(value)).toBe(false);
  });

  it("applique des règles personnalisées", () => {
    const rules = { minLength: 8, requireUppercase: false, requireSpecialChar: false };
    expect(isStrongPassword("livre2026", rules)).toBe(true);
    expect(isStrongPassword("livre26", rules)).toBe(false);
    expect(isStrongPassword("livrelecture", rules)).toBe(false);
  });
});
