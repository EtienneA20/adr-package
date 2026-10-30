import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import { describe, expect, expectTypeOf, it } from "vitest";

import { parseDate } from "./parse-date";

/**
 * Formate une date en heure locale pour comparer sans dépendre du fuseau.
 *
 * @param date - Date à formater.
 * @returns La date au format `YYYY-MM-DD HH:mm:ss`, ou `undefined`.
 */
function local(date: Dayjs | undefined): string | undefined {
  return date?.format("YYYY-MM-DD HH:mm:ss");
}

describe("parseDate", () => {
  it("lit une date ISO 8601 en heure locale", () => {
    expect(local(parseDate("2026-01-15"))).toBe("2026-01-15 00:00:00");
    expect(local(parseDate("2026-01-15T10:30"))).toBe("2026-01-15 10:30:00");
    expect(local(parseDate("2026-01-15 10:30:45.123"))).toBe("2026-01-15 10:30:45");
  });

  it("lit une date ISO 8601 avec décalage horaire", () => {
    expect(parseDate("2026-01-15T10:30:00Z")?.toISOString()).toBe("2026-01-15T10:30:00.000Z");
    expect(parseDate("2026-01-15T10:30:00+02:00")?.toISOString()).toBe("2026-01-15T08:30:00.000Z");
  });

  it("lit les formats français par défaut", () => {
    expect(local(parseDate("15/01/2026"))).toBe("2026-01-15 00:00:00");
    expect(local(parseDate("15/01/2026 14:30"))).toBe("2026-01-15 14:30:00");
    expect(local(parseDate("5/1/2026"))).toBe("2026-01-05 00:00:00");
    expect(local(parseDate("  29/02/2024  "))).toBe("2024-02-29 00:00:00");
  });

  it("utilise les formats fournis, en mode strict", () => {
    expect(local(parseDate("01-15-2026", ["MM-DD-YYYY"]))).toBe("2026-01-15 00:00:00");
    expect(parseDate("15/01/2026", ["MM-DD-YYYY"])).toBeUndefined();
    expect(local(parseDate("2026-01-15", ["MM-DD-YYYY"]))).toBe("2026-01-15 00:00:00");
  });

  it.each(["31/02/2026", "29/02/2026", "32/01/2026", "15/13/2026", "15/01/2026 25:00"])(
    "refuse la date française impossible « %s »",
    (input) => {
      expect(parseDate(input)).toBeUndefined();
    },
  );

  it.each([
    "2026-02-30",
    "2026-13-01",
    "2026-00-10",
    "2026-01-15T24:00",
    "2026-01-15T10:60",
    "2026-01-15T10:30:60",
    "2026-1-15",
  ])("refuse la date ISO impossible ou mal formée « %s »", (input) => {
    expect(parseDate(input)).toBeUndefined();
  });

  it.each(["", "   ", "demain", "1/2/26", "15.01.2026"])(
    "renvoie undefined pour la saisie invalide « %s »",
    (input) => {
      expect(parseDate(input)).toBeUndefined();
    },
  );

  it("renvoie undefined pour null et undefined (et non l'instant présent)", () => {
    expect(parseDate(null)).toBeUndefined();
    expect(parseDate(undefined)).toBeUndefined();
  });

  it("accepte une Date, un horodatage et un objet dayjs", () => {
    const date = new Date(2026, 0, 15, 9, 0);
    expect(local(parseDate(date))).toBe("2026-01-15 09:00:00");
    expect(local(parseDate(date.getTime()))).toBe("2026-01-15 09:00:00");
    expect(local(parseDate(dayjs(date)))).toBe("2026-01-15 09:00:00");
  });

  it("renvoie undefined pour une Date invalide", () => {
    expect(parseDate(new Date(Number.NaN))).toBeUndefined();
  });

  it("renvoie un objet dayjs ou undefined", () => {
    expectTypeOf(parseDate("15/01/2026")).toEqualTypeOf<Dayjs | undefined>();
  });
});
