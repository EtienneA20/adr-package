import { describe, expect, it } from "vitest";

import { changeFileExtension } from "./change-file-extension";

describe("changeFileExtension", () => {
  it.each([
    ["exports/catalogue.docx", "pdf", "exports/catalogue.pdf"],
    ["couverture.png", ".webp", "couverture.webp"],
    ["C:\\Exports\\liste.csv", "xlsx", "C:\\Exports\\liste.xlsx"],
    ["archive.tar.gz", "zip", "archive.tar.zip"],
    ["LISEZMOI", "md", "LISEZMOI.md"],
    [".env", "local", ".env.local"],
    ["notes.txt", "", "notes"],
    ["notes.txt", ".", "notes"],
    ["notes.txt", "MD", "notes.MD"],
  ])("change l'extension de %j en %j", (fileName, extension, expected) => {
    expect(changeFileExtension(fileName, extension)).toBe(expected);
  });
});
