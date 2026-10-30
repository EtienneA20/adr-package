import { describe, expect, it } from "vitest";

import { isEqual } from "./is-equal";

describe("isEqual", () => {
  it.each([
    [1, 1],
    ["a", "a"],
    [null, null],
    [undefined, undefined],
    [Number.NaN, Number.NaN],
    [0, -0],
  ])("considère %o et %o comme égaux", (left, right) => {
    expect(isEqual(left, right)).toBe(true);
  });

  it.each([
    [1, "1"],
    [null, undefined],
    [null, {}],
    [{}, []],
    [1, { valueOf: (): number => 1 }],
  ])("considère %o et %o comme différents", (left, right) => {
    expect(isEqual(left, right)).toBe(false);
  });

  it("compare les objets simples en profondeur, sans tenir compte de l'ordre des clés", () => {
    expect(isEqual({ a: 1, b: { c: [1, 2] } }, { b: { c: [1, 2] }, a: 1 })).toBe(true);
    expect(isEqual({ a: 1, b: { c: [1, 2] } }, { a: 1, b: { c: [1, 3] } })).toBe(false);
    expect(isEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false);
    expect(isEqual({ a: undefined }, { b: undefined })).toBe(false);
  });

  it("compare les tableaux élément par élément", () => {
    expect(isEqual([1, [2, 3]], [1, [2, 3]])).toBe(true);
    expect(isEqual([1, 2], [2, 1])).toBe(false);
    expect(isEqual([1], [1, 1])).toBe(false);
  });

  it("compare les dates et les expressions régulières", () => {
    expect(isEqual(new Date(2026, 0, 15), new Date(2026, 0, 15))).toBe(true);
    expect(isEqual(new Date(2026, 0, 15), new Date(2026, 0, 16))).toBe(false);
    expect(isEqual(new Date(Number.NaN), new Date(Number.NaN))).toBe(true);
    expect(isEqual(/a/g, /a/g)).toBe(true);
    expect(isEqual(/a/g, /a/i)).toBe(false);
  });

  it("compare les Map et les Set", () => {
    expect(isEqual(new Map([["a", { n: 1 }]]), new Map([["a", { n: 1 }]]))).toBe(true);
    expect(isEqual(new Map([["a", 1]]), new Map([["b", 1]]))).toBe(false);
    expect(isEqual(new Map([["a", 1]]), new Map([["a", 2]]))).toBe(false);
    expect(isEqual(new Set([1, 2]), new Set([2, 1]))).toBe(true);
    expect(isEqual(new Set([{ n: 1 }]), new Set([{ n: 1 }]))).toBe(true);
    expect(isEqual(new Set([{ n: 1 }]), new Set([{ n: 2 }]))).toBe(false);
    expect(isEqual(new Set([1]), new Set([1, 2]))).toBe(false);
  });

  it("distingue les objets de prototypes différents", () => {
    class Book {
      title = "Germinal";
    }
    expect(isEqual(new Book(), { title: "Germinal" })).toBe(false);
    expect(isEqual(new Book(), new Book())).toBe(true);
  });

  it("compare les fonctions par référence", () => {
    const format = (): string => "x";
    expect(isEqual(format, format)).toBe(true);
    expect(isEqual(format, (): string => "x")).toBe(false);
  });

  it("gère les références circulaires", () => {
    interface INode {
      name: string;
      self?: INode;
    }
    const left: INode = { name: "a" };
    left.self = left;
    const right: INode = { name: "a" };
    right.self = right;
    expect(isEqual(left, right)).toBe(true);
    const other: INode = { name: "b" };
    other.self = other;
    expect(isEqual(left, other)).toBe(false);
  });
});
