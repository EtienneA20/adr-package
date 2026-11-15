import { defineListQuery } from "@etiennea20/adr-misc/contract";
import { Body, Controller, Get, Post, type ExecutionContext } from "@nestjs/common";
import { ROUTE_ARGS_METADATA } from "@nestjs/common/constants";
import { Test } from "@nestjs/testing";
import { describe, expect, it } from "vitest";

import { ValidationException } from "../../common";
import type { IListCriteria } from "../list-criteria";
import { ListQueryConfigError } from "../list-query-config-error";
import { ListQuery } from "./list-query";

const bookListQuery = defineListQuery({
  fields: {
    title: { type: "string", filter: true, sort: true },
    authorName: { type: "string", filter: ["contains"], sort: true },
  },
});

@Controller("livres")
class BooksController {
  @Get()
  list(
    @ListQuery(bookListQuery, { columns: { authorName: "author.name" } }) criteria: IListCriteria,
  ) {
    return criteria;
  }

  @Post("search")
  search(
    @ListQuery(bookListQuery, { source: "body" }) criteria: IListCriteria,
    @Body() body: unknown,
  ) {
    return { criteria, body };
  }
}

type Factory = (data: unknown, context: ExecutionContext) => unknown;

function factoryOf(method: "list" | "search"): Factory {
  const metadata = Reflect.getMetadata(ROUTE_ARGS_METADATA, BooksController, method) as Record<
    string,
    { index: number; factory?: Factory }
  >;
  const entry = Object.values(metadata).find((candidate) => candidate.index === 0);
  if (!entry?.factory) throw new Error("décorateur absent");
  return entry.factory;
}

function contextFor(request: { query?: unknown; body?: unknown }): ExecutionContext {
  return { switchToHttp: () => ({ getRequest: () => request }) } as unknown as ExecutionContext;
}

describe("ListQuery", () => {
  it("convertit req.query en critères, colonnes appliquées", () => {
    const criteria = factoryOf("list")(
      undefined,
      contextFor({ query: { sort: '[{"field":"authorName","direction":"desc"}]', page: "2" } }),
    ) as IListCriteria;
    expect(criteria).toMatchObject({
      orderBy: [{ path: "author.name", direction: "desc" }],
      page: 2,
    });
  });

  it("lit req.body avec la source body", () => {
    const criteria = factoryOf("search")(
      undefined,
      contextFor({ body: { filter: { field: "title", op: "eq", value: "Dune" } } }),
    ) as IListCriteria;
    expect(criteria.where).toMatchObject({ path: "title", value: "Dune" });
  });

  it("lève une 400 au format d'API pour une requête invalide", () => {
    expect(() => factoryOf("list")(undefined, contextFor({ query: { page: "0" } }))).toThrow(
      ValidationException,
    );
  });

  it("vérifie les colonnes dès la déclaration", () => {
    expect(() => ListQuery(bookListQuery, { columns: { isbn: "isbn" } as never })).toThrow(
      ListQueryConfigError,
    );
  });

  it("se compile dans un module NestJS", async () => {
    const moduleRef = await Test.createTestingModule({ controllers: [BooksController] }).compile();
    expect(moduleRef.get(BooksController)).toBeInstanceOf(BooksController);
    await moduleRef.close();
  });
});
