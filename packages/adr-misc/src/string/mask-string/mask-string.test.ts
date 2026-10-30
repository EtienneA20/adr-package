import { describe, expect, it } from "vitest";

import { maskString } from "./mask-string";

describe("maskString", () => {
  it("laisse visibles les 4 derniers caractères par défaut", () => {
    expect(maskString("4970101234567890")).toBe("************7890");
  });

  it("laisse visibles le début et la fin demandés", () => {
    expect(maskString("0612345678", { visibleStart: 2, visibleEnd: 2 })).toBe("06******78");
    expect(maskString("secret", { visibleEnd: 0 })).toBe("******");
  });

  it("accepte un caractère de masquage personnalisé", () => {
    expect(maskString("0612345678", { visibleStart: 2, visibleEnd: 2, maskChar: "•" })).toBe(
      "06••••••78",
    );
  });

  it("ne masque jamais les caractères à préserver", () => {
    expect(
      maskString("FR76 3000 6000 0112 3456 7890 189", {
        visibleStart: 4,
        visibleEnd: 3,
        preserve: " ",
      }),
    ).toBe("FR76 **** **** **** **** **** 189");
    expect(
      maskString("jean.dupont@exemple.fr", { visibleStart: 2, visibleEnd: 11, preserve: "@." }),
    ).toBe("je**.******@exemple.fr");
  });

  it("renvoie la valeur en clair si les parties visibles la couvrent entièrement", () => {
    expect(maskString("1234")).toBe("1234");
    expect(maskString("abc", { visibleStart: 2, visibleEnd: 2 })).toBe("abc");
    expect(maskString("")).toBe("");
  });

  it("compte les caractères par point de code", () => {
    expect(maskString("🎉🎉🎉ab", { visibleEnd: 1 })).toBe("****b");
  });

  it.each([
    [
      { visibleStart: -1 },
      "L'option « visibleStart » doit être un entier positif ou nul (reçu : -1).",
    ],
    [
      { visibleEnd: 1.5 },
      "L'option « visibleEnd » doit être un entier positif ou nul (reçu : 1.5).",
    ],
  ])("lève une RangeError pour une option invalide %j", (options, message) => {
    expect(() => maskString("secret", options)).toThrow(new RangeError(message));
  });
});
