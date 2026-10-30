import { describe, expect, it } from "vitest";

import { isIpv4 } from "./is-ipv4";

describe("isIpv4", () => {
  it.each(["0.0.0.0", "127.0.0.1", "192.168.1.10", "255.255.255.255", "10.200.249.9"])(
    "accepte l'adresse %s",
    (value) => {
      expect(isIpv4(value)).toBe(true);
    },
  );

  it.each([
    "",
    "256.0.0.1",
    "1.2.3",
    "1.2.3.4.5",
    "192.168.01.1",
    "1.2.3.-4",
    "a.b.c.d",
    " 1.2.3.4",
    "1.2.3.4 ",
    "1..2.3",
  ])("refuse la chaîne %j", (value) => {
    expect(isIpv4(value)).toBe(false);
  });
});
