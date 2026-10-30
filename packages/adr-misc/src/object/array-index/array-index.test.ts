import { describe, expect, it } from "vitest";

import { isArrayIndex } from "./array-index";

describe("isArrayIndex", () => {
  it.each(["0", "7", "42"])("reconnaît l'index %s", (segment) => {
    expect(isArrayIndex(segment)).toBe(true);
  });

  it.each(["", "-1", "01", "1.5", "a", "1a"])("rejette le segment %j", (segment) => {
    expect(isArrayIndex(segment)).toBe(false);
  });
});
