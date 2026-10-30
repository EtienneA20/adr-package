import { describe, expect, it } from "vitest";

import { escapeRegExp } from "./escape-reg-exp";

describe("escapeRegExp", () => {
  it("échappe chaque caractère spécial des expressions régulières", () => {
    expect(escapeRegExp(".*+?^${}()|[]\\")).toBe("\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\");
  });

  it("produit un motif qui recherche le texte littéralement", () => {
    const pattern = new RegExp(`^${escapeRegExp("3.5 € (prix)")}$`, "u");
    expect(pattern.test("3.5 € (prix)")).toBe(true);
    expect(pattern.test("345 € (prix)")).toBe(false);
  });

  it("produit un motif valide avec l'option u", () => {
    const special = "a-b/c.d";
    expect(() => new RegExp(escapeRegExp(special), "u")).not.toThrow();
    expect(new RegExp(escapeRegExp(special), "u").test(special)).toBe(true);
  });

  it("laisse intact un texte sans caractère spécial", () => {
    expect(escapeRegExp("L’élève")).toBe("L’élève");
    expect(escapeRegExp("")).toBe("");
  });
});
