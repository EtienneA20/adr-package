import { ValidationException } from "@etiennea20/adr-nest";
import type { ArgumentMetadata } from "@nestjs/common";
import { ROUTE_ARGS_METADATA } from "@nestjs/common/constants";
import { describe, expect, it } from "vitest";

import { nativeValidationPipe } from "../validation";
import { createBookSchema, updateBookSchema } from "./book.schemas";
import { BooksController } from "./books.controller";

interface IRouteArgument {
  index: number;
  pipes: { transform: (value: unknown, metadata: ArgumentMetadata) => unknown }[];
  schema?: unknown;
}

function argument(method: "create" | "update", index: number): IRouteArgument | undefined {
  const metadata = Reflect.getMetadata(ROUTE_ARGS_METADATA, BooksController, method) as Record<
    string,
    IRouteArgument
  >;
  return Object.values(metadata).find((candidate) => candidate.index === index);
}

async function rejection(promise: unknown): Promise<ValidationException> {
  return (await Promise.resolve(promise).catch((caught: unknown) => caught)) as ValidationException;
}

describe("validation des livres", () => {
  it("POST /livres : ValidBody renvoie la valeur nettoyée par le schéma", async () => {
    const pipe = argument("create", 0)?.pipes[0];
    await expect(
      pipe?.transform(
        { title: "  Bel-Ami ", authorName: "Maupassant", publishedAt: "1885-05-01" },
        { type: "body" },
      ),
    ).resolves.toEqual({ title: "Bel-Ami", authorName: "Maupassant", publishedAt: "1885-05-01" });
  });

  it("POST /livres : un corps invalide donne une 400 au format d'API, en français", async () => {
    const pipe = argument("create", 0)?.pipes[0];
    const error = await rejection(
      pipe?.transform({ title: " ", publishedAt: "01/05/1885" }, { type: "body" }),
    );
    expect(error).toBeInstanceOf(ValidationException);
    expect(error.getResponse()).toMatchObject({
      status: 400,
      code: "VALIDATION_FAILED",
      errors: [
        { path: "title", message: "Le titre est obligatoire.", code: "too_small" },
        { path: "authorName", code: "invalid_type" },
        {
          path: "publishedAt",
          message: "Date attendue au format AAAA-MM-JJ.",
          code: "invalid_format",
        },
      ],
    });
    expect(createBookSchema.safeParse({}).success).toBe(false);
  });

  it("PATCH /livres/:id : le schéma est déclaré sur le paramètre, validé par le pipe global", async () => {
    const parameter = argument("update", 1);
    expect(parameter?.schema).toBe(updateBookSchema);
    const metadata: ArgumentMetadata = { type: "body", schema: updateBookSchema };
    await expect(nativeValidationPipe.transform({ status: "loaned" }, metadata)).resolves.toEqual({
      status: "loaned",
    });
    const error = await rejection(nativeValidationPipe.transform({ status: "lost" }, metadata));
    expect(error.getResponse()).toMatchObject({
      code: "VALIDATION_FAILED",
      errors: [{ path: "status" }],
    });
  });
});
