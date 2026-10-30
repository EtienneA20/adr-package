import { describe, expect, it } from "vitest";

import { isPhoneNumberFr } from "./is-phone-number-fr";

describe("isPhoneNumberFr", () => {
  it.each([
    "0612345678",
    "06 12 34 56 78",
    "06.12.34.56.78",
    "06-12-34-56-78",
    "07 98 76 54 32",
    "01 23 45 67 89",
    "09 87 65 43 21",
    "+33612345678",
    "+33 6 12 34 56 78",
    "0033 6 12 34 56 78",
    "06 12 34 56 78",
  ])("accepte le numéro %j", (value) => {
    expect(isPhoneNumberFr(value)).toBe(true);
  });

  it.each([
    "",
    "06 12 34 56",
    "06 12 34 56 78 9",
    "00 12 34 56 78",
    "+33 06 12 34 56 78",
    "+33 (0)6 12 34 56 78",
    "+44 6 12 34 56 78",
    "6 12 34 56 78",
    "06 12 34 56 7a",
  ])("refuse la chaîne %j", (value) => {
    expect(isPhoneNumberFr(value)).toBe(false);
  });
});
