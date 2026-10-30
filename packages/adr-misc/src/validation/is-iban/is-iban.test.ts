import { describe, expect, it } from "vitest";

import { isIban } from "./is-iban";

describe("isIban", () => {
  it.each([
    "FR7630006000011234567890189",
    "FR76 3000 6000 0112 3456 7890 189",
    "fr76 3000 6000 0112 3456 7890 189",
    "DE89 3704 0044 0532 0130 00",
    "GB82 WEST 1234 5698 7654 32",
    "BE68 5390 0754 7034",
    "BR15 0000 0000 0000 1093 2840 814P2",
  ])("accepte l'IBAN %j", (value) => {
    expect(isIban(value)).toBe(true);
  });

  it("refuse une clé incorrecte", () => {
    expect(isIban("FR76 3000 6000 0112 3456 7890 188")).toBe(false);
    expect(isIban("FR77 3000 6000 0112 3456 7890 189")).toBe(false);
  });

  it("refuse une longueur incorrecte pour un pays connu", () => {
    expect(isIban("FR76 3000 6000 0112 3456 7890")).toBe(false);
    expect(isIban("BE68 5390 0754 7034 0")).toBe(false);
  });

  it.each(["", "FR", "1276 3000 6000 0112 3456 7890 189", "FRAB30006000011234567890189"])(
    "refuse la chaîne mal formée %j",
    (value) => {
      expect(isIban(value)).toBe(false);
    },
  );

  it("refuse les caractères non alphanumériques", () => {
    expect(isIban("FR76-3000-6000-0112-3456-7890-189")).toBe(false);
  });
});
