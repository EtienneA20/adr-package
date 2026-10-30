import { describe, expect, it } from "vitest";

import { parseCsv } from "../parse-csv";
import { toCsv } from "./to-csv";

describe("toCsv", () => {
  it("écrit des objets avec une ligne d'en-têtes, au format Excel français par défaut", () => {
    const csv = toCsv([
      { titre: "Germinal", auteur: "Zola", prix: 8.5 },
      { titre: "Nana", auteur: "Zola", prix: 4 },
    ]);
    expect(csv).toBe("titre;auteur;prix\r\nGerminal;Zola;8,5\r\nNana;Zola;4");
  });

  it("réunit les clés de toutes les lignes dans l'ordre d'apparition", () => {
    expect(toCsv([{ a: 1 }, { b: 2, a: 3 }])).toBe("a;b\r\n1;\r\n3;2");
  });

  it("utilise les colonnes fournies pour choisir et ordonner les clés", () => {
    expect(toCsv([{ a: 1, b: 2, c: 3 }], { columns: ["c", "a"] })).toBe("c;a\r\n3;1");
  });

  it("écrit des lignes tableaux, avec en-têtes si des colonnes sont fournies", () => {
    expect(toCsv([["a", 1]])).toBe("a;1");
    expect(toCsv([["a", 1]], { columns: ["lettre", "nombre"] })).toBe("lettre;nombre\r\na;1");
  });

  it("omet la ligne d'en-têtes sur demande", () => {
    expect(toCsv([{ a: 1 }], { includeHeader: false })).toBe("1");
  });

  it("met entre guillemets les cellules contenant le séparateur, un guillemet ou un retour à la ligne", () => {
    expect(toCsv([['Le "Horla"', "a;b", "ligne\nsuivante", "a\rb", "simple"]])).toBe(
      '"Le ""Horla""";"a;b";"ligne\nsuivante";"a\rb";simple',
    );
  });

  it("respecte le séparateur, la fin de ligne et le séparateur décimal fournis", () => {
    const csv = toCsv([{ a: "x,y", b: 1.5 }], {
      delimiter: ",",
      lineSeparator: "\n",
      decimalSeparator: ".",
    });
    expect(csv).toBe('a,b\n"x,y",1.5');
  });

  it("ajoute le BOM UTF-8 sur demande", () => {
    expect(toCsv([["é"]], { bom: true })).toBe("\ufeffé");
  });

  it("convertit les valeurs non textuelles", () => {
    const date = new Date(Date.UTC(2026, 0, 15, 10, 30));
    const row = [null, undefined, true, 10n, date, new Date(Number.NaN), Number.NaN, { id: 1 }];
    expect(toCsv([row], { delimiter: "|" })).toBe(
      '||true|10|2026-01-15T10:30:00.000Z|||"{""id"":1}"',
    );
    expect(toCsv([[Symbol("s"), () => 1]])).toBe(";");
  });

  it("neutralise les formules sur demande, sans toucher aux nombres", () => {
    const row = ["=SOMME(A1:A2)", "+33", "-x", "@cmd", "texte", -5];
    expect(toCsv([row], { escapeFormulas: true })).toBe("'=SOMME(A1:A2);'+33;'-x;'@cmd;texte;-5");
    expect(toCsv([["=1+1"]])).toBe("=1+1");
  });

  it("renvoie une chaîne vide sans ligne", () => {
    expect(toCsv([])).toBe("");
  });

  it("produit un contenu relu à l'identique par parseCsv", () => {
    const rows = [
      ["titre", "résumé"],
      ['Le "Horla"', "Récit;\r\nfantastique"],
    ];
    expect(parseCsv(toCsv(rows))).toEqual(rows);
  });

  it.each([";;", "", '"', "\n"])("lève une RangeError pour le séparateur %j", (delimiter) => {
    expect(() => toCsv([["a"]], { delimiter })).toThrow(RangeError);
  });
});
