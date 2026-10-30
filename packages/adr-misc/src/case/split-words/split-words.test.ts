import { describe, expect, it } from "vitest";

import { splitWords } from "./split-words";

describe("splitWords", () => {
  it.each([
    ["userName", ["user", "Name"]],
    ["UserName", ["User", "Name"]],
    ["user-name", ["user", "name"]],
    ["user_name", ["user", "name"]],
    ["USER_NAME", ["USER", "NAME"]],
    ["user name", ["user", "name"]],
    ["user.name", ["user", "name"]],
  ])("découpe « %s » en mots", (value, expected) => {
    expect(splitWords(value)).toEqual(expected);
  });

  it("isole les sigles en tête ou au milieu d'un identifiant", () => {
    expect(splitWords("XMLHttpRequest")).toEqual(["XML", "Http", "Request"]);
    expect(splitWords("loadHTMLPage")).toEqual(["load", "HTML", "Page"]);
    expect(splitWords("userID")).toEqual(["user", "ID"]);
  });

  it("laisse les chiffres collés au mot qui les précède", () => {
    expect(splitWords("base64Encode")).toEqual(["base64", "Encode"]);
    expect(splitWords("tome 2")).toEqual(["tome", "2"]);
    expect(splitWords("h1")).toEqual(["h1"]);
  });

  it("conserve les lettres accentuées et les ligatures", () => {
    expect(splitWords("Prénom de l’adhérent")).toEqual(["Prénom", "de", "l", "adhérent"]);
    expect(splitWords("cœurÉlève")).toEqual(["cœur", "Élève"]);
  });

  it("conserve les accents combinants (texte décomposé NFD)", () => {
    expect(splitWords("e\u0301le\u0300ve")).toEqual(["e\u0301le\u0300ve"]);
  });

  it("ignore les séparateurs en tête, en fin et répétés", () => {
    expect(splitWords("  --__user   name__--  ")).toEqual(["user", "name"]);
  });

  it("renvoie un tableau vide pour un texte sans mot", () => {
    expect(splitWords("")).toEqual([]);
    expect(splitWords(" - _ ")).toEqual([]);
  });
});
