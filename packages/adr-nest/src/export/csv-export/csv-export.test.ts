import { parseCsv } from "@etiennea20/adr-misc";
import { describe, expect, it } from "vitest";

import { defineExportColumns } from "../export-columns";
import { ExportLimitExceededException } from "../export-limit";
import { toCsvExport } from "./csv-export";

interface IBook {
  title: string;
  price: number;
  publishedAt: string;
  available: boolean;
  code: string;
}

const columns = defineExportColumns<IBook>([
  { key: "title", header: "Titre" },
  { key: "price", header: "Prix", type: "currency" },
  { key: "publishedAt", header: "Publication", type: "date" },
  { key: "available", header: "Disponible", type: "boolean" },
  { key: "code", header: "=Code", trusted: true },
]);

const books: IBook[] = [
  {
    title: "Germinal",
    price: 8.5,
    publishedAt: "1885-03-02T12:00:00Z",
    available: true,
    code: "=A1",
  },
  {
    title: '=HYPERLINK("https://pirate.example";"Clic")',
    price: -3,
    publishedAt: "x",
    available: false,
    code: "B",
  },
  { title: "＋33 6 12 34 56 78", price: 0, publishedAt: "1885-03-02", available: true, code: "C" },
];

async function text(chunks: AsyncIterable<string>): Promise<string> {
  let result = "";
  for await (const chunk of chunks) result += chunk;
  return result;
}

describe("toCsvExport", () => {
  it("écrit un CSV pour Excel en français, avec BOM", async () => {
    const csv = await text(toCsvExport(books.slice(0, 1), columns));
    expect(csv).toBe(
      "﻿Titre;Prix;Publication;Disponible;'=Code\r\nGerminal;8,5;02/03/1885;oui;=A1",
    );
  });

  it("neutralise les formules des textes, pleine chasse comprise, mais pas les nombres", async () => {
    const rows = parseCsv(
      (await text(toCsvExport(books, columns, { bom: false }))).replace(/\r\n/g, "\n"),
      {
        delimiter: ";",
      },
    );
    expect(rows[2]?.[0]).toBe('\'=HYPERLINK("https://pirate.example";"Clic")');
    expect(rows[2]?.[1]).toBe("-3");
    expect(rows[2]?.[2]).toBe("");
    expect(rows[3]?.[0]).toBe("'＋33 6 12 34 56 78");
  });

  it("accepte un autre séparateur et un itérable asynchrone découpé en lots", async () => {
    async function* many(): AsyncGenerator<IBook> {
      for (let index = 0; index < 1200; index += 1)
        yield await Promise.resolve({ ...books[0], title: `T${index}` } as IBook);
    }
    const chunks: string[] = [];
    for await (const chunk of toCsvExport(many(), columns, { delimiter: ",", bom: false }))
      chunks.push(chunk);
    expect(chunks).toHaveLength(3);
    expect(chunks.join("").split("\r\n")).toHaveLength(1201);
    expect(chunks[0]?.startsWith("Titre,Prix")).toBe(true);
  });

  it("s'interrompt au-delà de la limite", async () => {
    await expect(text(toCsvExport(books, columns, { maxRows: 2 }))).rejects.toBeInstanceOf(
      ExportLimitExceededException,
    );
  });
});
