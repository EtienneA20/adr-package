import { describe, expect, it } from "vitest";

import { defineExportColumns } from "../export-columns";
import { ExportLimitExceededException } from "../export-limit";
import { toJsonExport, toNdjsonExport } from "./json-export";

const books = [
  { title: "Germinal", publishedAt: "1885-03-02", secret: "x", author: { name: "Zola" } },
  { title: "=1+1", publishedAt: null, secret: "y", author: { name: "Anonyme" } },
];
const columns = defineExportColumns<(typeof books)[number]>([
  { key: "title", header: "Titre" },
  { key: "author.name", header: "Auteur" },
  { key: "publishedAt", header: "Publication", type: "date" },
]);

async function text(chunks: AsyncIterable<string>): Promise<string> {
  let result = "";
  for await (const chunk of chunks) result += chunk;
  return result;
}

describe("toJsonExport", () => {
  it("écrit un tableau JSON des seules colonnes déclarées", async () => {
    const json = JSON.parse(await text(toJsonExport(books, columns))) as unknown[];
    expect(json).toEqual([
      { title: "Germinal", "author.name": "Zola", publishedAt: "1885-03-02T00:00:00.000Z" },
      { title: "=1+1", "author.name": "Anonyme", publishedAt: null },
    ]);
  });

  it("écrit un tableau vide sans ligne", async () => {
    await expect(text(toJsonExport([], columns))).resolves.toBe("[]");
  });

  it("s'interrompt au-delà de la limite", async () => {
    await expect(text(toJsonExport(books, columns, { maxRows: 1 }))).rejects.toBeInstanceOf(
      ExportLimitExceededException,
    );
  });
});

describe("toNdjsonExport", () => {
  it("écrit un objet JSON par ligne", async () => {
    const lines = (await text(toNdjsonExport(books, columns))).split("\n");
    expect(lines).toHaveLength(3);
    expect(lines[2]).toBe("");
    expect(JSON.parse(lines[0] ?? "")).toMatchObject({ title: "Germinal" });
  });
});
