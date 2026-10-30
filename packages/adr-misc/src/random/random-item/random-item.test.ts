import { describe, expect, it } from "vitest";

import { randomItem } from "./random-item";

const titles = ["Germinal", "Nana", "L'Assommoir"];

describe("randomItem", () => {
  it("choisit l'élément correspondant au générateur", () => {
    expect(randomItem(titles, () => 0)).toBe("Germinal");
    expect(randomItem(titles, () => 0.5)).toBe("Nana");
    expect(randomItem(titles, () => 0.99)).toBe("L'Assommoir");
  });

  it("renvoie undefined pour une liste vide", () => {
    expect(randomItem<string>([], () => 0)).toBeUndefined();
  });

  it("utilise Math.random par défaut", () => {
    expect(titles).toContain(randomItem(titles));
  });
});
