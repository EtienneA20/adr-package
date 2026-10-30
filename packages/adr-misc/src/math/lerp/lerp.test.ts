import { describe, expect, it } from "vitest";

import { lerp } from "./lerp";

describe("lerp", () => {
  it("interpole entre les deux valeurs", () => {
    expect(lerp(0, 100, 0.25)).toBe(25);
    expect(lerp(10, 20, 0.5)).toBe(15);
  });

  it("renvoie exactement les extrémités pour t = 0 et t = 1", () => {
    expect(lerp(0.1, 0.7, 0)).toBe(0.1);
    expect(lerp(0.1, 0.7, 1)).toBe(0.7);
  });

  it("extrapole en dehors de [0, 1]", () => {
    expect(lerp(0, 10, 1.5)).toBe(15);
    expect(lerp(0, 10, -0.5)).toBe(-5);
  });

  it("fonctionne quand la fin est inférieure au début", () => {
    expect(lerp(100, 0, 0.25)).toBe(75);
  });
});
