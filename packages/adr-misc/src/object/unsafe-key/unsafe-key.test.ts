import { describe, expect, it } from "vitest";

import { isUnsafeKey } from "./unsafe-key";

describe("isUnsafeKey", () => {
  it.each(["__proto__", "constructor", "prototype"])("refuse la clé %s", (key) => {
    expect(isUnsafeKey(key)).toBe(true);
  });

  it.each(["title", "proto", "", "0"])("accepte la clé %j", (key) => {
    expect(isUnsafeKey(key)).toBe(false);
  });
});
