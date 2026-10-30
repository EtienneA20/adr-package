import { describe, expect, it } from "vitest";

import { escapeHtml } from "./escape-html";

describe("escapeHtml", () => {
  it("échappe les cinq caractères spéciaux HTML", () => {
    expect(escapeHtml(`<a href="x" title='y'>Tom & Jerry</a>`)).toBe(
      "&lt;a href=&quot;x&quot; title=&#39;y&#39;&gt;Tom &amp; Jerry&lt;/a&gt;",
    );
  });

  it("échappe aussi les esperluettes d'entités déjà présentes", () => {
    expect(escapeHtml("&amp;")).toBe("&amp;amp;");
  });

  it("laisse intacts les accents, l'apostrophe typographique et les espaces insécables", () => {
    expect(escapeHtml("L’élève\u00a0!")).toBe("L’élève\u00a0!");
  });

  it("renvoie une chaîne vide pour une chaîne vide", () => {
    expect(escapeHtml("")).toBe("");
  });
});
