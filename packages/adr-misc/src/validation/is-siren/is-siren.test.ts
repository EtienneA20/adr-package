import { describe, expect, it } from "vitest";

import { isSiren } from "./is-siren";

describe("isSiren", () => {
  it.each(["732829320", "732 829 320", "356000000"])("accepte le SIREN %j", (value) => {
    expect(isSiren(value)).toBe(true);
  });

  it.each(["", "732829321", "73282932", "7328293200", "73282932O", "732-829-320"])(
    "refuse la chaîne %j",
    (value) => {
      expect(isSiren(value)).toBe(false);
    },
  );
});
