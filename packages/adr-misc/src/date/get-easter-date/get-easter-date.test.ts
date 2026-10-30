import { describe, expect, it } from "vitest";

import { getEasterDate } from "./get-easter-date";

describe("getEasterDate", () => {
  it.each([
    [2000, "2000-04-23"],
    [2008, "2008-03-23"],
    [2019, "2019-04-21"],
    [2024, "2024-03-31"],
    [2025, "2025-04-20"],
    [2026, "2026-04-05"],
    [2027, "2027-03-28"],
    [2038, "2038-04-25"],
    [1818, "1818-03-22"],
    [2285, "2285-03-22"],
  ])("calcule Pâques %i : %s", (year, expected) => {
    expect(getEasterDate(year).format("YYYY-MM-DD")).toBe(expected);
  });

  it("renvoie un dimanche à minuit (heure locale)", () => {
    const easter = getEasterDate(2026);
    expect(easter.day()).toBe(0);
    expect(easter.toDate()).toEqual(new Date(2026, 3, 5));
  });

  it("accepte les bornes 1583 et 9999", () => {
    expect(getEasterDate(1583).format("YYYY-MM-DD")).toBe("1583-04-10");
    expect(getEasterDate(9999).day()).toBe(0);
  });

  it.each([1582, 10_000, 2026.5, Number.NaN])("lève une RangeError pour l'année %s", (year) => {
    expect(() => getEasterDate(year)).toThrow(
      new RangeError("L'année doit être un entier compris entre 1583 et 9999."),
    );
  });
});
