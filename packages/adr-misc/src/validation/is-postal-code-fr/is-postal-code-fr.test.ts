import { describe, expect, it } from "vitest";

import { isPostalCodeFr } from "./is-postal-code-fr";

describe("isPostalCodeFr", () => {
  it.each([
    "01000",
    "75001",
    "13008",
    "20000",
    "20200",
    "95000",
    "97100",
    "97400",
    "97600",
    "97133",
    "98000",
    "98800",
  ])("accepte le code postal %s", (value) => {
    expect(isPostalCodeFr(value)).toBe(true);
  });

  it.each([
    "",
    "00100",
    "2A000",
    "2B200",
    "96000",
    "97000",
    "97900",
    "98100",
    "9800",
    "750011",
    "75 001",
    " 75001",
    "7500a",
  ])("refuse la chaîne %j", (value) => {
    expect(isPostalCodeFr(value)).toBe(false);
  });
});
