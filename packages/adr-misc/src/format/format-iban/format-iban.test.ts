import { describe, expect, it } from "vitest";

import { formatIban } from "./format-iban";

const IBAN = "FR7630006000011234567890189";

describe("formatIban", () => {
  it("regroupe l'IBAN par quatre caractères", () => {
    expect(formatIban(IBAN)).toBe("FR76 3000 6000 0112 3456 7890 189");
  });

  it("retire les espaces et tirets et passe en majuscules", () => {
    expect(formatIban(" fr76 3000-6000 0112 3456 7890 189 ")).toBe(
      "FR76 3000 6000 0112 3456 7890 189",
    );
  });

  it("masque les caractères sauf les quatre premiers et les quatre derniers", () => {
    expect(formatIban(IBAN, { masked: true })).toBe("FR76 **** **** **** **** ***0 189");
  });

  it("ne masque rien quand l'IBAN est trop court", () => {
    expect(formatIban("FR761234", { masked: true })).toBe("FR76 1234");
    expect(formatIban("FR7612345", { masked: true })).toBe("FR76 *234 5");
  });

  it.each([null, undefined, "", "   "])("renvoie une chaîne vide pour %j", (value) => {
    expect(formatIban(value)).toBe("");
  });
});
