import dayjs from "dayjs";
import { describe, expect, it } from "vitest";

import { toIsoDate } from "./to-iso-date";

describe("toIsoDate", () => {
  it("formate le jour local sans décalage UTC", () => {
    expect(toIsoDate(new Date(2026, 9, 29, 23, 30))).toBe("2026-10-29");
    expect(toIsoDate(new Date(2026, 0, 1, 0, 0))).toBe("2026-01-01");
  });

  it("accepte un objet dayjs et une chaîne", () => {
    expect(toIsoDate(dayjs(new Date(2026, 2, 5)))).toBe("2026-03-05");
    expect(toIsoDate("2026-10-29T08:00:00")).toBe("2026-10-29");
  });

  it("lève une erreur pour une date invalide", () => {
    expect(() => toIsoDate(new Date(Number.NaN))).toThrow(new Error("Date invalide."));
  });
});
