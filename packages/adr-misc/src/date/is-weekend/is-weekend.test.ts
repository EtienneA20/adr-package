import dayjs from "dayjs";
import { describe, expect, it } from "vitest";

import { isWeekend } from "./is-weekend";

describe("isWeekend", () => {
  it.each([
    [new Date(2026, 9, 31), true],
    [new Date(2026, 10, 1), true],
    [new Date(2026, 9, 30), false],
    [new Date(2026, 10, 2), false],
  ])("indique si %s tombe un week-end (heure locale)", (date, expected) => {
    expect(isWeekend(date)).toBe(expected);
  });

  it("accepte une chaîne et un objet dayjs", () => {
    expect(isWeekend("2026-10-31")).toBe(true);
    expect(isWeekend(dayjs("2026-10-29"))).toBe(false);
  });

  it("lève une erreur pour une date invalide", () => {
    expect(() => isWeekend(new Date(Number.NaN))).toThrow(new Error("Date invalide."));
  });
});
