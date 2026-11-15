import { parseListQuery } from "@etiennea20/adr-nest/filtering";
import type { StreamableFile } from "@nestjs/common";
import { strFromU8, unzipSync } from "fflate";
import { describe, expect, it } from "vitest";

import { bookListQuery } from "./book-list-query";
import { BooksController } from "./books.controller";
import { BooksRepository } from "./books.repository";
import { BooksService } from "./books.service";

const controller = new BooksController(new BooksService(new BooksRepository()));

function exportFile(
  format: "json" | "ndjson" | "csv" | "xlsx",
  input: object = {},
): StreamableFile {
  return controller.export({ format }, parseListQuery(bookListQuery, input, { source: "body" }));
}

async function bytes(file: StreamableFile): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of file.getStream()) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : Buffer.from(chunk as Uint8Array));
  }
  return Buffer.concat(chunks);
}

describe("GET /livres/export", () => {
  it("exporte en CSV pour Excel, filtre et tri de la liste appliqués", async () => {
    const file = exportFile("csv", { filter: { field: "status", op: "eq", value: "available" } });
    expect(file.getHeaders().disposition).toContain('filename="Catalogue de la bibliotheque.csv"');
    const csv = (await bytes(file)).toString("utf8");
    expect(csv.split("\r\n")).toEqual([
      "\uFEFFTitre;Auteur;Statut;Publication;Identifiant",
      "Germinal;Émile Zola;Disponible;02/03/1885;9e8d7c6b-5a4f-4e3d-a2c1-b0a9f8e7d6c5",
      "Les Misérables;Victor Hugo;Disponible;03/04/1862;0b6f8c6e-1f3a-4c2e-9d4b-6a7e2f1c3d5e",
    ]);
  });

  it("limite les colonnes à la sélection du client, dans la liste blanche", async () => {
    const json = JSON.parse(
      (await bytes(exportFile("json", { fields: ["title"] }))).toString(),
    ) as unknown;
    expect(json).toEqual([{ title: "Dune" }, { title: "Germinal" }, { title: "Les Misérables" }]);
  });

  it("exporte en NDJSON", async () => {
    expect((await bytes(exportFile("ndjson"))).toString().trim().split("\n")).toHaveLength(3);
  });

  it("exporte un classeur XLSX lisible", async () => {
    const file = exportFile("xlsx");
    expect(file.getHeaders().type).toBe(
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    const sheet = strFromU8(
      unzipSync(await bytes(file))["xl/worksheets/sheet1.xml"] ?? new Uint8Array(),
    );
    expect(sheet).toContain("Les Misérables");
    expect(sheet).toContain('<autoFilter ref="A1:E4"/>');
  });
});
