import { Controller, Post } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { describe, expect, it } from "vitest";

import { REQUIRED_PERMISSION_KEY } from "../route-access";
import { Can } from "./can";

@Controller("emprunts")
class LoansController {
  @Can("cancel", "loan")
  @Post(":id/annulation")
  cancel(): string {
    return "annulé";
  }
}

@Can("manage", "book")
@Controller("livres")
class BooksController {}

describe("Can", () => {
  it("pose l'action et la ressource exigées sur une méthode", () => {
    expect(new Reflector().get(REQUIRED_PERMISSION_KEY, LoansController.prototype.cancel)).toEqual({
      action: "cancel",
      resource: "loan",
    });
  });

  it("pose la permission sur un contrôleur", () => {
    expect(new Reflector().get(REQUIRED_PERMISSION_KEY, BooksController)).toEqual({
      action: "manage",
      resource: "book",
    });
  });

  it("n'empêche pas l'appel de la méthode décorée", () => {
    expect(new LoansController().cancel()).toBe("annulé");
  });
});
