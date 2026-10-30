import { describe, expect, it } from "vitest";

import { buildUrl } from "./build-url";

describe("buildUrl", () => {
  it("assemble la base, le chemin et les paramètres", () => {
    expect(
      buildUrl("https://api.bibliotheque.fr/", "/livres", { q: "Hugo", page: 2, genre: undefined }),
    ).toBe("https://api.bibliotheque.fr/livres?q=Hugo&page=2");
  });

  it("renvoie l'URL sans ? quand aucun paramètre n'est sérialisé", () => {
    expect(buildUrl("/api", "livres")).toBe("/api/livres");
    expect(buildUrl("/api", "livres", { q: null })).toBe("/api/livres");
  });

  it("accepte une base seule", () => {
    expect(buildUrl("/api/livres", undefined, { page: 1 })).toBe("/api/livres?page=1");
  });

  it("ajoute les paramètres à une query string existante", () => {
    expect(buildUrl("/api/livres?tri=titre", undefined, { page: 3 })).toBe(
      "/api/livres?tri=titre&page=3",
    );
    expect(buildUrl("/api/livres?", undefined, { page: 3 })).toBe("/api/livres?page=3");
    expect(buildUrl("/api/livres?tri=titre&", undefined, { page: 3 })).toBe(
      "/api/livres?tri=titre&page=3",
    );
  });

  it("transmet le format des tableaux et ignore addQueryPrefix", () => {
    expect(
      buildUrl(
        "/api",
        "livres",
        { genre: ["roman", "bd"] },
        {
          arrayFormat: "comma",
          addQueryPrefix: true,
        },
      ),
    ).toBe("/api/livres?genre=roman,bd");
  });

  it("lève une RangeError pour une date invalide", () => {
    expect(() => buildUrl("/api", "prets", { depuis: new Date(Number.NaN) })).toThrow(RangeError);
  });
});
