import { describe, expect, expectTypeOf, it } from "vitest";

import { removeUndefined } from "./remove-undefined";

describe("removeUndefined", () => {
  it("retire les clés undefined et conserve null", () => {
    const result = removeUndefined({ title: "Germinal", author: undefined, year: null });
    expect(result).toEqual({ title: "Germinal", year: null });
    expect(Object.keys(result)).toEqual(["title", "year"]);
  });

  it("ne nettoie pas les objets imbriqués par défaut", () => {
    const filters = { genre: undefined };
    const result = removeUndefined({ filters });
    expect(result.filters).toBe(filters);
  });

  it("nettoie les objets imbriqués et ceux des tableaux en mode profond", () => {
    const result = removeUndefined(
      { filters: { genre: undefined, available: true }, list: [{ a: undefined, b: 1 }, undefined] },
      { deep: true },
    );
    expect(result).toEqual({ filters: { available: true }, list: [{ b: 1 }, undefined] });
    expect(Object.keys(result.filters)).toEqual(["available"]);
  });

  it("garde les objets non simples tels quels", () => {
    const date = new Date(2026, 0, 15);
    expect(removeUndefined({ date }, { deep: true }).date).toBe(date);
  });

  it("accepte un tableau racine sans retirer ses éléments", () => {
    expect(removeUndefined([undefined, { a: undefined }], { deep: true })).toEqual([undefined, {}]);
  });

  it("ne modifie pas l'objet d'origine", () => {
    const source = Object.freeze({ a: undefined, b: 1 });
    const result = removeUndefined(source);
    expect(result).not.toBe(source);
    expect(Object.keys(source)).toEqual(["a", "b"]);
  });

  it("conserve le type de l'objet", () => {
    const book: { a: number | undefined } = { a: 1 };
    expectTypeOf(removeUndefined(book)).toEqualTypeOf<{ a: number | undefined }>();
  });
});
