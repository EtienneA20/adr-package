import { describe, expect, it } from "vitest";

import type { EExportColumnType } from "../export-columns";
import { readExportCell } from "./read-export-cell";

const book = {
  title: "Germinal",
  pages: 592,
  price: "8.50",
  available: true,
  publishedAt: "1885-03-02",
  author: { name: "Émile Zola" },
  tags: ["roman"],
  isbn: null,
};

function cell(key: string, type?: EExportColumnType) {
  return readExportCell(book, { key, header: key, type });
}

describe("readExportCell", () => {
  it("lit un chemin pointé ou la fonction value", () => {
    expect(cell("author.name")).toBe("Émile Zola");
    expect(
      readExportCell(book, { key: "x", header: "X", value: (row) => row.title.toUpperCase() }),
    ).toBe("GERMINAL");
    expect(cell("author.age")).toBeNull();
    expect(cell("title.length")).toBeNull();
  });

  it("convertit en texte", () => {
    expect(cell("pages")).toBe("592");
    expect(cell("tags")).toBe('["roman"]');
    expect(cell("isbn")).toBeNull();
    expect(
      readExportCell({ at: new Date("2026-01-31T10:00:00Z") }, { key: "at", header: "A" }),
    ).toBe("2026-01-31T10:00:00.000Z");
    expect(readExportCell({ at: new Date("x") }, { key: "at", header: "A" })).toBeNull();
  });

  it("convertit en nombre", () => {
    expect(cell("pages", "number")).toBe(592);
    expect(cell("price", "currency")).toBe(8.5);
    expect(cell("title", "number")).toBeNull();
    expect(readExportCell({ n: " " }, { key: "n", header: "N", type: "number" })).toBeNull();
    expect(readExportCell({ n: Infinity }, { key: "n", header: "N", type: "number" })).toBeNull();
  });

  it("convertit en date", () => {
    expect(cell("publishedAt", "date")).toEqual(new Date("1885-03-02"));
    expect(readExportCell({ t: 0 }, { key: "t", header: "T", type: "datetime" })).toEqual(
      new Date(0),
    );
    expect(cell("title", "date")).toBeNull();
    expect(cell("author", "date")).toBeNull();
  });

  it("garde les seuls booléens", () => {
    expect(cell("available", "boolean")).toBe(true);
    expect(cell("title", "boolean")).toBeNull();
  });
});

describe("readExportCell : valeurs non exportables", () => {
  it("laisse vides un symbole ou une fonction", () => {
    expect(readExportCell({ s: Symbol("x") }, { key: "s", header: "S" })).toBeNull();
    expect(readExportCell({ f: () => 1 }, { key: "f", header: "F" })).toBeNull();
    expect(readExportCell({ b: 10n }, { key: "b", header: "B" })).toBe("10");
  });
});
