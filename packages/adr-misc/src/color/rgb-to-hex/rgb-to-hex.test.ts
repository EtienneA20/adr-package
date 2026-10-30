import { describe, expect, it } from "vitest";

import { hexToRgb } from "../hex-to-rgb";
import { rgbToHex } from "./rgb-to-hex";

describe("rgbToHex", () => {
  it("convertit des composantes en #rrggbb minuscule", () => {
    expect(rgbToHex({ r: 37, g: 99, b: 235 })).toBe("#2563eb");
    expect(rgbToHex({ r: 0, g: 0, b: 0 })).toBe("#000000");
  });

  it("arrondit les composantes décimales", () => {
    expect(rgbToHex({ r: 254.6, g: 0.4, b: 127.5 })).toBe("#ff0080");
  });

  it("écrit l'opacité quand elle est inférieure à 1", () => {
    expect(rgbToHex({ r: 0, g: 0, b: 0, a: 0.5 })).toBe("#00000080");
    expect(rgbToHex({ r: 0, g: 0, b: 0, a: 0 })).toBe("#00000000");
  });

  it("omet l'opacité d'une couleur opaque", () => {
    expect(rgbToHex({ r: 255, g: 255, b: 255, a: 1 })).toBe("#ffffff");
  });

  it.each(["#2563eb", "#00000080", "#ff880033"])(
    "fait l'aller-retour avec hexToRgb pour %s",
    (hex) => {
      expect(rgbToHex(hexToRgb(hex))).toBe(hex);
    },
  );

  it.each([
    { r: 256, g: 0, b: 0 },
    { r: 0, g: -1, b: 0 },
    { r: 0, g: 0, b: Number.NaN },
    { r: 0, g: 0, b: 0, a: 1.5 },
  ])("lève une RangeError pour %o", (color) => {
    expect(() => rgbToHex(color)).toThrow(RangeError);
  });

  it("cite la composante fautive dans le message", () => {
    expect(() => rgbToHex({ r: 300, g: 0, b: 0 })).toThrow(
      "Composante de couleur hors limites : 300 (attendue entre 0 et 255).",
    );
  });
});
