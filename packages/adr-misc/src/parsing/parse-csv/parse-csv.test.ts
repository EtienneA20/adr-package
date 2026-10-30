import { describe, expect, expectTypeOf, it } from "vitest";

import { parseCsv } from "./parse-csv";

describe("parseCsv", () => {
  it("lit un CSV simple séparé par des points-virgules", () => {
    expect(parseCsv("titre;auteur\nGerminal;Zola")).toEqual([
      ["titre", "auteur"],
      ["Germinal", "Zola"],
    ]);
  });

  it("gère les guillemets, guillemets doublés, séparateurs et retours à la ligne dans les champs", () => {
    const text = 'titre;résumé\n"Le ""Horla""";"Un récit;\nfantastique"\n';
    expect(parseCsv(text)).toEqual([
      ["titre", "résumé"],
      ['Le "Horla"', "Un récit;\nfantastique"],
    ]);
  });

  it("accepte les fins de ligne \\r\\n et \\r", () => {
    expect(parseCsv("a;b\r\n1;2\r\n")).toEqual([
      ["a", "b"],
      ["1", "2"],
    ]);
    expect(parseCsv("a;b\r1;2")).toEqual([
      ["a", "b"],
      ["1", "2"],
    ]);
  });

  it("retire le BOM UTF-8", () => {
    expect(parseCsv("\ufefftitre;auteur")).toEqual([["titre", "auteur"]]);
  });

  it("détecte le séparateur le plus fréquent de la première ligne", () => {
    expect(parseCsv("a,b,c\n1,2,3")).toEqual([
      ["a", "b", "c"],
      ["1", "2", "3"],
    ]);
    expect(parseCsv("a\tb\n1\t2")).toEqual([
      ["a", "b"],
      ["1", "2"],
    ]);
    expect(parseCsv('"x;y",b,c\n1,2,3')[0]).toEqual(["x;y", "b", "c"]);
  });

  it("préfère le point-virgule en cas d'égalité ou d'absence de séparateur", () => {
    expect(parseCsv("a;b,c")).toEqual([["a", "b,c"]]);
    expect(parseCsv("seul\n1,5")).toEqual([["seul"], ["1,5"]]);
  });

  it("utilise le séparateur imposé", () => {
    expect(parseCsv("a;b,c", { delimiter: "," })).toEqual([["a;b", "c"]]);
  });

  it("conserve les champs vides", () => {
    expect(parseCsv(";a;;\n")).toEqual([["", "a", "", ""]]);
  });

  it("ignore les lignes vides par défaut, ou les conserve sur demande", () => {
    expect(parseCsv("a\n\nb\n")).toEqual([["a"], ["b"]]);
    expect(parseCsv("a\n\nb\n", { skipEmptyLines: false })).toEqual([["a"], [""], ["b"]]);
  });

  it("renvoie un tableau vide pour un contenu vide", () => {
    expect(parseCsv("")).toEqual([]);
    expect(parseCsv("\ufeff")).toEqual([]);
  });

  it("lit un guillemet non fermé jusqu'à la fin sans lever d'erreur", () => {
    expect(parseCsv('a;"non fermé\nsuite')).toEqual([["a", "non fermé\nsuite"]]);
  });

  it("conserve les caractères qui suivent un guillemet fermant", () => {
    expect(parseCsv('"a"b;c')).toEqual([["ab", "c"]]);
  });

  it("renvoie des objets indexés par les en-têtes avec headers: true", () => {
    const records = parseCsv("titre;auteur;année\nGerminal;Zola;1885\nNana;Zola", {
      headers: true,
    });
    expect(records).toEqual([
      { titre: "Germinal", auteur: "Zola", année: "1885" },
      { titre: "Nana", auteur: "Zola", année: "" },
    ]);
    expectTypeOf(records).toEqualTypeOf<Record<string, string>[]>();
  });

  it("ignore les champs en trop avec headers: true", () => {
    expect(parseCsv("a\n1;2", { headers: true })).toEqual([{ a: "1" }]);
    expect(parseCsv("", { headers: true })).toEqual([]);
  });

  it("type le résultat en lignes de chaînes sans headers", () => {
    expectTypeOf(parseCsv("a")).toEqualTypeOf<string[][]>();
  });

  it.each([";;", "", '"', "\n", "\r"])("lève une RangeError pour le séparateur %j", (delimiter) => {
    expect(() => parseCsv("a", { delimiter })).toThrow(RangeError);
  });

  it("explique l'erreur de séparateur en français", () => {
    expect(() => parseCsv("a", { delimiter: '"' })).toThrow(/Séparateur CSV invalide/);
  });
});
