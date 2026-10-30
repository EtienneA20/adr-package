import { describe, expect, it } from "vitest";

import { toConstantCase } from "./to-constant-case";

describe("toConstantCase", () => {
  it.each([
    ["maxLoanCount", "MAX_LOAN_COUNT"],
    ["max-loan-count", "MAX_LOAN_COUNT"],
    ["en retard", "EN_RETARD"],
    ["XMLHttpRequest", "XML_HTTP_REQUEST"],
  ])("convertit « %s » en « %s »", (value, expected) => {
    expect(toConstantCase(value)).toBe(expected);
  });

  it("conserve les accents et les ligatures", () => {
    expect(toConstantCase("cœur élève")).toBe("CŒUR_ÉLÈVE");
  });

  it("renvoie une chaîne vide pour un texte sans mot", () => {
    expect(toConstantCase("")).toBe("");
    expect(toConstantCase(" -_ ")).toBe("");
  });
});
