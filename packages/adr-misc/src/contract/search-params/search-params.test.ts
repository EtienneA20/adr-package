import { describe, expect, it } from "vitest";

import { toListQuerySearchParams } from "./search-params";

describe("toListQuerySearchParams", () => {
  it("encode chaque clé, en JSON sauf les textes simples", () => {
    expect(
      toListQuerySearchParams({
        q: "dune",
        page: 2,
        withTotal: false,
        sort: [{ field: "title", direction: "asc" }],
        filter: { field: "title", op: "contains", value: "a" },
      }),
    ).toEqual({
      q: "dune",
      page: "2",
      withTotal: "false",
      sort: '[{"field":"title","direction":"asc"}]',
      filter: '{"field":"title","op":"contains","value":"a"}',
    });
  });

  it.each(["123", "true", "null", '"cité"', "[1]"])(
    "encode en JSON le texte %j qui serait relu comme du JSON",
    (value) => {
      expect(toListQuerySearchParams({ q: value }).q).toBe(JSON.stringify(value));
    },
  );

  it("omet les clés undefined et garde null", () => {
    expect(toListQuerySearchParams({ q: undefined, filter: null })).toEqual({ filter: "null" });
  });

  it("renvoie un objet vide pour une requête vide", () => {
    expect(toListQuerySearchParams({})).toEqual({});
  });
});
