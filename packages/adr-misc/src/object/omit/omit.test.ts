import { describe, expect, expectTypeOf, it } from "vitest";

import { omit } from "./omit";

interface IMember {
  id: number;
  email: string;
  password: string;
}

const member: IMember = { id: 1, email: "lea@exemple.fr", password: "secret" };

describe("omit", () => {
  it("retire les clés indiquées", () => {
    expect(omit(member, ["password"])).toEqual({ id: 1, email: "lea@exemple.fr" });
  });

  it("accepte des clés numériques", () => {
    const shelves: Record<number, string> = { 1: "romans", 2: "essais" };
    expect(omit(shelves, [1])).toEqual({ 2: "essais" });
  });

  it("renvoie une copie complète sans clé", () => {
    const result = omit(member, []);
    expect(result).toEqual(member);
    expect(result).not.toBe(member);
  });

  it("ne modifie pas l'objet d'origine", () => {
    const frozen = Object.freeze({ ...member });
    omit(frozen, ["id"]);
    expect(frozen).toEqual(member);
  });

  it("type le résultat avec Omit", () => {
    expectTypeOf(omit(member, ["password"])).toEqualTypeOf<Omit<IMember, "password">>();
  });
});
