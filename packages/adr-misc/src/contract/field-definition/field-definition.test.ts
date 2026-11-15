import { describe, expect, expectTypeOf, it } from "vitest";

import type {
  FieldDefinitions,
  FilterableField,
  SelectableField,
  SortableField,
} from "./field-definition";

const bookFields = {
  id: { type: "uuid", filter: ["eq", "in"], select: true },
  title: { type: "string", filter: true, sort: true, select: true, search: true },
  publishedAt: { type: "date", filter: false, sort: true },
  "author.name": { type: "string", sort: false },
} as const satisfies FieldDefinitions;

type BookFields = typeof bookFields;

describe("FilterableField", () => {
  it("garde les champs déclarés filtrables (true ou liste d'opérateurs)", () => {
    expectTypeOf<FilterableField<BookFields>>().toEqualTypeOf<"id" | "title">();
  });
});

describe("SortableField", () => {
  it("garde les champs déclarés triables", () => {
    expectTypeOf<SortableField<BookFields>>().toEqualTypeOf<"title" | "publishedAt">();
  });
});

describe("SelectableField", () => {
  it("garde les champs déclarés sélectionnables", () => {
    expectTypeOf<SelectableField<BookFields>>().toEqualTypeOf<"id" | "title">();
  });

  it("donne never si aucun champ n'est sélectionnable", () => {
    expectTypeOf<SelectableField<{ a: { type: "string" } }>>().toBeNever();
    expect(Object.keys(bookFields)).toHaveLength(4);
  });
});
