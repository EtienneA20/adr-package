import { describe, expect, expectTypeOf, it } from "vitest";

import { hexToRgb } from "./hex-to-rgb";
import type { IRgbColor } from "./hex-to-rgb";

describe("hexToRgb", () => {
  it("décompose une couleur #rrggbb", () => {
    expect(hexToRgb("#2563eb")).toEqual({ r: 37, g: 99, b: 235 });
  });

  it("décompose une couleur courte #rgb", () => {
    expect(hexToRgb("#fff")).toEqual({ r: 255, g: 255, b: 255 });
    expect(hexToRgb("#f80")).toEqual({ r: 255, g: 136, b: 0 });
  });

  it("décompose l'opacité des formats #rrggbbaa et #rgba", () => {
    expect(hexToRgb("#00000080")).toEqual({ r: 0, g: 0, b: 0, a: 0.502 });
    expect(hexToRgb("#000f")).toEqual({ r: 0, g: 0, b: 0, a: 1 });
    expect(hexToRgb("#ffffff00")).toEqual({ r: 255, g: 255, b: 255, a: 0 });
  });

  it("accepte les majuscules et l'absence de #", () => {
    expect(hexToRgb("2563EB")).toEqual({ r: 37, g: 99, b: 235 });
  });

  it("n'ajoute pas d'opacité à une couleur qui n'en précise pas", () => {
    expect(hexToRgb("#123456")).not.toHaveProperty("a");
  });

  it("renvoie un IRgbColor", () => {
    expectTypeOf(hexToRgb("#fff")).toEqualTypeOf<IRgbColor>();
  });

  it.each(["", "#", "#12", "#12345", "#1234567", "#ggg", "rgb(0, 0, 0)", " #fff"])(
    "lève une erreur pour « %s »",
    (hex) => {
      expect(() => hexToRgb(hex)).toThrow(Error);
    },
  );

  it("cite la valeur reçue dans le message", () => {
    expect(() => hexToRgb("bleu")).toThrow(
      "Couleur hexadécimale invalide : « bleu » (formats acceptés : #rgb, #rgba, #rrggbb, #rrggbbaa).",
    );
  });
});
