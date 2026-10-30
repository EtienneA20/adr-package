import { describe, expect, it } from "vitest";

import { flattenObject } from "./flatten-object";

describe("flattenObject", () => {
  it("aplatit les objets imbriqués avec des chemins pointés", () => {
    expect(flattenObject({ a: { b: 1, c: { d: 2 } }, e: 3 })).toEqual({
      "a.b": 1,
      "a.c.d": 2,
      e: 3,
    });
  });

  it("aplatit les tableaux avec leurs index", () => {
    expect(flattenObject({ items: [{ title: "Germinal" }, "Nana"] })).toEqual({
      "items.0.title": "Germinal",
      "items.1": "Nana",
    });
  });

  it("utilise le séparateur fourni", () => {
    expect(flattenObject({ author: { name: "Zola" } }, "_")).toEqual({ author_name: "Zola" });
  });

  it("garde les conteneurs vides et les objets non simples comme feuilles", () => {
    const date = new Date(2026, 0, 15);
    const result = flattenObject({ tags: [], meta: {}, date, nothing: null });
    expect(result).toEqual({ tags: [], meta: {}, date, nothing: null });
    expect(result.date).toBe(date);
  });

  it("aplatit un tableau racine", () => {
    expect(flattenObject([{ a: 1 }])).toEqual({ "0.a": 1 });
  });

  it("stocke la clé __proto__ comme propriété propre", () => {
    const result = flattenObject(JSON.parse('{"__proto__": 1}') as object);
    expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
    expect(Object.hasOwn(result, "__proto__")).toBe(true);
  });

  it("renvoie un objet vide pour un objet vide", () => {
    expect(flattenObject({})).toEqual({});
  });
});
