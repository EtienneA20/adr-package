import { describe, expect, expectTypeOf, it } from "vitest";

import type { Result } from "../result";
import { tryCatch } from "./try-catch";

describe("tryCatch", () => {
  it("renvoie la valeur en cas de succès", () => {
    const result = tryCatch(() => JSON.parse('{"bookId":"b1"}') as { bookId: string });
    expect(result).toEqual({ ok: true, value: { bookId: "b1" } });
    expectTypeOf(result).toEqualTypeOf<Result<{ bookId: string }>>();
  });

  it("renvoie l'erreur levée en cas d'échec", () => {
    const result = tryCatch(() => JSON.parse("{") as unknown);
    expect(result).toEqual({ ok: false, error: expect.any(SyntaxError) as unknown });
  });

  it("normalise une valeur levée qui n'est pas une Error", () => {
    const result = tryCatch(() => {
      // eslint-disable-next-line @typescript-eslint/only-throw-error -- cas testé volontairement
      throw "Livre introuvable";
    });
    expect(result).toEqual({ ok: false, error: new Error("Livre introuvable") });
  });

  it("accepte une valeur de retour undefined", () => {
    expect(tryCatch(() => undefined)).toEqual({ ok: true, value: undefined });
  });
});
