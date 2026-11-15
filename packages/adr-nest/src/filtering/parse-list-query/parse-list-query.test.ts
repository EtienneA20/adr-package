import { defineListQuery, toListQuerySearchParams } from "@etiennea20/adr-misc/contract";
import { describe, expect, it } from "vitest";

import { parseListQuery } from "./parse-list-query";
import { ValidationException } from "../../common";

const bookListQuery = defineListQuery({
  fields: { title: { type: "string", filter: true, sort: true }, internal: { type: "string" } },
  limits: { maxConditions: 2 },
});
const title = { field: "title", op: "contains", value: "dune" };

async function failure(input: unknown, source?: "query" | "body"): Promise<ValidationException> {
  return Promise.resolve()
    .then(() => {
      parseListQuery(bookListQuery, input, { source });
      throw new Error("aucune erreur levée");
    })
    .catch((caught: unknown) => caught as ValidationException);
}

describe("parseListQuery", () => {
  it("lit les paramètres d'URL par défaut", () => {
    const criteria = parseListQuery(
      bookListQuery,
      toListQuerySearchParams({ filter: title, page: 2 }),
    );
    expect(criteria).toMatchObject({ where: { path: "title", op: "contains" }, page: 2, skip: 20 });
  });

  it("lit un corps d'objet avec la source body", () => {
    expect(
      parseListQuery(bookListQuery, { filter: title }, { source: "body" }).where,
    ).toMatchObject({
      path: "title",
    });
  });

  it("refuse un champ hors liste blanche : 400 INVALID_QUERY avec le chemin", async () => {
    const error = await failure({ filter: { field: "internal", op: "eq", value: "x" } }, "body");
    expect(error).toBeInstanceOf(ValidationException);
    expect(error.getResponse()).toMatchObject({
      status: 400,
      code: "INVALID_QUERY",
      title: "Paramètres de liste invalides",
      errors: [{ path: "filter.field", message: "Le champ « internal » n'est pas filtrable." }],
    });
  });

  it("signale un dépassement de limite par QUERY_LIMIT_EXCEEDED", async () => {
    const error = await failure({ filter: JSON.stringify({ and: [title, title, title] }) });
    expect(error.getResponse()).toMatchObject({
      code: "QUERY_LIMIT_EXCEEDED",
      title: "Limite de la requête de liste dépassée",
      errors: [{ path: "filter", code: "QUERY_LIMIT_EXCEEDED" }],
    });
  });

  it("refuse un filtre JSON invalide dans l'URL", async () => {
    expect((await failure({ filter: "{" })).getResponse().code).toBe("INVALID_QUERY");
  });
});
