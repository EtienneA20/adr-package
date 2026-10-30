import { describe, expect, it } from "vitest";

import { toError } from "./to-error";

describe("toError", () => {
  it("renvoie une instance d'Error telle quelle", () => {
    const error = new RangeError("Hors limites");
    expect(toError(error)).toBe(error);
  });

  it("convertit une chaîne en Error et conserve la cause", () => {
    const error = toError("Catalogue indisponible");
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe("Catalogue indisponible");
    expect(error.cause).toBe("Catalogue indisponible");
  });

  it("reprend la propriété message d'un objet", () => {
    const value = { message: "Quota atteint", status: 429 };
    const error = toError(value);
    expect(error.message).toBe("Quota atteint");
    expect(error.cause).toBe(value);
  });

  it.each([
    [404, "Valeur levée non conforme : 404"],
    [null, "Valeur levée non conforme : null"],
    [undefined, "Valeur levée non conforme : undefined"],
    [{ code: 500 }, 'Valeur levée non conforme : {"code":500}'],
    ["", "Valeur levée non conforme : "],
  ])("décrit la valeur %j quand elle n'a pas de message", (value, message) => {
    expect(toError(value).message).toBe(message);
  });

  it("décrit une structure circulaire par son type", () => {
    const value: Record<string, unknown> = {};
    value.self = value;
    expect(toError(value).message).toBe("Valeur levée non conforme : [object Object]");
  });
});
