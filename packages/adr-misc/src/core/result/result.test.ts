import { describe, expect, expectTypeOf, it } from "vitest";

import type { Result } from "./result";

function parseIsbn(input: string): Result<string, string> {
  const isbn = input.replaceAll("-", "");
  return /^\d{13}$/.test(isbn) ? { ok: true, value: isbn } : { ok: false, error: "ISBN invalide" };
}

describe("Result", () => {
  it("expose la valeur en cas de succès", () => {
    const result = parseIsbn("978-2-07-036024-5");
    expect(result).toEqual({ ok: true, value: "9782070360245" });
    if (result.ok) {
      expectTypeOf(result.value).toEqualTypeOf<string>();
    }
  });

  it("expose l'erreur en cas d'échec", () => {
    const result = parseIsbn("abc");
    expect(result).toEqual({ ok: false, error: "ISBN invalide" });
    if (!result.ok) {
      expectTypeOf(result.error).toEqualTypeOf<string>();
    }
  });

  it("utilise Error comme type d'erreur par défaut", () => {
    expectTypeOf<Extract<Result<number>, { ok: false }>["error"]>().toEqualTypeOf<Error>();
    expectTypeOf<Extract<Result<number>, { ok: true }>["value"]>().toEqualTypeOf<number>();
  });
});
