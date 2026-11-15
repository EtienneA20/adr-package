import { strFromU8, unzipSync } from "fflate";
import { describe, expect, it } from "vitest";

import { toXlsxExport } from "./to-xlsx-export";
import { ExportLimitExceededException, defineExportColumns } from "../../export";

interface IBook {
  title: string;
  price: number | null;
  publishedAt: string;
  borrowedAt?: string;
  available: boolean;
  code: string;
}

const columns = defineExportColumns<IBook>([
  { key: "title", header: "Titre", width: 40 },
  { key: "price", header: "Prix", type: "currency" },
  { key: "publishedAt", header: "Publication", type: "date" },
  { key: "borrowedAt", header: "Emprunt", type: "datetime" },
  { key: "available", header: "Disponible", type: "boolean" },
  { key: "code", header: "Code", trusted: true },
]);

const books: IBook[] = [
  {
    title: "Germinal & <Zola>",
    price: 8.5,
    publishedAt: "1985-03-02",
    borrowedAt: "2026-01-31T23:00:00Z",
    available: true,
    code: "=A1",
  },
  {
    title: '=HYPERLINK("https://pirate.example","Clic")',
    price: null,
    publishedAt: "1862-04-03",
    available: false,
    code: "B",
  },
  { title: "＠SUM(A1)", price: -3, publishedAt: "x", available: true, code: "C" },
];

async function unzip(chunks: AsyncIterable<Uint8Array>): Promise<Record<string, string>> {
  const parts: Uint8Array[] = [];
  for await (const chunk of chunks) parts.push(chunk);
  const archive = new Uint8Array(parts.reduce((size, part) => size + part.length, 0));
  let offset = 0;
  for (const part of parts) {
    archive.set(part, offset);
    offset += part.length;
  }
  return Object.fromEntries(
    Object.entries(unzipSync(archive)).map(([path, data]) => [path, strFromU8(data)]),
  );
}

describe("toXlsxExport", () => {
  it("produit une archive XLSX valide avec ses parties", async () => {
    const files = await unzip(toXlsxExport(books, columns, { sheetName: "Catalogue" }));
    expect(Object.keys(files).sort()).toEqual([
      "[Content_Types].xml",
      "_rels/.rels",
      "xl/_rels/workbook.xml.rels",
      "xl/styles.xml",
      "xl/workbook.xml",
      "xl/worksheets/sheet1.xml",
    ]);
    expect(files["xl/workbook.xml"]).toContain('name="Catalogue"');
  });

  it("écrit l'en-tête en gras, des cellules typées et le filtre automatique", async () => {
    const sheet = (await unzip(toXlsxExport(books, columns)))["xl/worksheets/sheet1.xml"] ?? "";
    expect(sheet).toContain(
      '<c r="A1" t="inlineStr" s="1"><is><t xml:space="preserve">Titre</t></is></c>',
    );
    expect(sheet).toContain('<col min="1" max="1" width="40" customWidth="1"/>');
    expect(sheet).toContain(
      '<c r="A2" t="inlineStr"><is><t xml:space="preserve">Germinal &amp; &lt;Zola&gt;</t></is></c>',
    );
    expect(sheet).toContain('<c r="B2" s="4"><v>8.5</v></c>');
    expect(sheet).toContain('<c r="C2" s="2"><v>31108</v></c>');
    expect(sheet).toContain('<c r="D2" s="3"><v>46054</v></c>');
    expect(sheet).toContain('<c r="E2" t="b"><v>1</v></c>');
    expect(sheet).toContain('<autoFilter ref="A1:F4"/>');
  });

  it("écrit en texte une date antérieure à 1900 et omet les cellules vides", async () => {
    const sheet = (await unzip(toXlsxExport(books, columns)))["xl/worksheets/sheet1.xml"] ?? "";
    expect(sheet).toContain(
      '<c r="C3" t="inlineStr"><is><t xml:space="preserve">03/04/1862</t></is></c>',
    );
    expect(sheet).not.toContain('r="B3"');
    expect(sheet).not.toContain('r="C4"');
  });

  it("n'écrit jamais de formule et protège les textes qui y ressemblent", async () => {
    const sheet = (await unzip(toXlsxExport(books, columns)))["xl/worksheets/sheet1.xml"] ?? "";
    expect(sheet).not.toMatch(/<f[ >]/);
    expect(sheet).toContain(
      '<c r="A3" t="inlineStr" s="5"><is><t xml:space="preserve">=HYPERLINK(&quot;https://pirate.example&quot;,&quot;Clic&quot;)</t></is></c>',
    );
    expect(sheet).toContain(
      '<c r="A4" t="inlineStr" s="5"><is><t xml:space="preserve">＠SUM(A1)</t></is></c>',
    );
    expect(sheet).toContain('<c r="F2" t="inlineStr"><is><t xml:space="preserve">=A1</t></is></c>');
    expect(sheet).toContain('<c r="B4" s="4"><v>-3</v></c>');
  });

  it("produit le flux par blocs pour un gros volume", async () => {
    async function* many(): AsyncGenerator<IBook> {
      for (let index = 0; index < 5000; index += 1)
        yield await Promise.resolve({ ...books[0], title: `Livre ${index}` } as IBook);
    }
    const chunks: Uint8Array[] = [];
    for await (const chunk of toXlsxExport(many(), columns)) chunks.push(chunk);
    expect(chunks.length).toBeGreaterThan(2);
    async function* replay(): AsyncGenerator<Uint8Array> {
      for (const chunk of chunks) yield await Promise.resolve(chunk);
    }
    const sheet = (await unzip(replay()))["xl/worksheets/sheet1.xml"] ?? "";
    expect(sheet).toContain('<autoFilter ref="A1:F5001"/>');
  });

  it("s'interrompt au-delà de la limite", async () => {
    await expect(unzip(toXlsxExport(books, columns, { maxRows: 2 }))).rejects.toBeInstanceOf(
      ExportLimitExceededException,
    );
  });
});
