import { describe, expect, expectTypeOf, it } from "vitest";

import { pick } from "./pick";

interface IBook {
  id: number;
  title: string;
  subtitle?: string;
  stock: number;
}

const book: IBook = { id: 1, title: "Germinal", stock: 3 };

describe("pick", () => {
  it("conserve seulement les clés demandées", () => {
    expect(pick(book, ["id", "title"])).toEqual({ id: 1, title: "Germinal" });
  });

  it("n'ajoute pas les clés absentes de l'objet", () => {
    expect(Object.keys(pick(book, ["id", "subtitle"]))).toEqual(["id"]);
  });

  it("conserve les clés symboles demandées", () => {
    const tag = Symbol("tag");
    expect(pick({ [tag]: "x", other: 1 }, [tag])).toEqual({ [tag]: "x" });
  });

  it("renvoie un objet vide sans clé", () => {
    expect(pick(book, [])).toEqual({});
  });

  it("ne modifie pas l'objet d'origine", () => {
    const frozen = Object.freeze({ ...book });
    pick(frozen, ["id"]);
    expect(frozen).toEqual(book);
  });

  it("type le résultat avec Pick", () => {
    expectTypeOf(pick(book, ["id", "title"])).toEqualTypeOf<Pick<IBook, "id" | "title">>();
  });
});
