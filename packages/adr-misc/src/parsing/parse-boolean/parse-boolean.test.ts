import { describe, expect, it } from "vitest";

import { parseBoolean } from "./parse-boolean";

describe("parseBoolean", () => {
  it.each(["true", "TRUE", "vrai", "Oui", "yes", "o", "Y", "1", "on", " On "])(
    "lit « %s » comme vrai",
    (input) => {
      expect(parseBoolean(input)).toBe(true);
    },
  );

  it.each(["false", "Faux", "NON", "no", "n", "0", "off", " OFF "])(
    "lit « %s » comme faux",
    (input) => {
      expect(parseBoolean(input)).toBe(false);
    },
  );

  it("renvoie un booléen tel quel", () => {
    expect(parseBoolean(true)).toBe(true);
    expect(parseBoolean(false)).toBe(false);
  });

  it("accepte les nombres 1 et 0", () => {
    expect(parseBoolean(1)).toBe(true);
    expect(parseBoolean(0)).toBe(false);
    expect(parseBoolean(2)).toBeUndefined();
  });

  it.each(["", "peut-être", "2", "ouii", "truee"])(
    "renvoie undefined pour la saisie non reconnue « %s »",
    (input) => {
      expect(parseBoolean(input)).toBeUndefined();
    },
  );

  it("renvoie undefined pour null et undefined", () => {
    expect(parseBoolean(null)).toBeUndefined();
    expect(parseBoolean(undefined)).toBeUndefined();
  });
});
