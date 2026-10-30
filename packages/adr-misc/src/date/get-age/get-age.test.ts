import { afterEach, describe, expect, it, vi } from "vitest";

import { getAge } from "./get-age";

describe("getAge", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("compte l'anniversaire le jour même", () => {
    expect(getAge(new Date(2008, 9, 29), new Date(2026, 9, 29))).toBe(18);
  });

  it("retire un an tant que l'anniversaire n'est pas passé", () => {
    expect(getAge(new Date(2008, 9, 30), new Date(2026, 9, 29))).toBe(17);
    expect(getAge(new Date(2008, 11, 1), new Date(2026, 9, 29))).toBe(17);
  });

  it("ajoute l'année une fois le mois de l'anniversaire passé", () => {
    expect(getAge(new Date(2008, 0, 31), new Date(2026, 9, 1))).toBe(18);
  });

  it("renvoie 0 le jour de la naissance", () => {
    expect(getAge(new Date(2026, 9, 29, 8), new Date(2026, 9, 29, 6))).toBe(0);
  });

  it("fait vieillir les personnes nées un 29 février le 1er mars des années non bissextiles", () => {
    const birthDate = new Date(2008, 1, 29);
    expect(getAge(birthDate, new Date(2026, 1, 28))).toBe(17);
    expect(getAge(birthDate, new Date(2026, 2, 1))).toBe(18);
    expect(getAge(birthDate, new Date(2028, 1, 29))).toBe(20);
  });

  it("utilise la date du jour par défaut (heure locale)", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 9, 29, 10));
    expect(getAge("2000-10-29")).toBe(26);
  });

  it("lève une erreur pour une date de naissance invalide", () => {
    expect(() => getAge("pas une date", new Date(2026, 0, 1))).toThrow(
      new Error("Date de naissance invalide."),
    );
  });

  it("lève une erreur pour une date de référence invalide", () => {
    expect(() => getAge(new Date(2000, 0, 1), null)).toThrow(
      new Error("Date de référence invalide."),
    );
  });

  it("lève une erreur si la naissance est postérieure à la date de référence", () => {
    expect(() => getAge(new Date(2026, 9, 30), new Date(2026, 9, 29))).toThrow(
      new Error("La date de naissance est postérieure à la date de référence."),
    );
  });
});
