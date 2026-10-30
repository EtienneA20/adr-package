import { describe, expect, it } from "vitest";

import { toKebabCase } from "./to-kebab-case";

describe("toKebabCase", () => {
  it.each([
    ["BookCard", "book-card"],
    ["bookCard", "book-card"],
    ["book_card", "book-card"],
    ["Book Card", "book-card"],
    ["XMLHttpRequest", "xml-http-request"],
    ["--book--card--", "book-card"],
  ])("convertit « %s » en « %s »", (value, expected) => {
    expect(toKebabCase(value)).toBe(expected);
  });

  it("conserve les accents et les ligatures", () => {
    expect(toKebabCase("ÉtatDeLŒuvre")).toBe("état-de-l-œuvre");
  });

  it("renvoie une chaîne vide pour un texte sans mot", () => {
    expect(toKebabCase("")).toBe("");
    expect(toKebabCase(" -_ ")).toBe("");
  });
});
