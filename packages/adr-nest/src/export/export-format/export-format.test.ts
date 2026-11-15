import { describe, expect, expectTypeOf, it } from "vitest";

import { EExportFormat, EXPORT_CONTENT_TYPES } from "./export-format";

describe("EExportFormat", () => {
  it("contient les quatre formats, qui servent d'extension", () => {
    expect(Object.values(EExportFormat)).toEqual(["json", "ndjson", "csv", "xlsx"]);
    expectTypeOf<EExportFormat>().toEqualTypeOf<"json" | "ndjson" | "csv" | "xlsx">();
  });
});

describe("EXPORT_CONTENT_TYPES", () => {
  it("donne le type de média de chaque format", () => {
    expect(EXPORT_CONTENT_TYPES).toEqual({
      json: "application/json; charset=utf-8",
      ndjson: "application/x-ndjson; charset=utf-8",
      csv: "text/csv; charset=utf-8",
      xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    expect(Object.isFrozen(EXPORT_CONTENT_TYPES)).toBe(true);
  });
});
