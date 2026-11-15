import { describe, expect, it } from "vitest";

import { toExcelSerial } from "./excel-date";

describe("toExcelSerial", () => {
  it("compte les jours depuis 1899-12-30", () => {
    expect(toExcelSerial(new Date("1970-01-01T00:00:00Z"), "UTC")).toBe(25_569);
    expect(toExcelSerial(new Date("2026-01-31T00:00:00Z"), "UTC")).toBe(46_053);
    expect(toExcelSerial(new Date("1900-03-01T00:00:00Z"), "UTC")).toBe(61);
  });

  it("met l'heure en fraction de jour, à l'heure murale du fuseau", () => {
    expect(toExcelSerial(new Date("2026-01-31T12:00:00Z"), "UTC")).toBe(46_053.5);
    expect(toExcelSerial(new Date("2026-01-31T23:00:00Z"), "Europe/Paris")).toBe(46_054);
    expect(toExcelSerial(new Date("2026-07-01T10:00:00Z"), "Europe/Paris")).toBe(46_204.5);
  });

  it("refuse les dates non représentables par Excel (avant le 1900-03-01)", () => {
    expect(toExcelSerial(new Date("1900-02-28T00:00:00Z"), "UTC")).toBeUndefined();
    expect(toExcelSerial(new Date("1862-04-03T00:00:00Z"), "UTC")).toBeUndefined();
  });
});
