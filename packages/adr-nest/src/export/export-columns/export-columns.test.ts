import { describe, expect, it } from "vitest";

import { ExportConfigError } from "../export-config-error";
import { type IExportColumn, defineExportColumns, selectExportColumns } from "./export-columns";

interface IBook {
  title: string;
}

const columns = defineExportColumns<IBook>([
  { key: "title", header: "Titre", width: 30 },
  { key: "author.name", header: "Auteur" },
  { key: "price", header: "Prix", type: "currency" },
]);

describe("defineExportColumns", () => {
  it("renvoie les colonnes, figées", () => {
    expect(columns.map((column) => column.key)).toEqual(["title", "author.name", "price"]);
    expect(Object.isFrozen(columns)).toBe(true);
    expect(Object.isFrozen(columns[0])).toBe(true);
  });

  it("refuse une liste vide", () => {
    expect(() => defineExportColumns([])).toThrow(
      new ExportConfigError("Un export doit définir au moins une colonne."),
    );
  });

  it.each<[string, IExportColumn<IBook>[], string]>([
    ["une clé invalide", [{ key: "a-b", header: "A" }], "clé invalide"],
    ["une clé réservée vide", [{ key: "", header: "A" }], "clé invalide"],
    [
      "une clé en double",
      [
        { key: "a", header: "A" },
        { key: "a", header: "B" },
      ],
      "clé en double",
    ],
    ["un en-tête vide", [{ key: "a", header: "  " }], "en-tête vide"],
    [
      "un type inconnu",
      [{ key: "a", header: "A", type: "money" as never }],
      "type inconnu « money »",
    ],
    ["une largeur nulle", [{ key: "a", header: "A", width: 0 }], "largeur strictement positive"],
  ])("refuse %s", (_label, invalid, message) => {
    expect(() => defineExportColumns(invalid)).toThrow(message);
  });
});

describe("selectExportColumns", () => {
  it("garde toutes les colonnes sans demande", () => {
    expect(selectExportColumns(columns, undefined)).toBe(columns);
    expect(selectExportColumns(columns, [])).toBe(columns);
  });

  it("garde les colonnes demandées, dans l'ordre de la définition, et ignore les inconnues", () => {
    expect(
      selectExportColumns(columns, ["price", "title", "password"]).map((column) => column.key),
    ).toEqual(["title", "price"]);
  });

  it("garde toutes les colonnes si aucune demande ne correspond", () => {
    expect(selectExportColumns(columns, ["password"])).toBe(columns);
  });
});
