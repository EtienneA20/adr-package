import { describe, expect, it } from "vitest";

import { parseQueryString } from "./parse-query-string";

describe("parseQueryString", () => {
  it("analyse une query string avec ou sans ? initial", () => {
    expect(parseQueryString("?q=Hugo&page=2")).toEqual({ q: "Hugo", page: "2" });
    expect(parseQueryString("q=Hugo&page=2")).toEqual({ q: "Hugo", page: "2" });
  });

  it("décode les composants et le signe +", () => {
    expect(parseQueryString("q=Victor+Hugo&titre=Les%20Mis%C3%A9rables&a%3Db=%3F")).toEqual({
      q: "Victor Hugo",
      titre: "Les Misérables",
      "a=b": "?",
    });
  });

  it("regroupe les clés répétées dans un tableau", () => {
    expect(parseQueryString("genre=roman&genre=bd&genre=manga")).toEqual({
      genre: ["roman", "bd", "manga"],
    });
  });

  it("renvoie toujours un tableau pour une clé suffixée par []", () => {
    expect(parseQueryString("genre[]=roman")).toEqual({ genre: ["roman"] });
    expect(parseQueryString("genre%5B%5D=roman&genre%5B%5D=bd")).toEqual({
      genre: ["roman", "bd"],
    });
  });

  it("donne une chaîne vide à une clé sans valeur", () => {
    expect(parseQueryString("disponible&q=")).toEqual({ disponible: "", q: "" });
  });

  it("ne coupe la valeur qu'au premier =", () => {
    expect(parseQueryString("filtre=a=b")).toEqual({ filtre: "a=b" });
  });

  it("ignore les segments vides", () => {
    expect(parseQueryString("")).toEqual({});
    expect(parseQueryString("?")).toEqual({});
    expect(parseQueryString("&&q=Hugo&")).toEqual({ q: "Hugo" });
  });

  it("conserve tel quel un encodage invalide sans lever d'erreur", () => {
    expect(parseQueryString("q=%E9t%C3%A9&r=100%")).toEqual({ q: "%E9t%C3%A9", r: "100%" });
  });

  it("ne pollue pas le prototype avec une clé __proto__", () => {
    const parsed = parseQueryString("__proto__=x&constructor=y");
    expect(Object.keys(parsed)).toEqual(["__proto__", "constructor"]);
    expect(Object.getPrototypeOf(parsed)).toBe(Object.prototype);
    expect(({} as Record<string, unknown>).x).toBeUndefined();
  });
});
