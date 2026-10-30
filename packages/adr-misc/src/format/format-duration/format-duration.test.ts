import { describe, expect, it } from "vitest";

import { formatDuration } from "./format-duration";

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

describe("formatDuration", () => {
  it.each([
    [0, "0 s"],
    [45 * SECOND, "45 s"],
    [90 * MINUTE, "1 h 30 min"],
    [2 * DAY + 3 * HOUR, "2 j 3 h"],
    [DAY + 2 * HOUR + 3 * MINUTE + 4 * SECOND, "1 j 2 h 3 min 4 s"],
    [1499, "1 s"],
    [400, "0 s"],
  ])("formate %d ms en « %s » (style court)", (durationMs, expected) => {
    expect(formatDuration(durationMs)).toBe(expected);
  });

  it("écrit les unités en toutes lettres, au singulier pour 0 et 1", () => {
    expect(formatDuration(2 * DAY + 3 * HOUR, { style: "long" })).toBe("2 jours et 3 heures");
    expect(formatDuration(HOUR + MINUTE + 30 * SECOND, { style: "long" })).toBe(
      "1 heure, 1 minute et 30 secondes",
    );
    expect(formatDuration(DAY, { style: "long" })).toBe("1 jour");
    expect(formatDuration(0, { style: "long" })).toBe("0 seconde");
  });

  it("formate au format horloge, les jours étant convertis en heures", () => {
    expect(formatDuration(90 * MINUTE, { style: "clock" })).toBe("1:30:00");
    expect(formatDuration(DAY + 2 * HOUR + 5 * MINUTE + 9 * SECOND, { style: "clock" })).toBe(
      "26:05:09",
    );
    expect(formatDuration(0, { style: "clock" })).toBe("0:00:00");
  });

  it("limite le nombre d'unités en tronquant les suivantes", () => {
    const duration = DAY + 2 * HOUR + 59 * MINUTE;
    expect(formatDuration(duration, { maxUnits: 2 })).toBe("1 j 2 h");
    expect(formatDuration(duration, { maxUnits: 1, style: "long" })).toBe("1 jour");
  });

  it("préfixe une durée négative par un signe moins", () => {
    expect(formatDuration(-90 * MINUTE)).toBe("-1 h 30 min");
    expect(formatDuration(-90 * MINUTE, { style: "clock" })).toBe("-1:30:00");
    expect(formatDuration(-200)).toBe("0 s");
  });

  it.each([null, undefined, Number.NaN, Number.POSITIVE_INFINITY])(
    "renvoie une chaîne vide pour %s",
    (value) => {
      expect(formatDuration(value)).toBe("");
    },
  );

  it.each([0, -1, 1.5, Number.NaN])("lève une RangeError pour maxUnits = %s", (maxUnits) => {
    expect(() => formatDuration(HOUR, { maxUnits })).toThrow(RangeError);
  });
});
