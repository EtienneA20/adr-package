import { describe, expect, it } from "vitest";

import { parseDuration } from "./parse-duration";

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

describe("parseDuration", () => {
  it.each([
    ["1h30", HOUR + 30 * MINUTE],
    ["1 h 30 min", HOUR + 30 * MINUTE],
    ["1H30", HOUR + 30 * MINUTE],
    ["90min", 90 * MINUTE],
    ["90 mn", 90 * MINUTE],
    ["2j 3h", 2 * DAY + 3 * HOUR],
    ["2d3h", 2 * DAY + 3 * HOUR],
    ["45s", 45 * SECOND],
    ["2min30", 2 * MINUTE + 30 * SECOND],
    ["1,5 h", 1.5 * HOUR],
    ["1.5h", 1.5 * HOUR],
    ["250ms", 250],
    ["1 heure et 30 minutes", HOUR + 30 * MINUTE],
    ["2 semaines", 14 * DAY],
    ["3 days 4 hours", 3 * DAY + 4 * HOUR],
    ["1 jour", DAY],
  ])("lit « %s » en unités", (input, expected) => {
    expect(parseDuration(input)).toBe(expected);
  });

  it.each([
    ["1:30", HOUR + 30 * MINUTE],
    ["1:30:00", HOUR + 30 * MINUTE],
    ["0:00:45", 45 * SECOND],
    ["26:05", 26 * HOUR + 5 * MINUTE],
  ])("lit l'horloge « %s »", (input, expected) => {
    expect(parseDuration(input)).toBe(expected);
  });

  it.each([
    ["PT1H30M", HOUR + 30 * MINUTE],
    ["P2DT3H", 2 * DAY + 3 * HOUR],
    ["P1W", 7 * DAY],
    ["PT45S", 45 * SECOND],
    ["PT0,5H", 30 * MINUTE],
    ["pt1h", HOUR],
  ])("lit la durée ISO 8601 « %s »", (input, expected) => {
    expect(parseDuration(input)).toBe(expected);
  });

  it("arrondit le résultat à la milliseconde", () => {
    expect(parseDuration("0.0004s")).toBe(0);
    expect(parseDuration("1.0006s")).toBe(1001);
  });

  it.each([
    "",
    "  ",
    "90",
    "1h30x",
    "abc",
    "h",
    "45 s 10",
    "2j3",
    "1:60",
    "1:30:75",
    ":30",
    "P",
    "PT",
    "P1Y",
    "P1M",
    "PT1.2.3H",
    "-1h",
  ])("renvoie undefined pour la saisie invalide « %s »", (input) => {
    expect(parseDuration(input)).toBeUndefined();
  });

  it("renvoie undefined pour null et undefined", () => {
    expect(parseDuration(null)).toBeUndefined();
    expect(parseDuration(undefined)).toBeUndefined();
  });
});
