import { describe, expect, it } from "vitest";

import { createSeededRandom } from "../create-seeded-random";
import { randomString } from "./random-string";

describe("randomString", () => {
  it("génère une chaîne alphanumérique de la longueur demandée par défaut", () => {
    expect(randomString(32)).toMatch(/^[A-Za-z0-9]{32}$/);
  });

  it("utilise l'alphabet fourni", () => {
    expect(randomString(10, { alphabet: "AB" })).toMatch(/^[AB]{10}$/);
  });

  it("suit le générateur fourni", () => {
    expect(randomString(3, { alphabet: "abc", random: () => 0 })).toBe("aaa");
    expect(randomString(3, { alphabet: "abc", random: () => 0.99 })).toBe("ccc");
  });

  it("est reproductible avec un générateur déterministe", () => {
    expect(randomString(12, { random: createSeededRandom(3) })).toBe(
      randomString(12, { random: createSeededRandom(3) }),
    );
  });

  it("compte chaque caractère Unicode pour un", () => {
    expect(randomString(4, { alphabet: "😀", random: () => 0.5 })).toBe("😀😀😀😀");
  });

  it("renvoie une chaîne vide pour une longueur nulle", () => {
    expect(randomString(0)).toBe("");
  });

  it.each([-1, 2.5, Number.NaN])("lève une RangeError pour la longueur %d", (length) => {
    expect(() => randomString(length)).toThrow(RangeError);
  });

  it("lève une erreur si l'alphabet est vide", () => {
    expect(() => randomString(4, { alphabet: "" })).toThrow(
      new Error("L'alphabet de randomString ne doit pas être vide."),
    );
  });
});
