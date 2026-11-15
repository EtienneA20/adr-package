import { describe, expect, expectTypeOf, it } from "vitest";
import { z } from "zod";

import type { IStandardSchema, InferSchemaOutput, StandardSchemaResult } from "./standard-schema";

const bookSchema = z.object({
  title: z.string(),
  year: z.coerce.number().int(),
});

describe("IStandardSchema", () => {
  it("est satisfait par un schéma zod 4 sans adaptateur", async () => {
    const schema: IStandardSchema<unknown, { title: string; year: number }> = bookSchema;
    const result = await schema["~standard"].validate({ title: "Dune", year: "1965" });
    expect(result).toEqual({ value: { title: "Dune", year: 1965 } });
  });

  it("renvoie des problèmes avec leur chemin", async () => {
    const result = await bookSchema["~standard"].validate({ title: 1, year: 1965 });
    expect(result.issues?.[0]?.path).toEqual(["title"]);
  });
});

describe("InferSchemaOutput", () => {
  it("donne le type de sortie du schéma", () => {
    expectTypeOf<InferSchemaOutput<typeof bookSchema>>().toEqualTypeOf<{
      title: string;
      year: number;
    }>();
  });
});

describe("StandardSchemaResult", () => {
  it("distingue la réussite de l'échec", () => {
    const success: StandardSchemaResult<number> = { value: 1 };
    const failure: StandardSchemaResult<number> = { issues: [{ message: "x" }] };
    expect("value" in success && !("value" in failure)).toBe(true);
  });
});
