import { describe, expect, it } from "vitest";

import { formatDateTime } from "./format-date-time";

const DATE = new Date(2026, 0, 15, 10, 30, 45);

describe("formatDateTime", () => {
  it("formate une date et son heure au format JJ/MM/AAAA HH:mm par défaut", () => {
    expect(formatDateTime(DATE)).toBe("15/01/2026 10:30");
    expect(formatDateTime(new Date(2026, 6, 5, 8, 5))).toBe("05/07/2026 08:05");
  });

  it("applique un format dayjs", () => {
    expect(formatDateTime(DATE, { format: "DD/MM/YYYY HH:mm:ss" })).toBe("15/01/2026 10:30:45");
  });

  it.each([
    ["short", "15/01/2026 10:30"],
    ["medium", "15 janv. 2026, 10:30"],
    ["long", "15 janvier 2026 à 10:30"],
    ["full", "jeudi 15 janvier 2026 à 10:30"],
  ])("ajoute l'heure au style %s", (format, expected) => {
    expect(formatDateTime(DATE, { format })).toBe(expected);
  });

  it.each([null, undefined, "pas une date"])("renvoie une chaîne vide pour %j", (value) => {
    expect(formatDateTime(value)).toBe("");
  });

  it("lève une RangeError pour une locale invalide avec un style", () => {
    expect(() => formatDateTime(DATE, { format: "short", locale: "pas une locale" })).toThrow(
      RangeError,
    );
  });
});
