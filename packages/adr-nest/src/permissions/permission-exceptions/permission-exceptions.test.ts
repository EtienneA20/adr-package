import { describe, expect, it } from "vitest";

import { PermissionDeniedException, UnauthenticatedException } from "./permission-exceptions";
import { ApiException } from "../../common";

describe("UnauthenticatedException", () => {
  it("produit une 401 UNAUTHENTICATED au format d'erreur d'API", () => {
    const exception = new UnauthenticatedException();

    expect(exception).toBeInstanceOf(ApiException);
    expect(exception.getStatus()).toBe(401);
    expect(exception.getResponse()).toMatchObject({ status: 401, code: "UNAUTHENTICATED" });
  });
});

describe("PermissionDeniedException", () => {
  it("produit une 403 FORBIDDEN sans révéler la permission au client", () => {
    const exception = new PermissionDeniedException("cancel", "loan");

    expect(exception.getStatus()).toBe(403);
    expect(exception.getResponse()).toMatchObject({ code: "FORBIDDEN", title: "Accès refusé" });
    expect(JSON.stringify(exception.getResponse())).not.toMatch(/cancel|loan/);
    expect(exception).toMatchObject({ action: "cancel", resource: "loan" });
  });

  it("accepte l'absence de permission (route non annotée)", () => {
    expect(new PermissionDeniedException().action).toBeUndefined();
  });
});
