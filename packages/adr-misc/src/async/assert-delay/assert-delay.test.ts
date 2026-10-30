import { describe, expect, it } from "vitest";

import { assertDelay } from "./assert-delay";

describe("assertDelay", () => {
  it.each([0, 1, 1500.5])("accepte la durée %d", (value) => {
    expect(() => {
      assertDelay(value, "ms");
    }).not.toThrow();
  });

  it.each([-1, Number.NaN, Number.POSITIVE_INFINITY])("refuse la durée %d", (value) => {
    expect(() => {
      assertDelay(value, "waitMs");
    }).toThrow(new RangeError(`waitMs doit être un nombre fini positif ou nul (reçu : ${value}).`));
  });
});
