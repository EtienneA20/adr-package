import { describe, expect, it } from "vitest";

import {
  columnName,
  escapeXml,
  sheetEnd,
  sheetName,
  sheetStart,
  xlsxStaticParts,
} from "./xlsx-parts";

describe("escapeXml", () => {
  it("échappe les caractères spéciaux et retire les caractères interdits", () => {
    expect(escapeXml(`<a href="x">Tom & 'Jerry'</a>`)).toBe(
      "&lt;a href=&quot;x&quot;&gt;Tom &amp; &apos;Jerry&apos;&lt;/a&gt;",
    );
    expect(escapeXml("a\u0000b\u0007c\td\ne")).toBe("abc\td\ne");
  });
});

describe("columnName", () => {
  it.each([
    [0, "A"],
    [25, "Z"],
    [26, "AA"],
    [51, "AZ"],
    [701, "ZZ"],
    [702, "AAA"],
  ])("donne le nom de la colonne %i : %s", (index, name) => {
    expect(columnName(index)).toBe(name);
  });
});

describe("sheetName", () => {
  it("retire les caractères interdits et limite à 31 caractères", () => {
    expect(sheetName("Prêts [2026] : retards?")).toBe("Prêts  2026    retards");
    expect(sheetName("x".repeat(40))).toHaveLength(31);
    expect(sheetName(undefined)).toBe("Export");
    expect(sheetName(" / ")).toBe("Export");
  });
});

describe("parties du classeur", () => {
  it("déclare le classeur, l'onglet et les styles", () => {
    const parts = new Map(xlsxStaticParts("Catalogue & co"));
    expect([...parts.keys()]).toEqual([
      "[Content_Types].xml",
      "_rels/.rels",
      "xl/workbook.xml",
      "xl/_rels/workbook.xml.rels",
      "xl/styles.xml",
    ]);
    expect(parts.get("xl/workbook.xml")).toContain('name="Catalogue &amp; co"');
    expect(parts.get("xl/styles.xml")).toContain('formatCode="dd/mm/yyyy"');
    expect(parts.get("xl/styles.xml")).toContain('quotePrefix="1"');
  });

  it("encadre les données de la feuille", () => {
    expect(sheetStart([undefined, 30])).toContain(
      '<cols><col min="2" max="2" width="30" customWidth="1"/></cols>',
    );
    expect(sheetStart([undefined])).not.toContain("<cols>");
    expect(sheetEnd(3, 10)).toBe('</sheetData><autoFilter ref="A1:C10"/></worksheet>');
  });
});
