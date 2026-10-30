import { afterEach, describe, expect, it, vi } from "vitest";

import { formatRelativeTime } from "./format-relative-time";

const NOW = new Date(2026, 0, 15, 12, 0, 0);

describe("formatRelativeTime", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it.each([
    [new Date(2026, 0, 15, 12, 0, 0), "maintenant"],
    [new Date(2026, 0, 15, 11, 59, 30), "il y a 30 secondes"],
    [new Date(2026, 0, 15, 11, 55), "il y a 5 minutes"],
    [new Date(2026, 0, 15, 14, 0), "dans 2 heures"],
    [new Date(2026, 0, 14, 12, 0), "hier"],
    [new Date(2026, 0, 16, 12, 0), "demain"],
    [new Date(2026, 0, 12, 12, 0), "il y a 3 jours"],
    [new Date(2026, 0, 22, 12, 0), "la semaine prochaine"],
    [new Date(2025, 11, 25, 12, 0), "il y a 3 semaines"],
    [new Date(2025, 11, 15, 12, 0), "le mois dernier"],
    [new Date(2026, 4, 15, 12, 0), "dans 4 mois"],
    [new Date(2024, 0, 15, 12, 0), "il y a 2 ans"],
    [new Date(2027, 0, 15, 12, 0), "l’année prochaine"],
  ])("situe %s par rapport au 15/01/2026 à midi : « %s »", (date, expected) => {
    expect(formatRelativeTime(date, { now: NOW })).toBe(expected);
  });

  it("utilise toujours un nombre avec numeric: always", () => {
    const options = { now: NOW, numeric: "always" } as const;
    expect(formatRelativeTime(new Date(2026, 0, 14, 12, 0), options)).toBe("il y a 1 jour");
    expect(formatRelativeTime(new Date(2026, 0, 15, 11, 59, 59, 800), options)).toBe(
      "dans 0 seconde",
    );
  });

  it("accepte une autre locale", () => {
    expect(formatRelativeTime(new Date(2026, 0, 12, 12, 0), { now: NOW, locale: "en" })).toBe(
      "3 days ago",
    );
  });

  it("utilise l'instant présent par défaut", () => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
    expect(formatRelativeTime("2026-01-15T09:00:00")).toBe("il y a 3 heures");
  });

  it.each([null, undefined, "pas une date"])("renvoie une chaîne vide pour %j", (value) => {
    expect(formatRelativeTime(value, { now: NOW })).toBe("");
  });

  it("renvoie une chaîne vide si l'instant de référence est invalide", () => {
    expect(formatRelativeTime(NOW, { now: "pas une date" })).toBe("");
  });

  it("lève une RangeError pour une locale invalide", () => {
    expect(() => formatRelativeTime(NOW, { now: NOW, locale: "pas une locale" })).toThrow(
      RangeError,
    );
  });
});
