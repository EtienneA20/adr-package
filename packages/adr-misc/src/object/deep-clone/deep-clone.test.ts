import { describe, expect, expectTypeOf, it } from "vitest";

import { deepClone } from "./deep-clone";

describe("deepClone", () => {
  it("copie en profondeur les objets simples et les tableaux", () => {
    const member = { name: "Léa", address: { city: "Paris" }, loans: [{ bookId: "b-1" }] };
    const copy = deepClone(member);
    expect(copy).toEqual(member);
    expect(copy.address).not.toBe(member.address);
    expect(copy.loans[0]).not.toBe(member.loans[0]);
    copy.address.city = "Lyon";
    expect(member.address.city).toBe("Paris");
  });

  it("recrée les dates et les expressions régulières", () => {
    const source = { date: new Date(2026, 0, 15), pattern: /isbn-(\d+)/gi };
    const copy = deepClone(source);
    expect(copy.date).toEqual(source.date);
    expect(copy.date).not.toBe(source.date);
    expect(copy.pattern).not.toBe(source.pattern);
    expect(copy.pattern.source).toBe("isbn-(\\d+)");
    expect(copy.pattern.flags).toBe("gi");
  });

  it("copie les Map et les Set avec leur contenu", () => {
    const key = { id: 1 };
    const source = { map: new Map([[key, { stock: 2 }]]), set: new Set([{ tag: "roman" }]) };
    const copy = deepClone(source);
    expect(copy.map).not.toBe(source.map);
    expect([...copy.map.values()]).toEqual([{ stock: 2 }]);
    expect([...copy.map.keys()][0]).not.toBe(key);
    expect([...copy.set]).toEqual([{ tag: "roman" }]);
    expect([...copy.set][0]).not.toBe([...source.set][0]);
  });

  it("préserve les références circulaires et partagées", () => {
    interface INode {
      name: string;
      self?: INode;
      list: INode[];
    }
    const node: INode = { name: "racine", list: [] };
    node.self = node;
    node.list.push(node, node);
    const copy = deepClone(node);
    expect(copy).not.toBe(node);
    expect(copy.self).toBe(copy);
    expect(copy.list[0]).toBe(copy);
    expect(copy.list[1]).toBe(copy);
  });

  it("préserve un prototype nul et copie la clé __proto__ comme propriété propre", () => {
    const bare = Object.create(null) as Record<string, unknown>;
    bare.a = 1;
    expect(Object.getPrototypeOf(deepClone(bare))).toBeNull();
    const parsed = JSON.parse('{"__proto__": {"polluted": true}}') as object;
    const copy = deepClone(parsed);
    expect(Object.getPrototypeOf(copy)).toBe(Object.prototype);
    expect(Object.hasOwn(copy, "__proto__")).toBe(true);
  });

  it("renvoie les primitives et les objets non pris en charge tels quels", () => {
    class Book {
      title = "Germinal";
    }
    const book = new Book();
    const format = (): string => "x";
    expect(deepClone(42)).toBe(42);
    expect(deepClone(null)).toBeNull();
    expect(deepClone({ book }).book).toBe(book);
    expect(deepClone(format)).toBe(format);
  });

  it("conserve le type de la valeur", () => {
    expectTypeOf(deepClone({ a: [1] })).toEqualTypeOf<{ a: number[] }>();
  });
});
