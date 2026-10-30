import { describe, expect, it, vi } from "vitest";

import { sumBy } from "./sum-by";

describe("sumBy", () => {
  it("additionne la valeur extraite de chaque élément", () => {
    const fines = [{ amount: 1.5 }, { amount: 3 }];
    expect(sumBy(fines, (fine) => fine.amount)).toBe(4.5);
  });

  it("renvoie 0 pour une liste vide", () => {
    expect(sumBy([], () => 1)).toBe(0);
  });

  it("transmet l'élément et son index", () => {
    const getValue = vi.fn((_item: string, index: number) => index);
    expect(sumBy(["a", "b", "c"], getValue)).toBe(3);
    expect(getValue).toHaveBeenCalledWith("b", 1);
  });
});
