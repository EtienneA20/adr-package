import { describe, expect, expectTypeOf, it } from "vitest";

import { setPath } from "./set-path";

interface IMember {
  name: string;
  address: { city: string; zip: string };
  loans: { bookId: string }[];
}

const member: IMember = {
  name: "Léa",
  address: { city: "Paris", zip: "75001" },
  loans: [{ bookId: "b-1" }],
};

describe("setPath", () => {
  it("écrit une valeur imbriquée sans modifier l'original", () => {
    const updated = setPath(member, "address.city", "Lyon");
    expect(updated.address).toEqual({ city: "Lyon", zip: "75001" });
    expect(member.address.city).toBe("Paris");
  });

  it("partage les branches non modifiées", () => {
    const updated = setPath(member, "address.city", "Lyon");
    expect(updated).not.toBe(member);
    expect(updated.address).not.toBe(member.address);
    expect(updated.loans).toBe(member.loans);
  });

  it("écrit dans un tableau en le recopiant", () => {
    const updated = setPath(member, "loans.0.bookId", "b-2");
    expect(updated.loans).toEqual([{ bookId: "b-2" }]);
    expect(Array.isArray(updated.loans)).toBe(true);
    expect(member.loans[0]?.bookId).toBe("b-1");
  });

  it("crée les objets et tableaux intermédiaires manquants", () => {
    const data: Record<string, unknown> = {};
    expect(setPath(data, "loans.0.bookId", "b-42")).toEqual({ loans: [{ bookId: "b-42" }] });
    const scalar: Record<string, unknown> = { a: 1 };
    expect(setPath(scalar, "a.b", 2)).toEqual({ a: { b: 2 } });
    expect(data).toEqual({});
  });

  it("fonctionne sur un tableau racine et sur un objet gelé", () => {
    expect(setPath(["a", "b"], "1", "c")).toEqual(["a", "c"]);
    const frozen = Object.freeze({ a: { b: 1 } });
    expect(setPath(frozen, "a.b", 2)).toEqual({ a: { b: 2 } });
  });

  it.each(["__proto__.polluted", "constructor.prototype.polluted", "a.prototype"])(
    "lève une erreur pour le chemin dangereux %s",
    (path) => {
      const target: Record<string, unknown> = {};
      expect(() => setPath(target, path, true)).toThrow(Error);
      expect(({} as Record<string, unknown>).polluted).toBeUndefined();
    },
  );

  it("exige une valeur du type attendu au bout du chemin", () => {
    expectTypeOf(setPath(member, "address.city", "Lyon")).toEqualTypeOf<IMember>();
    expectTypeOf(setPath<IMember, "address.city">)
      .parameter(2)
      .toEqualTypeOf<string>();
  });
});
