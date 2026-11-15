import { Controller, Get } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { describe, expect, it } from "vitest";

import { IS_AUTHENTICATED_KEY } from "../route-access";
import { Authenticated } from "./authenticated";

@Controller("profil")
class ProfileController {
  @Authenticated()
  @Get()
  me(): string {
    return "moi";
  }
}

@Authenticated()
@Controller("compte")
class AccountController {}

describe("Authenticated", () => {
  it("pose la métadonnée sur une méthode", () => {
    expect(new Reflector().get(IS_AUTHENTICATED_KEY, ProfileController.prototype.me)).toBe(true);
  });

  it("pose la métadonnée sur un contrôleur", () => {
    expect(new Reflector().get(IS_AUTHENTICATED_KEY, AccountController)).toBe(true);
  });

  it("utilise une clé préfixée par l'espace de noms du package", () => {
    expect(IS_AUTHENTICATED_KEY).toBe("adr:isAuthenticated");
  });
});
