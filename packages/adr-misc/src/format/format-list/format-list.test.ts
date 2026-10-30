import { describe, expect, it } from "vitest";

import { formatList } from "./format-list";

describe("formatList", () => {
  it("relie les éléments par « et » en français", () => {
    expect(formatList(["Zola", "Hugo", "Balzac"])).toBe("Zola, Hugo et Balzac");
    expect(formatList(["Zola", "Hugo"])).toBe("Zola et Hugo");
    expect(formatList(["Zola"])).toBe("Zola");
  });

  it("ignore les éléments vides ou composés d'espaces", () => {
    expect(formatList(["Zola", "", "  ", "Hugo"])).toBe("Zola et Hugo");
  });

  it("renvoie une chaîne vide pour une liste vide", () => {
    expect(formatList([])).toBe("");
    expect(formatList([""])).toBe("");
  });

  it("relie les éléments par « ou » ou les énumère", () => {
    expect(formatList(["roman", "essai"], { type: "disjunction" })).toBe("roman ou essai");
    expect(formatList(["1 h", "30 min"], { type: "unit", style: "narrow" })).toBe("1 h 30 min");
  });

  it("accepte une autre locale", () => {
    expect(formatList(["a", "b", "c"], { locale: "en" })).toBe("a, b, and c");
  });

  it("lève une RangeError pour une locale invalide", () => {
    expect(() => formatList(["a"], { locale: "pas une locale" })).toThrow(RangeError);
  });
});
