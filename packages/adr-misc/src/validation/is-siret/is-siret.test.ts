import { describe, expect, it } from "vitest";

import { isSiret } from "./is-siret";

describe("isSiret", () => {
  it.each(["73282932000074", "732 829 320 00074", "732 829 320 00074"])(
    "accepte le SIRET %j",
    (value) => {
      expect(isSiret(value)).toBe(true);
    },
  );

  it("accepte le siège de La Poste (clé de Luhn valide)", () => {
    expect(isSiret("35600000000048")).toBe(true);
  });

  it("accepte un établissement de La Poste dont la somme des chiffres est multiple de 5", () => {
    expect(isSiret("35600000049837")).toBe(true);
  });

  it("refuse un établissement de La Poste qui ne respecte aucune des deux règles", () => {
    expect(isSiret("35600000049838")).toBe(false);
  });

  it.each(["", "73282932000075", "7328293200007", "732829320000740", "7328293200007A"])(
    "refuse la chaîne %j",
    (value) => {
      expect(isSiret(value)).toBe(false);
    },
  );
});
