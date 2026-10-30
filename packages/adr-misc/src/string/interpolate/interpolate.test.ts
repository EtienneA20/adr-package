import { describe, expect, it } from "vitest";

import { interpolate } from "./interpolate";

describe("interpolate", () => {
  it("remplace chaque marqueur par sa valeur", () => {
    expect(
      interpolate("Bonjour {prenom}, {nombre} livre(s) en retard.", { prenom: "Inès", nombre: 2 }),
    ).toBe("Bonjour Inès, 2 livre(s) en retard.");
  });

  it("convertit les nombres, grands entiers et booléens avec String()", () => {
    expect(interpolate("{a} {b} {c}", { a: 1.5, b: 10n, c: false })).toBe("1.5 10 false");
  });

  it("remplace plusieurs occurrences de la même clé", () => {
    expect(interpolate("{x} et {x}", { x: "A" })).toBe("A et A");
  });

  it("accepte des espaces autour de la clé et des clés accentuées", () => {
    expect(interpolate("{ prénom } {date_retour}", { prénom: "Zoé", date_retour: "12/03" })).toBe(
      "Zoé 12/03",
    );
  });

  it("laisse intact ce qui n'est pas un marqueur", () => {
    expect(interpolate('{"a": 1} {} {a b}', { a: "x" })).toBe('{"a": 1} {} {a b}');
  });

  it("laisse les marqueurs des clés absentes par défaut", () => {
    expect(interpolate("Bonjour {prenom} {nom}", { nom: null })).toBe("Bonjour {prenom} {nom}");
  });

  it("ne lit pas les propriétés héritées du prototype", () => {
    expect(interpolate("{toString} {constructor}", {})).toBe("{toString} {constructor}");
  });

  it("vide les marqueurs des clés absentes avec missing à empty", () => {
    expect(
      interpolate(
        "Bonjour {prenom} {nom}",
        { nom: "Dupont", prenom: undefined },
        { missing: "empty" },
      ),
    ).toBe("Bonjour  Dupont");
  });

  it("lève une erreur pour une clé absente avec missing à throw", () => {
    expect(() => interpolate("Bonjour {prenom}", {}, { missing: "throw" })).toThrow(
      new Error("Valeur manquante pour la clé « prenom » du modèle."),
    );
  });

  it("ne lève rien avec missing à throw quand toutes les clés sont fournies", () => {
    expect(interpolate("Bonjour {prenom}", { prenom: "Léa" }, { missing: "throw" })).toBe(
      "Bonjour Léa",
    );
  });
});
