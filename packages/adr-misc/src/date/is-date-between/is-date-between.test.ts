import { describe, expect, it } from "vitest";

import { isDateBetween } from "./is-date-between";

const start = new Date(2026, 9, 1);
const end = new Date(2026, 9, 31);

describe("isDateBetween", () => {
  it("renvoie true pour une date dans la période (heure locale)", () => {
    expect(isDateBetween(new Date(2026, 9, 15), start, end)).toBe(true);
  });

  it("inclut les bornes par défaut, au jour près", () => {
    expect(isDateBetween(new Date(2026, 9, 1), start, end)).toBe(true);
    expect(isDateBetween(new Date(2026, 9, 31, 18), start, end)).toBe(true);
  });

  it("renvoie false pour une date hors de la période", () => {
    expect(isDateBetween(new Date(2026, 8, 30), start, end)).toBe(false);
    expect(isDateBetween(new Date(2026, 10, 1), start, end)).toBe(false);
  });

  it("exclut les bornes avec inclusive à false", () => {
    const options = { inclusive: false };
    expect(isDateBetween(new Date(2026, 9, 1), start, end, options)).toBe(false);
    expect(isDateBetween(new Date(2026, 9, 31), start, end, options)).toBe(false);
    expect(isDateBetween(new Date(2026, 9, 2), start, end, options)).toBe(true);
  });

  it("compare à la granularité demandée", () => {
    expect(
      isDateBetween(new Date(2026, 8, 15), new Date(2026, 8, 30), end, { unit: "month" }),
    ).toBe(true);
    expect(
      isDateBetween(new Date(2026, 9, 31, 18), start, new Date(2026, 9, 31, 12), {
        unit: "hour",
      }),
    ).toBe(false);
  });

  it("lève une erreur pour une date invalide", () => {
    expect(() => isDateBetween("x", start, end)).toThrow(new Error("Date invalide."));
    expect(() => isDateBetween(start, "x", end)).toThrow(new Error("Date de début invalide."));
  });

  it("lève une erreur si le début est postérieur à la fin", () => {
    expect(() => isDateBetween(start, end, start)).toThrow(
      new Error("La date de début est postérieure à la date de fin."),
    );
  });
});
