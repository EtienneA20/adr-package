import { Controller, Get, StreamableFile } from "@nestjs/common";
import { HEADERS_METADATA } from "@nestjs/common/constants";
import { describe, expect, it } from "vitest";

import { ExportHeaders, contentDisposition, createExportFile } from "./create-export-file";

async function* chunks(): AsyncGenerator<string> {
  yield await Promise.resolve("a;b");
  yield await Promise.resolve("\r\n1;2");
}

async function read(file: StreamableFile): Promise<string> {
  let result = "";
  for await (const chunk of file.getStream()) result += String(chunk);
  return result;
}

describe("contentDisposition", () => {
  it("écrit le nom en ASCII et en UTF-8 encodé", () => {
    expect(contentDisposition("Prêts en retard.csv")).toBe(
      "attachment; filename=\"Prets en retard.csv\"; filename*=UTF-8''Pr%C3%AAts%20en%20retard.csv",
    );
  });

  it("neutralise les tentatives d'injection d'en-tête ou de chemin", () => {
    const header = contentDisposition('../../etc/passwd"\r\nSet-Cookie: x=1.csv');
    expect(header).not.toMatch(/[\r\n]/);
    expect(header).not.toContain("/");
    expect(header.split('"')).toHaveLength(3);
  });

  it("encode les caractères réservés de la RFC 5987 et remplace un nom vide", () => {
    expect(contentDisposition("l'été (2026)*.json")).toContain(
      "filename*=UTF-8''l%27%C3%A9t%C3%A9%20%282026%29_.json",
    );
    expect(contentDisposition("???")).toContain('filename="___"');
    expect(contentDisposition("   ")).toBe(
      "attachment; filename=\"export\"; filename*=UTF-8''export",
    );
  });
});

describe("createExportFile", () => {
  it("renvoie un StreamableFile typé, avec l'extension du format", async () => {
    const file = createExportFile(chunks(), { format: "csv", fileName: "Catalogue 2026" });
    expect(file).toBeInstanceOf(StreamableFile);
    expect(file.getHeaders()).toMatchObject({
      type: "text/csv; charset=utf-8",
      disposition:
        "attachment; filename=\"Catalogue 2026.csv\"; filename*=UTF-8''Catalogue%202026.csv",
    });
    await expect(read(file)).resolves.toBe("a;b\r\n1;2");
  });

  it("n'ajoute pas l'extension si elle est déjà présente", () => {
    const file = createExportFile(chunks(), { format: "xlsx", fileName: "export.XLSX" });
    expect(file.getHeaders().disposition).toContain('filename="export.XLSX"');
    expect(file.getHeaders().type).toBe(
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
  });
});

describe("ExportHeaders", () => {
  it("pose nosniff et no-store sur la route", () => {
    @Controller("livres")
    class BooksController {
      @Get("export")
      @ExportHeaders()
      export(): string {
        return "";
      }
    }
    expect(Reflect.getMetadata(HEADERS_METADATA, BooksController.prototype.export)).toEqual(
      expect.arrayContaining([
        { name: "Cache-Control", value: "no-store" },
        { name: "X-Content-Type-Options", value: "nosniff" },
      ]),
    );
  });
});
