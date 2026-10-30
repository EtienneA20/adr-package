import { describe, expect, it } from "vitest";

import { splitFilePath } from "./split-file-path";

describe("splitFilePath", () => {
  it("découpe un chemin Unix", () => {
    expect(splitFilePath("docs/2026/rapport.final.pdf")).toEqual({
      directory: "docs/2026/",
      name: "rapport.final.pdf",
      stem: "rapport.final",
      extension: "pdf",
    });
  });

  it("découpe un chemin Windows", () => {
    expect(splitFilePath("C:\\Documents\\Livre.EPUB")).toEqual({
      directory: "C:\\Documents\\",
      name: "Livre.EPUB",
      stem: "Livre",
      extension: "EPUB",
    });
  });

  it("ignore les séparateurs finaux", () => {
    expect(splitFilePath("docs/archives//")).toMatchObject({
      directory: "docs/",
      name: "archives",
    });
  });

  it("ne voit pas d'extension dans un fichier caché ou un nom fait de points", () => {
    expect(splitFilePath(".env")).toMatchObject({ stem: ".env", extension: undefined });
    expect(splitFilePath("..")).toMatchObject({ stem: "..", extension: undefined });
    expect(splitFilePath("LISEZMOI")).toMatchObject({ stem: "LISEZMOI", extension: undefined });
  });

  it("renvoie une extension vide pour un nom terminé par un point", () => {
    expect(splitFilePath("archive.")).toMatchObject({ stem: "archive", extension: "" });
  });

  it("gère la chaîne vide", () => {
    expect(splitFilePath("")).toEqual({ directory: "", name: "", stem: "", extension: undefined });
  });
});
