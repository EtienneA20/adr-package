import { describe, expect, it } from "vitest";

import { PermissionsConfigError } from "./permissions-config-error";

describe("PermissionsConfigError", () => {
  it("liste les problèmes, un par ligne du message", () => {
    const error = new PermissionsConfigError(["roles.member[0] : a.", "Loans.list : b."]);

    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe("PermissionsConfigError");
    expect(error.issues).toEqual(["roles.member[0] : a.", "Loans.list : b."]);
    expect(error.message).toBe(
      "Configuration des permissions invalide :\n- roles.member[0] : a.\n- Loans.list : b.",
    );
  });
});
