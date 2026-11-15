import { Controller, Get, Post } from "@nestjs/common";
import { ROUTE_ARGS_METADATA } from "@nestjs/common/constants";
import { RouteParamtypes } from "@nestjs/common/enums/route-paramtypes.enum";
import { Test } from "@nestjs/testing";
import { describe, expect, expectTypeOf, it } from "vitest";
import { z } from "zod";

import type { IStandardSchema } from "../standard-schema";
import { ValidationException } from "../validation-exception";
import { SchemaValidationPipe, ValidBody, ValidQuery } from "./schema-validation-pipe";

const createBookSchema = z.object({
  title: z.string().trim().min(1),
  year: z.int().min(1450),
  tags: z.array(z.string()).default([]),
});
const availableQuerySchema = z.object({ limit: z.coerce.number().int().max(50).default(10) });

interface IRouteArgument {
  index: number;
  pipes: unknown[];
}

@Controller("livres")
class BooksController {
  @Post()
  create(@ValidBody(createBookSchema) input: z.output<typeof createBookSchema>) {
    return input;
  }

  @Get("disponibles")
  available(
    @ValidQuery(availableQuerySchema, { code: "INVALID_QUERY" })
    query: z.output<typeof availableQuerySchema>,
  ) {
    return query;
  }
}

function routeArguments(method: "create" | "available"): IRouteArgument[] {
  const metadata = Reflect.getMetadata(ROUTE_ARGS_METADATA, BooksController, method) as Record<
    string,
    IRouteArgument
  >;
  return Object.entries(metadata).map(([key, value]) => ({ ...value, key }));
}

describe("SchemaValidationPipe", () => {
  const pipe = new SchemaValidationPipe(createBookSchema);

  it("renvoie la valeur produite par le schéma", async () => {
    await expect(pipe.transform({ title: "  Dune ", year: 1965, extra: true })).resolves.toEqual({
      title: "Dune",
      year: 1965,
      tags: [],
    });
  });

  it("type la sortie à partir du schéma", () => {
    expectTypeOf(pipe.transform).returns.resolves.toEqualTypeOf<{
      title: string;
      year: number;
      tags: string[];
    }>();
  });

  it("lève une ValidationException avec le détail par champ", async () => {
    const error = await pipe
      .transform({ title: " ", year: 1200 })
      .catch((caught: unknown) => caught);
    expect(error).toBeInstanceOf(ValidationException);
    expect((error as ValidationException).getResponse()).toMatchObject({
      status: 400,
      code: "VALIDATION_FAILED",
      errors: [
        { path: "title", code: "too_small" },
        { path: "year", code: "too_small" },
      ],
    });
  });

  it("applique les options de l'erreur", async () => {
    const queryPipe = new SchemaValidationPipe(availableQuerySchema, { code: "INVALID_QUERY" });
    await expect(queryPipe.transform({ limit: "100" })).rejects.toMatchObject({
      code: "INVALID_QUERY",
    });
  });

  it("accepte un schéma asynchrone d'une autre bibliothèque", async () => {
    const asyncSchema: IStandardSchema<unknown, string> = {
      "~standard": {
        version: 1,
        vendor: "test",
        validate: (value) =>
          Promise.resolve(
            typeof value === "string" ? { value } : { issues: [{ message: "Texte attendu" }] },
          ),
      },
    };
    const asyncPipe = new SchemaValidationPipe(asyncSchema);
    await expect(asyncPipe.transform("ok")).resolves.toBe("ok");
    await expect(asyncPipe.transform(1)).rejects.toBeInstanceOf(ValidationException);
  });
});

describe("ValidBody et ValidQuery", () => {
  it("branchent le pipe sur le corps et sur les paramètres de requête", () => {
    const [body] = routeArguments("create");
    const [query] = routeArguments("available");

    expect(body).toMatchObject({ key: `${RouteParamtypes.BODY}:0`, index: 0 });
    expect(query).toMatchObject({ key: `${RouteParamtypes.QUERY}:0`, index: 0 });
    expect((body?.pipes[0] as SchemaValidationPipe<IStandardSchema>).schema).toBe(createBookSchema);
    expect((query?.pipes[0] as SchemaValidationPipe<IStandardSchema>).schema).toBe(
      availableQuerySchema,
    );
  });

  it("valident avec le pipe branché, options comprises", async () => {
    const [query] = routeArguments("available");
    const queryPipe = query?.pipes[0] as SchemaValidationPipe<typeof availableQuerySchema>;
    await expect(queryPipe.transform({ limit: "5" })).resolves.toEqual({ limit: 5 });
    await expect(queryPipe.transform({ limit: "x" })).rejects.toMatchObject({
      code: "INVALID_QUERY",
    });
  });

  it("se compilent dans un module NestJS", async () => {
    const moduleRef = await Test.createTestingModule({ controllers: [BooksController] }).compile();
    expect(
      moduleRef.get(BooksController).create({ title: "Dune", year: 1965, tags: [] }).title,
    ).toBe("Dune");
    await moduleRef.close();
  });
});
