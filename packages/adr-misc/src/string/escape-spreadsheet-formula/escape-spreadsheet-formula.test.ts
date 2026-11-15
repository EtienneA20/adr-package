import { describe, expect, it } from "vitest";

import { escapeSpreadsheetFormula, isSpreadsheetFormula } from "./escape-spreadsheet-formula";

const FORMULAS = [
  ["égal", "=1+1"],
  ["plus", "+33 6 12 34 56 78"],
  ["moins", "-2+3"],
  ["arobase", "@SUM(A1:A2)"],
  ["tabulation", "\t=1+1"],
  ["retour chariot", "\r=1+1"],
  ["égal pleine chasse", "＝1+1"],
  ["plus pleine chasse", "＋1"],
  ["moins pleine chasse", "－1"],
  ["arobase pleine chasse", "＠SUM(A1)"],
  ["DDE", '=cmd|" /C calc"!A0'],
  ["lien", '=HYPERLINK("https://pirate.example","Cliquez")'],
] as const;

const TEXTS = ["Germinal", "", " =1+1", "a=b", "1-2", "'=déjà neutralisé", "€ 12", "\n=1"];

describe("isSpreadsheetFormula", () => {
  it.each(FORMULAS)("détecte le motif %s", (_label, value) => {
    expect(isSpreadsheetFormula(value)).toBe(true);
  });

  it.each(TEXTS)("laisse passer le texte %j", (value) => {
    expect(isSpreadsheetFormula(value)).toBe(false);
  });
});

describe("escapeSpreadsheetFormula", () => {
  it.each(FORMULAS)("préfixe d'une apostrophe le motif %s", (_label, value) => {
    expect(escapeSpreadsheetFormula(value)).toBe(`'${value}`);
  });

  it.each(TEXTS)("ne modifie pas le texte %j", (value) => {
    expect(escapeSpreadsheetFormula(value)).toBe(value);
  });
});
