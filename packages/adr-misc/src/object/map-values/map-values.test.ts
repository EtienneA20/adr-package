import { describe, expect, expectTypeOf, it } from "vitest";

import { mapValues } from "./map-values";

describe("mapValues", () => {
  it("transforme chaque valeur en conservant les clés", () => {
    expect(mapValues({ roman: 12, essai: 3 }, (count) => `${count} livre(s)`)).toEqual({
      roman: "12 livre(s)",
      essai: "3 livre(s)",
    });
  });

  it("transmet la clé au transformateur", () => {
    expect(mapValues({ a: 1, b: 2 }, (value, key) => `${key}${value}`)).toEqual({
      a: "a1",
      b: "b2",
    });
  });

  it("renvoie un objet vide pour un objet vide", () => {
    expect(mapValues({}, () => 1)).toEqual({});
  });

  it("ne modifie pas l'objet d'origine", () => {
    const frozen = Object.freeze({ a: 1 });
    mapValues(frozen, (value) => value * 2);
    expect(frozen).toEqual({ a: 1 });
  });

  it("type les nouvelles valeurs", () => {
    expectTypeOf(mapValues({ a: 1, b: 2 }, String)).toEqualTypeOf<{ a: string; b: string }>();
  });
});
