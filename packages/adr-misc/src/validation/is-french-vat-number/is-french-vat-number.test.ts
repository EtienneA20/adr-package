import { describe, expect, it } from "vitest";

import { isFrenchVatNumber } from "./is-french-vat-number";

describe("isFrenchVatNumber", () => {
  it.each(["FR44732829320", "FR 44 732 829 320", "fr44732829320", "FR39356000000"])(
    "accepte le numéro %j",
    (value) => {
      expect(isFrenchVatNumber(value)).toBe(true);
    },
  );

  it("refuse une clé incorrecte", () => {
    expect(isFrenchVatNumber("FR45732829320")).toBe(false);
  });

  it("refuse un SIREN dont la clé de Luhn est invalide, même avec une clé TVA cohérente", () => {
    const siren = "732829321";
    const key = String((12 + 3 * (Number(siren) % 97)) % 97).padStart(2, "0");
    expect(isFrenchVatNumber(`FR${key}${siren}`)).toBe(false);
  });

  it.each(["", "44732829320", "DE44732829320", "FR4473282932", "FRAB732829320", "FR-44732829320"])(
    "refuse la chaîne mal formée %j",
    (value) => {
      expect(isFrenchVatNumber(value)).toBe(false);
    },
  );
});
