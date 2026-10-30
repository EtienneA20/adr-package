import { describe, expect, it } from "vitest";

import { buildQueryString } from "./build-query-string";

describe("buildQueryString", () => {
  it("sérialise les valeurs simples en conservant l'ordre des clés", () => {
    expect(buildQueryString({ q: "Hugo", page: 2, disponible: true })).toBe(
      "q=Hugo&page=2&disponible=true",
    );
  });

  it("encode les clés et les valeurs", () => {
    expect(buildQueryString({ "titre exact": "Les Misérables & co", "a=b": "?" })).toBe(
      "titre%20exact=Les%20Mis%C3%A9rables%20%26%20co&a%3Db=%3F",
    );
  });

  it("ignore les valeurs null et undefined, y compris dans les tableaux", () => {
    expect(
      buildQueryString({ auteur: undefined, editeur: null, genre: ["roman", null, undefined] }),
    ).toBe("genre=roman");
  });

  it("conserve les chaînes vides, zéro et false", () => {
    expect(buildQueryString({ q: "", page: 0, reserve: false })).toBe("q=&page=0&reserve=false");
  });

  it("sérialise les dates en ISO 8601", () => {
    const date = new Date(Date.UTC(2026, 9, 28, 14, 30));
    expect(buildQueryString({ depuis: date })).toBe("depuis=2026-10-28T14%3A30%3A00.000Z");
  });

  it("répète la clé pour les tableaux par défaut", () => {
    expect(buildQueryString({ genre: ["roman", "bd"] })).toBe("genre=roman&genre=bd");
  });

  it("utilise des crochets avec arrayFormat brackets", () => {
    expect(buildQueryString({ genre: ["roman", "bd"], page: 1 }, { arrayFormat: "brackets" })).toBe(
      "genre[]=roman&genre[]=bd&page=1",
    );
  });

  it("joint les valeurs par des virgules avec arrayFormat comma", () => {
    expect(buildQueryString({ genre: ["roman", "bd, manga"] }, { arrayFormat: "comma" })).toBe(
      "genre=roman,bd%2C%20manga",
    );
  });

  it("ignore les tableaux vides", () => {
    expect(buildQueryString({ genre: [], page: 1 }, { arrayFormat: "comma" })).toBe("page=1");
  });

  it("ajoute le préfixe ? seulement si la query string n'est pas vide", () => {
    expect(buildQueryString({ page: 1 }, { addQueryPrefix: true })).toBe("?page=1");
    expect(buildQueryString({ page: undefined }, { addQueryPrefix: true })).toBe("");
    expect(buildQueryString({})).toBe("");
  });

  it("lève une RangeError pour une date invalide", () => {
    expect(() => buildQueryString({ depuis: new Date("invalide") })).toThrow(
      new RangeError("Date invalide pour le paramètre « depuis » de la query string"),
    );
  });
});
