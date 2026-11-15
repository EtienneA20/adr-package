import { describe, expect, it } from "vitest";

import { ListQueryConfigError } from "./list-query-config-error";

describe("ListQueryConfigError", () => {
  it("est une Error nommée, avec le message donné", () => {
    const error = new ListQueryConfigError("Colonne invalide");
    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe("ListQueryConfigError");
    expect(error.message).toBe("Colonne invalide");
  });
});
