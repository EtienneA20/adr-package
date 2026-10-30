import { describe, expect, it } from "vitest";

import { TimeoutError } from "./timeout-error";

describe("TimeoutError", () => {
  it("est une Error nommée TimeoutError", () => {
    const error = new TimeoutError();
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(TimeoutError);
    expect(error.name).toBe("TimeoutError");
  });

  it("utilise un message français par défaut", () => {
    expect(new TimeoutError().message).toBe("Le délai d'attente est dépassé.");
  });

  it("accepte un message personnalisé", () => {
    expect(new TimeoutError("Catalogue injoignable").message).toBe("Catalogue injoignable");
  });
});
