import { describe, expect, it } from "vitest";

import { isHexColor } from "./is-hex-color";

describe("isHexColor", () => {
  it.each(["#fff", "#FFFA", "#1e90ff", "#1E90FF80", "#000000"])(
    "accepte la couleur %s",
    (value) => {
      expect(isHexColor(value)).toBe(true);
    },
  );

  it.each(["", "#", "fff", "#ff", "#fffff", "#fffffff", "#gggggg", "#1e90ff800", " #fff"])(
    "refuse la chaîne %j",
    (value) => {
      expect(isHexColor(value)).toBe(false);
    },
  );
});
