import { defineListQuery } from "@etiennea20/adr-misc/contract";
import { describe, expect, it } from "vitest";

import { ListQueryConfigError } from "../list-query-config-error";
import { resolveColumns } from "./resolve-columns";

const definition = defineListQuery({
  fields: { title: { type: "string", sort: true }, authorName: { type: "string", sort: true } },
});

describe("resolveColumns", () => {
  it("garde le nom du champ par défaut et applique les colonnes déclarées", () => {
    expect([...resolveColumns(definition, { authorName: "author.profile.name" })]).toEqual([
      ["title", "title"],
      ["authorName", "author.profile.name"],
    ]);
  });

  it("refuse une colonne pour un champ absent du contrat", () => {
    expect(() => resolveColumns(definition, { isbn: "isbn13" })).toThrow(
      new ListQueryConfigError("Colonne déclarée pour un champ absent du contrat : « isbn »."),
    );
  });

  it.each(["author..name", "author-name", "1title", "author.__proto__", ""])(
    "refuse le chemin %j",
    (path) => {
      expect(() => resolveColumns(definition, { title: path })).toThrow(ListQueryConfigError);
    },
  );
});
