import { describe, expect, expectTypeOf, it } from "vitest";

import { type DeepMergePatch, deepMerge } from "./deep-merge";

interface ISettings {
  loans: { maxDays: number; maxBooks: number };
  theme: string;
  genres: string[];
  openedAt?: Date;
}

const defaults: ISettings = {
  loans: { maxDays: 14, maxBooks: 5 },
  theme: "clair",
  genres: ["roman", "essai"],
};

describe("deepMerge", () => {
  it("fusionne récursivement les objets simples", () => {
    expect(deepMerge(defaults, { loans: { maxDays: 21 } })).toEqual({
      loans: { maxDays: 21, maxBooks: 5 },
      theme: "clair",
      genres: ["roman", "essai"],
    });
  });

  it("applique les sources dans l'ordre", () => {
    const result = deepMerge(defaults, { theme: "sombre" }, { theme: "contraste" });
    expect(result.theme).toBe("contraste");
  });

  it("remplace les tableaux et les dates au lieu de les fusionner", () => {
    const openedAt = new Date(2026, 0, 15);
    const result = deepMerge(defaults, { genres: ["bd"], openedAt });
    expect(result.genres).toEqual(["bd"]);
    expect(result.openedAt).toBe(openedAt);
  });

  it("ignore les valeurs undefined des sources", () => {
    expect(deepMerge(defaults, { theme: undefined }).theme).toBe("clair");
  });

  it("ne modifie aucun argument et recopie les objets simples", () => {
    const source = { loans: { maxDays: 30 } };
    const result = deepMerge(defaults, source);
    expect(defaults.loans.maxDays).toBe(14);
    expect(result).not.toBe(defaults);
    expect(result.loans).not.toBe(defaults.loans);
    expect(result.loans).not.toBe(source.loans);
    expect(deepMerge(defaults)).toEqual(defaults);
    expect(deepMerge(defaults)).not.toBe(defaults);
  });

  it("recopie un objet source posé sur une valeur non fusionnable", () => {
    const target: Record<string, unknown> = { meta: null };
    const source = { meta: { author: "Zola" } };
    const result = deepMerge(target, source);
    expect(result.meta).toEqual({ author: "Zola" });
    expect(result.meta).not.toBe(source.meta);
  });

  it("ignore les clés __proto__, constructor et prototype (pollution de prototype)", () => {
    const malicious = JSON.parse(
      '{"__proto__": {"polluted": true}, "constructor": {"prototype": {"polluted": true}}, "a": {"__proto__": {"polluted": true}}}',
    ) as Record<string, unknown>;
    const target: Record<string, unknown> = {};
    const result = deepMerge(target, malicious);
    expect(({} as Record<string, unknown>).polluted).toBeUndefined();
    expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
    expect(Object.keys(result)).toEqual(["a"]);
    expect(Object.getPrototypeOf(result.a)).toBe(Object.prototype);
    expect((result.a as Record<string, unknown>).polluted).toBeUndefined();
  });

  it("type le résultat comme la cible et les sources comme des valeurs partielles", () => {
    expectTypeOf(deepMerge(defaults, { loans: { maxBooks: 3 } })).toEqualTypeOf<ISettings>();
    const saved: DeepMergePatch<ISettings> = { theme: "sombre" };
    expectTypeOf(deepMerge(defaults, saved)).toEqualTypeOf<ISettings>();
    expectTypeOf<{ loans: { maxDays: number } }>().toExtend<DeepMergePatch<ISettings>>();
    expectTypeOf<{ genres: string[] }>().toExtend<DeepMergePatch<ISettings>>();
    expectTypeOf<{ genres: string[][] }>().not.toExtend<DeepMergePatch<ISettings>>();
    expectTypeOf<{ loans: { maxDays: string } }>().not.toExtend<DeepMergePatch<ISettings>>();
  });
});
