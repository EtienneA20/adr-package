import { describe, expect, it } from "vitest";

import { isPlainRecord } from "./is-plain-record";

describe("isPlainRecord", () => {
  it("reconnaît les objets simples", () => {
    expect(isPlainRecord({ a: 1 })).toBe(true);
    expect(isPlainRecord(Object.create(null))).toBe(true);
  });

  it.each([
    null,
    undefined,
    1,
    "a",
    [],
    new Date(),
    new Map(),
    new (class Book {
      title = "Germinal";
    })(),
  ])("rejette %o", (value) => {
    expect(isPlainRecord(value)).toBe(false);
  });
});
