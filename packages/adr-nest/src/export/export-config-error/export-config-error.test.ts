import { describe, expect, it } from "vitest";

import { ExportConfigError } from "./export-config-error";

describe("ExportConfigError", () => {
  it("est une Error nommée", () => {
    const error = new ExportConfigError("Colonnes invalides");
    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe("ExportConfigError");
    expect(error.message).toBe("Colonnes invalides");
  });
});
