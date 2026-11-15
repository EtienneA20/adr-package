import { describe, expect, it } from "vitest";

import { formatCsvCell } from "./format-csv-cell";

const text = { key: "t", header: "T" };

describe("formatCsvCell", () => {
  it("formate les dates en français dans le fuseau demandé", () => {
    const date = new Date("2026-01-31T23:30:00Z");
    expect(formatCsvCell(date, { ...text, type: "date" }, "Europe/Paris")).toBe("01/02/2026");
    expect(formatCsvCell(date, { ...text, type: "date" }, "UTC")).toBe("31/01/2026");
    expect(formatCsvCell(date, { ...text, type: "datetime" }, "Europe/Paris")).toBe(
      "01/02/2026 00:30",
    );
  });

  it("écrit les booléens en oui / non et garde les nombres", () => {
    expect(formatCsvCell(true, text, "UTC")).toBe("oui");
    expect(formatCsvCell(false, text, "UTC")).toBe("non");
    expect(formatCsvCell(-12.5, text, "UTC")).toBe(-12.5);
    expect(formatCsvCell(null, text, "UTC")).toBeNull();
  });

  it("neutralise les formules, sauf colonne trusted", () => {
    expect(formatCsvCell("=1+1", text, "UTC")).toBe("'=1+1");
    expect(formatCsvCell("＠SUM(A1)", text, "UTC")).toBe("'＠SUM(A1)");
    expect(formatCsvCell("=1+1", { ...text, trusted: true }, "UTC")).toBe("=1+1");
  });
});
