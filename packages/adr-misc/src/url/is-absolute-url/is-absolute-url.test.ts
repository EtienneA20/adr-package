import { describe, expect, it } from "vitest";

import { isAbsoluteUrl } from "./is-absolute-url";

describe("isAbsoluteUrl", () => {
  it.each([
    "https://bibliotheque.fr",
    "HTTP://bibliotheque.fr/livres",
    "ftp://fichiers.bibliotheque.fr",
    "mailto:contact@bibliotheque.fr",
    "tel:+33123456789",
    "data:text/plain,bonjour",
    "git+ssh://depot.fr/projet.git",
  ])("reconnaît l'URL absolue %s", (value) => {
    expect(isAbsoluteUrl(value)).toBe(true);
  });

  it.each([
    "",
    "/livres/42",
    "livres/42",
    "./livres",
    "../livres",
    "//cdn.bibliotheque.fr/logo.svg",
    "?page=2",
    "#resultats",
    "C:\\Documents\\livre.pdf",
    "c:/Documents/livre.pdf",
    "1http://bibliotheque.fr",
  ])("ne considère pas %j comme absolue", (value) => {
    expect(isAbsoluteUrl(value)).toBe(false);
  });
});
