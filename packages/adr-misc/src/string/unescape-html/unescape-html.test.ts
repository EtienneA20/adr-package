import { describe, expect, it } from "vitest";

import { escapeHtml } from "../escape-html";
import { unescapeHtml } from "./unescape-html";

describe("unescapeHtml", () => {
  it("décode les entités produites par escapeHtml", () => {
    const original = `<a href="x" title='y'>Tom & Jerry</a>`;
    expect(unescapeHtml(escapeHtml(original))).toBe(original);
  });

  it("décode les entités numériques décimales et hexadécimales", () => {
    expect(unescapeHtml("L&#39;&#233;l&#xE8;ve &#X1F389;")).toBe("L'élève 🎉");
  });

  it("décode les entités nommées courantes en français", () => {
    expect(
      unescapeHtml("&laquo;&nbsp;Bonjour&nbsp;&raquo; &hellip; l&rsquo;&eacute;t&eacute;"),
    ).toBe("«\u00a0Bonjour\u00a0» … l’été");
    expect(unescapeHtml("&apos;&lsquo;&ldquo;&rdquo;&ndash;&mdash;&euro;&copy;")).toBe("'‘“”–—€©");
  });

  it("décode les lettres accentuées et les ligatures", () => {
    expect(
      unescapeHtml("&Eacute;&egrave;&ecirc;&euml;&agrave;&ccedil;&Ccedil;&ntilde;&aring;"),
    ).toBe("ÉèêëàçÇñå");
    expect(unescapeHtml("&oelig;&OElig;&aelig;&AElig;&szlig;")).toBe("œŒæÆß");
  });

  it("laisse intactes les entités inconnues ou invalides", () => {
    expect(unescapeHtml("&inconnue; &constructor; &#99999999; & ; &#; &qacute; &Eacutee;")).toBe(
      "&inconnue; &constructor; &#99999999; & ; &#; &qacute; &Eacutee;",
    );
  });

  it("décode en une seule passe", () => {
    expect(unescapeHtml("&amp;lt;")).toBe("&lt;");
  });

  it("renvoie une chaîne vide pour une chaîne vide", () => {
    expect(unescapeHtml("")).toBe("");
  });
});
