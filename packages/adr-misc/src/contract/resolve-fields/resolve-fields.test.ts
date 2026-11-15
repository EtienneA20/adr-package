import { describe, expect, it } from "vitest";

import type { FieldDefinitions } from "../field-definition";
import { FIELD_TYPE_OPERATORS } from "../field-type";
import { resolveFields } from "./resolve-fields";

describe("resolveFields", () => {
  it("rend les capacités explicites, refusées par défaut", () => {
    expect(resolveFields({ title: { type: "string" } }).title).toEqual({
      name: "title",
      type: "string",
      values: undefined,
      operators: [],
      sortable: false,
      selectable: false,
      searchable: false,
    });
  });

  it("donne tous les opérateurs du type pour filter: true", () => {
    const fields = resolveFields({
      title: { type: "string", filter: true, sort: true, select: true, search: true },
    });
    expect(fields.title).toMatchObject({
      operators: FIELD_TYPE_OPERATORS.string,
      sortable: true,
      selectable: true,
      searchable: true,
    });
  });

  it("garde une liste d'opérateurs restreinte et les valeurs d'un enum", () => {
    const fields = resolveFields({
      status: { type: "enum", values: ["available", "loaned"], filter: ["eq", "in"] },
    });
    expect(fields.status?.operators).toEqual(["eq", "in"]);
    expect(fields.status?.values).toEqual(["available", "loaned"]);
  });

  it("accepte un chemin de relation à un niveau", () => {
    expect(resolveFields({ "author.name": { type: "string" } })["author.name"]?.name).toBe(
      "author.name",
    );
  });

  it("renvoie des objets figés", () => {
    const fields = resolveFields({ title: { type: "string", filter: true } });
    expect(Object.isFrozen(fields)).toBe(true);
    expect(Object.isFrozen(fields.title)).toBe(true);
    expect(Object.isFrozen(fields.title?.operators)).toBe(true);
  });

  it("refuse un contrat sans champ", () => {
    expect(() => resolveFields({})).toThrow(
      new RangeError("Le contrat de liste doit définir au moins un champ."),
    );
  });

  it.each(["a.b.c", "1title", "ti-tle", "", "author.", "author.__proto__", "constructor"])(
    "refuse le nom de champ %j",
    (name) => {
      expect(() => resolveFields({ [name]: { type: "string" } })).toThrow(
        `Nom de champ invalide « ${name} »`,
      );
    },
  );

  it.each<[string, FieldDefinitions, string]>([
    ["un type inconnu", { a: { type: "text" as "string" } }, "type inconnu « text »"],
    ["un enum sans valeurs", { a: { type: "enum" } }, "exige une liste « values »"],
    ["un enum vide", { a: { type: "enum", values: [] } }, "exige une liste « values »"],
    ["un enum en doublon", { a: { type: "enum", values: ["x", "x"] } }, "sans doublon"],
    ["des values hors enum", { a: { type: "string", values: ["x"] } }, "réservé au type « enum »"],
    [
      "un opérateur incompatible",
      { a: { type: "string", filter: ["gt"] } },
      "permis pour « string »",
    ],
    ["une liste d'opérateurs vide", { a: { type: "number", filter: [] } }, "opérateurs de filtre"],
    ["un opérateur en doublon", { a: { type: "number", filter: ["eq", "eq"] } }, "opérateurs"],
    ["une recherche hors texte", { a: { type: "number", search: true } }, "réservée au type"],
  ])("refuse %s", (_label, fields, message) => {
    expect(() => resolveFields(fields)).toThrow(message);
  });
});
