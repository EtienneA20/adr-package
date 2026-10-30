import { describe, expectTypeOf, it } from "vitest";

import type { KeysOfType } from "./keys-of-type";

interface IBook {
  title: string;
  pages: number;
  publishedAt: Date;
  copies: number;
  subtitle?: string;
}

describe("KeysOfType", () => {
  it("renvoie les clés dont la valeur est du type demandé", () => {
    expectTypeOf<KeysOfType<IBook, number>>().toEqualTypeOf<"pages" | "copies">();
    expectTypeOf<KeysOfType<IBook, Date>>().toEqualTypeOf<"publishedAt">();
  });

  it("ne retient une propriété facultative que si V accepte undefined", () => {
    expectTypeOf<KeysOfType<IBook, string>>().toEqualTypeOf<"title">();
    expectTypeOf<KeysOfType<IBook, string | undefined>>().toEqualTypeOf<"title" | "subtitle">();
  });

  it("renvoie never si aucune clé ne correspond", () => {
    expectTypeOf<KeysOfType<IBook, boolean>>().toBeNever();
  });
});
