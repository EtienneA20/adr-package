import { describe, expect, it } from "vitest";

import { sanitizeFileName } from "./sanitize-file-name";

describe("sanitizeFileName", () => {
  it("remplace les caractères interdits par un tiret bas", () => {
    expect(sanitizeFileName('Rapport : "Retards" 2026/10.pdf')).toBe(
      "Rapport _ _Retards_ 2026_10.pdf",
    );
    expect(sanitizeFileName("a<b>c|d?e*f\\g.txt")).toBe("a_b_c_d_e_f_g.txt");
  });

  it("remplace les caractères de contrôle", () => {
    expect(sanitizeFileName("liste\tdes\nlivres\u007f.csv")).toBe("liste_des_livres_.csv");
  });

  it("utilise le remplacement fourni, ou supprime avec une chaîne vide", () => {
    expect(sanitizeFileName("Qui a peur ?.txt", { replacement: "" })).toBe("Qui a peur .txt");
    expect(sanitizeFileName("2026/10/29.log", { replacement: "-" })).toBe("2026-10-29.log");
  });

  it("conserve les accents et les emojis", () => {
    expect(sanitizeFileName("Éloïse – fiche 📚.pdf")).toBe("Éloïse – fiche 📚.pdf");
  });

  it("retire les espaces autour et les points et espaces finaux", () => {
    expect(sanitizeFileName("  notes.  ")).toBe("notes");
    expect(sanitizeFileName("archive...")).toBe("archive");
  });

  it("préfixe les noms réservés par Windows", () => {
    expect(sanitizeFileName("CON")).toBe("_CON");
    expect(sanitizeFileName("nul.txt")).toBe("_nul.txt");
    expect(sanitizeFileName("com1.tar.gz")).toBe("_com1.tar.gz");
    expect(sanitizeFileName("CONSOLE.txt")).toBe("CONSOLE.txt");
    expect(sanitizeFileName("COM0.txt")).toBe("COM0.txt");
  });

  it("renvoie une chaîne vide s'il ne reste rien", () => {
    expect(sanitizeFileName("")).toBe("");
    expect(sanitizeFileName("..")).toBe("");
    expect(sanitizeFileName("???", { replacement: "" })).toBe("");
  });

  it("tronque le radical en conservant l'extension", () => {
    expect(sanitizeFileName("abcdefghij.pdf", { maxLength: 8 })).toBe("abcd.pdf");
    expect(sanitizeFileName("court.pdf", { maxLength: 9 })).toBe("court.pdf");
    expect(sanitizeFileName(`${"a".repeat(300)}.pdf`)).toHaveLength(255);
  });

  it("tronque sans extension, ou quand l'extension est trop longue", () => {
    expect(sanitizeFileName("abcdefghij", { maxLength: 4 })).toBe("abcd");
    expect(sanitizeFileName("a.extension", { maxLength: 4 })).toBe("a.ex");
  });

  it("ne coupe pas un emoji en deux et retire un point final après troncature", () => {
    expect(sanitizeFileName("📚📚📚📚", { maxLength: 2 })).toBe("📚📚");
    expect(sanitizeFileName("ab.cdefgh", { maxLength: 3 })).toBe("ab");
  });

  it("lève une RangeError si le remplacement contient un caractère interdit", () => {
    expect(() => sanitizeFileName("a?b", { replacement: "/" })).toThrow(RangeError);
    expect(() => sanitizeFileName("a?b", { replacement: "/" })).toThrow(
      "Le caractère de remplacement « / » est interdit dans un nom de fichier",
    );
  });

  it.each([0, -1, 2.5, Number.NaN])("lève une RangeError pour maxLength = %s", (maxLength) => {
    expect(() => sanitizeFileName("a.txt", { maxLength })).toThrow(RangeError);
  });
});
