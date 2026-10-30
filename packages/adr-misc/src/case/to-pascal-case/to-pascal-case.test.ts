import { describe, expect, it } from "vitest";

import { toPascalCase } from "./to-pascal-case";

describe("toPascalCase", () => {
  it.each([
    ["book-card", "BookCard"],
    ["book_card", "BookCard"],
    ["bookCard", "BookCard"],
    ["BOOK CARD", "BookCard"],
    ["XMLHttpRequest", "XmlHttpRequest"],
    ["base64Encode", "Base64Encode"],
  ])("convertit « %s » en « %s »", (value, expected) => {
    expect(toPascalCase(value)).toBe(expected);
  });

  it("conserve les accents et les ligatures", () => {
    expect(toPascalCase("état de l’œuvre")).toBe("ÉtatDeLŒuvre");
  });

  it("renvoie une chaîne vide pour un texte sans mot", () => {
    expect(toPascalCase("")).toBe("");
    expect(toPascalCase(" -_ ")).toBe("");
  });
});
