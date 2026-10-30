import { describe, expect, it } from "vitest";

import { parseNumber } from "./parse-number";

describe("parseNumber", () => {
  it.each([
    ["1234", 1234],
    ["1234.56", 1234.56],
    ["1234,56", 1234.56],
    ["1 234,56", 1234.56],
    ["1\u202f234,56", 1234.56],
    ["1\u00a0234\u00a0567,8", 1234567.8],
    ["1.234,56", 1234.56],
    ["1,234.56", 1234.56],
    ["1.234.567", 1234567],
    ["1,234,567", 1234567],
    ["1.234.567,89", 1234567.89],
    [",5", 0.5],
    ["  42  ", 42],
    ["0", 0],
  ])("lit « %s » comme %d", (input, expected) => {
    expect(parseNumber(input)).toBe(expected);
  });

  it("lit le signe, y compris le moins typographique de Intl", () => {
    expect(parseNumber("-12,5")).toBe(-12.5);
    expect(parseNumber("+12,5")).toBe(12.5);
    expect(parseNumber("\u221212,5")).toBe(-12.5);
    expect(parseNumber("- 3")).toBe(-3);
  });

  it("renvoie un pourcentage sous forme de ratio", () => {
    expect(parseNumber("12,5 %")).toBe(0.125);
    expect(parseNumber("-50%")).toBe(-0.5);
    expect(parseNumber("25\u00a0%")).toBe(0.25);
  });

  it("relit la sortie de Intl.NumberFormat en français", () => {
    const formatted = new Intl.NumberFormat("fr-FR").format(-1234567.891);
    expect(parseNumber(formatted)).toBe(-1234567.891);
  });

  it("lit « 1,234 » et « 1.234 » comme des décimaux sans séparateur imposé", () => {
    expect(parseNumber("1,234")).toBe(1.234);
    expect(parseNumber("1.234")).toBe(1.234);
  });

  it("respecte le séparateur décimal imposé", () => {
    expect(parseNumber("1,234", { decimalSeparator: "." })).toBe(1234);
    expect(parseNumber("1.234", { decimalSeparator: "," })).toBe(1234);
    expect(parseNumber("1.234,5", { decimalSeparator: "," })).toBe(1234.5);
    expect(parseNumber("1,5", { decimalSeparator: "." })).toBeUndefined();
    expect(parseNumber("1,2,3", { decimalSeparator: "," })).toBeUndefined();
  });

  it("renvoie un nombre fini tel quel", () => {
    expect(parseNumber(12.5)).toBe(12.5);
  });

  it.each([Number.NaN, Number.POSITIVE_INFINITY])("refuse le nombre non fini %d", (input) => {
    expect(parseNumber(input)).toBeUndefined();
  });

  it.each([
    "",
    "   ",
    "abc",
    "12abc",
    "1e3",
    "%",
    "-",
    ",",
    "5,",
    "1.2.3",
    "12.34.567",
    "1,23,456",
    "1.234.56,7",
    "--5",
    "5-",
  ])("renvoie undefined pour la saisie invalide « %s »", (input) => {
    expect(parseNumber(input)).toBeUndefined();
  });

  it("renvoie undefined pour null et undefined", () => {
    expect(parseNumber(null)).toBeUndefined();
    expect(parseNumber(undefined)).toBeUndefined();
  });
});
