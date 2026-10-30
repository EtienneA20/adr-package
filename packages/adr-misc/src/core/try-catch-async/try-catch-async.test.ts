import { describe, expect, expectTypeOf, it } from "vitest";

import type { Result } from "../result";
import { tryCatchAsync } from "./try-catch-async";

describe("tryCatchAsync", () => {
  it("renvoie la valeur d'une promesse résolue", async () => {
    const result = await tryCatchAsync(Promise.resolve(["Germinal"]));
    expect(result).toEqual({ ok: true, value: ["Germinal"] });
    expectTypeOf(result).toEqualTypeOf<Result<string[]>>();
  });

  it("renvoie la valeur produite par une fonction asynchrone", async () => {
    const result = await tryCatchAsync(() => Promise.resolve(3));
    expect(result).toEqual({ ok: true, value: 3 });
  });

  it("renvoie l'erreur d'une promesse rejetée", async () => {
    const error = new Error("Catalogue indisponible");
    expect(await tryCatchAsync(Promise.reject(error))).toEqual({ ok: false, error });
  });

  it("intercepte une erreur levée de façon synchrone par la fonction", async () => {
    const result = await tryCatchAsync<number>(() => {
      throw new TypeError("Paramètre invalide");
    });
    expect(result).toEqual({ ok: false, error: expect.any(TypeError) as unknown });
  });

  it("normalise un rejet qui n'est pas une Error", async () => {
    // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors -- cas testé volontairement
    const result = await tryCatchAsync(Promise.reject("Adhérent suspendu"));
    expect(result).toEqual({ ok: false, error: new Error("Adhérent suspendu") });
  });
});
