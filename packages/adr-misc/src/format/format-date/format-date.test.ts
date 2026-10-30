import dayjs from "dayjs";
import { describe, expect, it } from "vitest";

import { formatDate } from "./format-date";

const DATE = new Date(2026, 0, 15, 10, 30);

describe("formatDate", () => {
  it("formate une date au format JJ/MM/AAAA par défaut", () => {
    expect(formatDate(DATE)).toBe("15/01/2026");
    expect(formatDate(new Date(2026, 6, 5))).toBe("05/07/2026");
  });

  it("accepte une chaîne ISO 8601, un horodatage et un objet dayjs", () => {
    expect(formatDate("2026-01-15")).toBe("15/01/2026");
    expect(formatDate(DATE.getTime())).toBe("15/01/2026");
    expect(formatDate(dayjs(DATE))).toBe("15/01/2026");
  });

  it("applique un format dayjs", () => {
    expect(formatDate(DATE, { format: "YYYY-MM-DD" })).toBe("2026-01-15");
    expect(formatDate(DATE, { format: "DD/MM/YYYY HH:mm" })).toBe("15/01/2026 10:30");
  });

  it.each([
    ["short", "15/01/2026"],
    ["medium", "15 janv. 2026"],
    ["long", "15 janvier 2026"],
    ["full", "jeudi 15 janvier 2026"],
  ])("traduit le style %s en français", (format, expected) => {
    expect(formatDate(DATE, { format })).toBe(expected);
  });

  it("traduit les styles selon la locale fournie", () => {
    expect(formatDate(DATE, { format: "long", locale: "en-GB" })).toBe("15 January 2026");
  });

  it.each([null, undefined, "", "pas une date", Number.NaN, new Date(Number.NaN)])(
    "renvoie une chaîne vide pour %j",
    (value) => {
      expect(formatDate(value)).toBe("");
    },
  );

  it("lève une RangeError pour une locale invalide avec un style", () => {
    expect(() => formatDate(DATE, { format: "long", locale: "pas une locale" })).toThrow(
      RangeError,
    );
  });
});
