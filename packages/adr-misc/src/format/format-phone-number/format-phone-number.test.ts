import { describe, expect, it } from "vitest";

import { formatPhoneNumber } from "./format-phone-number";

describe("formatPhoneNumber", () => {
  it.each([
    ["0612345678", "06 12 34 56 78"],
    ["06.12.34.56.78", "06 12 34 56 78"],
    ["06-12-34-56-78", "06 12 34 56 78"],
    [" 01 23 45 67 89 ", "01 23 45 67 89"],
    ["+33612345678", "+33 6 12 34 56 78"],
    ["+33 (0)6 12 34 56 78", "+33 6 12 34 56 78"],
    ["0033 6 12 34 56 78", "+33 6 12 34 56 78"],
  ])("formate « %s » en « %s » en gardant la forme de la saisie", (input, expected) => {
    expect(formatPhoneNumber(input)).toBe(expected);
  });

  it("impose le format international ou national", () => {
    expect(formatPhoneNumber("06 12 34 56 78", { international: true })).toBe("+33 6 12 34 56 78");
    expect(formatPhoneNumber("+33612345678", { international: false })).toBe("06 12 34 56 78");
    expect(formatPhoneNumber("0033612345678", { international: false })).toBe("06 12 34 56 78");
  });

  it.each(["+44 20 7946 0958", "06 12 34", "0012345678", "abc"])(
    "renvoie tel quel un numéro non reconnu : « %s »",
    (input) => {
      expect(formatPhoneNumber(` ${input} `)).toBe(input);
    },
  );

  it.each([null, undefined, ""])("renvoie une chaîne vide pour %j", (value) => {
    expect(formatPhoneNumber(value)).toBe("");
  });
});
