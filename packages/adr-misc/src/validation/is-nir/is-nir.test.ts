import { describe, expect, it } from "vitest";

import { isNir } from "./is-nir";

describe("isNir", () => {
  it.each([
    "185057800608491",
    "1 85 05 78 006 084 91",
    "2 69 05 20 004 012 01",
    "2 69 05 2A 004 012 28",
    "2 69 05 2a 004 012 28",
    "2 69 05 2B 004 012 55",
  ])("accepte le NIR %j", (value) => {
    expect(isNir(value)).toBe(true);
  });

  it("refuse une clé incorrecte", () => {
    expect(isNir("1 85 05 78 006 084 92")).toBe(false);
    expect(isNir("2 69 05 2A 004 012 55")).toBe(false);
  });

  it.each([
    "",
    "1 85 05 78 006 084",
    "1 85 05 78 006 084 911",
    "5 85 05 78 006 084 91",
    "1 85 00 78 006 084 91",
    "1 85 13 78 006 084 91",
    "1 85 05 2C 006 084 91",
    "1-85-05-78-006-084-91",
  ])("refuse la chaîne mal formée %j", (value) => {
    expect(isNir(value)).toBe(false);
  });
});
