import { describe, expect, it } from "vitest";

import { unflattenObject } from "./unflatten-object";

describe("unflattenObject", () => {
  it("reconstruit les objets imbriqués", () => {
    expect(unflattenObject({ "a.b": 1, "a.c.d": 2, e: 3 })).toEqual({
      a: { b: 1, c: { d: 2 } },
      e: 3,
    });
  });

  it("crée des tableaux pour les segments numériques", () => {
    expect(unflattenObject({ "items.0.title": "Germinal", "items.1": "Nana" })).toEqual({
      items: [{ title: "Germinal" }, "Nana"],
    });
  });

  it("utilise le séparateur fourni", () => {
    expect(unflattenObject({ author_name: "Zola" }, "_")).toEqual({ author: { name: "Zola" } });
  });

  it("remplace une valeur simple par un conteneur si un chemin plus long suit", () => {
    expect(unflattenObject({ a: 1, "a.b": 2 })).toEqual({ a: { b: 2 } });
  });

  it("ignore les chemins dangereux", () => {
    const result = unflattenObject({
      "__proto__.polluted": true,
      "constructor.prototype.polluted": true,
      safe: 1,
    });
    expect(result).toEqual({ safe: 1 });
    expect(({} as Record<string, unknown>).polluted).toBeUndefined();
  });

  it("ne modifie pas l'objet d'origine", () => {
    const flat = Object.freeze({ "a.b": 1 });
    unflattenObject(flat);
    expect(flat).toEqual({ "a.b": 1 });
  });

  it("renvoie un objet vide pour un objet vide", () => {
    expect(unflattenObject({})).toEqual({});
  });
});
