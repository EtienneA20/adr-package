import { describe, expect, expectTypeOf, it } from "vitest";

import { isKeyOf } from "./is-key-of";

const LABELS = { borrowed: "Emprunté", available: "Disponible" };

describe("isKeyOf", () => {
  it("accepte une propriété propre de l'objet", () => {
    expect(isKeyOf(LABELS, "borrowed")).toBe(true);
    expect(isKeyOf(["Dune"], 0)).toBe(true);
  });

  it("refuse une clé absente", () => {
    expect(isKeyOf(LABELS, "lost")).toBe(false);
  });

  it.each(["toString", "constructor", "__proto__", "hasOwnProperty"])(
    "refuse la propriété héritée %s",
    (key) => {
      expect(isKeyOf(LABELS, key)).toBe(false);
    },
  );

  it("accepte une clé symbole propre", () => {
    const id = Symbol("id");
    expect(isKeyOf({ [id]: 1 }, id)).toBe(true);
  });

  it("affine la clé en keyof T", () => {
    const status = "available" as string;
    const label = isKeyOf(LABELS, status) ? LABELS[status] : undefined;
    if (isKeyOf(LABELS, status)) {
      expectTypeOf(status).toEqualTypeOf<"borrowed" | "available">();
    }
    expect(label).toBe("Disponible");
  });
});
