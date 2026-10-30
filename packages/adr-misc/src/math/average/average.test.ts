import { describe, expect, it } from "vitest";

import { average } from "./average";

describe("average", () => {
  it("calcule la moyenne", () => {
    expect(average([12, 15, 18])).toBe(15);
  });

  it("renvoie la valeur pour une liste d'un élément", () => {
    expect(average([7])).toBe(7);
  });

  it("renvoie NaN pour une liste vide", () => {
    expect(average([])).toBeNaN();
  });
});
