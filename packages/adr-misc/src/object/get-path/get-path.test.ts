import { describe, expect, expectTypeOf, it } from "vitest";

import { getPath, type PathValue } from "./get-path";

interface IBook {
  title: string;
  author?: { name: string; address: { city: string } | null };
  items: { title: string }[];
  tags: Record<string, number>;
}

const book: IBook = {
  title: "Germinal",
  author: { name: "Zola", address: { city: "Paris" } },
  items: [{ title: "Tome 1" }],
  tags: { classique: 1 },
};

describe("getPath", () => {
  it("lit une valeur imbriquée", () => {
    expect(getPath(book, "author.address.city")).toBe("Paris");
  });

  it("lit un élément de tableau par son index", () => {
    expect(getPath(book, "items.0.title")).toBe("Tome 1");
    expect(getPath(book, "items.length")).toBe(1);
  });

  it("renvoie undefined si un parent manque", () => {
    const withoutAuthor: IBook = { ...book, author: undefined };
    expect(getPath(withoutAuthor, "author.address.city")).toBeUndefined();
    const loose: Record<string, unknown> = { a: null, b: "texte" };
    expect(getPath(loose, "a.b")).toBeUndefined();
    expect(getPath(loose, "b.length")).toBeUndefined();
    expect(getPath(book, "items.5.title")).toBeUndefined();
  });

  it("renvoie la valeur par défaut si le chemin n'aboutit pas", () => {
    expect(getPath({ a: undefined }, "a", "défaut")).toBe("défaut");
    expect(getPath(book, "author.address.city", "Ville inconnue")).toBe("Paris");
    expect(getPath(null, "a", 0)).toBe(0);
  });

  it("conserve les valeurs falsy autres que undefined", () => {
    const withNull: Record<string, unknown> = { a: { b: null } };
    expect(getPath(withNull, "a.b", "défaut")).toBeNull();
    expect(getPath({ a: 0 }, "a", 1)).toBe(0);
  });

  it("déduit le type de la valeur à partir du chemin", () => {
    expectTypeOf(getPath(book, "title")).toEqualTypeOf<string>();
    expectTypeOf(getPath(book, "author.address.city")).toEqualTypeOf<string | undefined>();
    expectTypeOf(getPath(book, "items.0.title")).toEqualTypeOf<string | undefined>();
    expectTypeOf(getPath(book, "tags.classique")).toEqualTypeOf<number | undefined>();
    expectTypeOf<PathValue<IBook, "unknown.key">>().toEqualTypeOf<undefined>();
    expectTypeOf(getPath(book, "author.name", "Anonyme")).toEqualTypeOf<string>();
  });

  it("type la valeur en unknown pour un chemin dynamique ou un objet unknown", () => {
    const paths: string[] = ["title"];
    const path = paths[0] ?? "";
    const data: unknown = { title: "Nana" };
    expectTypeOf(getPath(book, path)).toEqualTypeOf<unknown>();
    expectTypeOf(getPath(data, "title")).toEqualTypeOf<unknown>();
    expect(getPath(data, "title")).toBe("Nana");
  });
});
