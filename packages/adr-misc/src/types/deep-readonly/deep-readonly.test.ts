import { describe, expectTypeOf, it } from "vitest";

import type { DeepReadonly } from "./deep-readonly";

interface ICatalog {
  genres: string[];
  shelves: { code: string; capacity: number }[];
  index: Map<string, { title: string }>;
  tags: Set<{ label: string }>;
  updatedAt: Date;
}

describe("DeepReadonly", () => {
  it("rend les propriétés et les tableaux imbriqués en lecture seule", () => {
    expectTypeOf<DeepReadonly<ICatalog>["genres"]>().toEqualTypeOf<readonly string[]>();
    expectTypeOf<DeepReadonly<ICatalog>["shelves"]>().toEqualTypeOf<
      readonly { readonly code: string; readonly capacity: number }[]
    >();
  });

  it("convertit Map et Set en ReadonlyMap et ReadonlySet profonds", () => {
    expectTypeOf<DeepReadonly<ICatalog>["index"]>().toEqualTypeOf<
      ReadonlyMap<string, { readonly title: string }>
    >();
    expectTypeOf<DeepReadonly<ICatalog>["tags"]>().toEqualTypeOf<
      ReadonlySet<{ readonly label: string }>
    >();
  });

  it("conserve les primitives, dates et fonctions", () => {
    expectTypeOf<DeepReadonly<ICatalog>["updatedAt"]>().toEqualTypeOf<Date>();
    expectTypeOf<DeepReadonly<number>>().toEqualTypeOf<number>();
    expectTypeOf<DeepReadonly<() => string>>().toEqualTypeOf<() => string>();
  });

  it("interdit l'affectation d'une propriété imbriquée", () => {
    const catalog: DeepReadonly<{ shelf: { code: string } }> = { shelf: { code: "A1" } };
    expectTypeOf(catalog.shelf).toEqualTypeOf<{ readonly code: string }>();
    // @ts-expect-error -- propriété en lecture seule
    catalog.shelf.code = "B2";
  });
});
