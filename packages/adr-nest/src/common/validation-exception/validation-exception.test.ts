import { StandardSchemaValidationPipe } from "@nestjs/common";
import { describe, expect, it } from "vitest";
import { z } from "zod";

import { ApiException } from "../api-exception";
import { ValidationException, apiValidationExceptionFactory } from "./validation-exception";

const createBookSchema = z.object({ title: z.string().min(1), year: z.int() });

describe("ValidationException", () => {
  it("produit une 400 VALIDATION_FAILED avec le détail par champ", () => {
    const exception = new ValidationException([
      { message: "Champ requis", path: ["title"] },
      { message: "Entier attendu", path: ["year"] },
    ]);
    expect(exception).toBeInstanceOf(ApiException);
    expect(exception.getStatus()).toBe(400);
    expect(exception.getResponse()).toEqual({
      type: "about:blank",
      title: "Données invalides",
      status: 400,
      code: "VALIDATION_FAILED",
      errors: [
        { path: "title", message: "Champ requis" },
        { path: "year", message: "Entier attendu" },
      ],
    });
  });

  it("accepte un autre code, titre et statut", () => {
    const exception = new ValidationException([{ message: "x" }], {
      code: "INVALID_QUERY",
      title: "Paramètres de liste invalides",
      status: 422,
    });
    expect(exception.getStatus()).toBe(422);
    expect(exception.getResponse()).toMatchObject({
      code: "INVALID_QUERY",
      title: "Paramètres de liste invalides",
      status: 422,
    });
  });
});

describe("apiValidationExceptionFactory", () => {
  it("donne une ValidationException", () => {
    expect(apiValidationExceptionFactory([{ message: "x" }])).toBeInstanceOf(ValidationException);
  });

  it("s'utilise avec le StandardSchemaValidationPipe natif de NestJS 12", async () => {
    const pipe = new StandardSchemaValidationPipe({
      exceptionFactory: apiValidationExceptionFactory,
    });
    const metadata = { type: "body" as const, schema: createBookSchema };

    await expect(pipe.transform({ title: "Dune", year: 1965 }, metadata)).resolves.toEqual({
      title: "Dune",
      year: 1965,
    });
    const error: unknown = await pipe
      .transform({ title: "", year: 1965.5 }, metadata)
      .catch((caught: unknown) => caught);
    expect(error).toBeInstanceOf(ValidationException);
    expect((error as ValidationException).getResponse().errors?.map((issue) => issue.path)).toEqual(
      ["title", "year"],
    );
  });
});
