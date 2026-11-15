import type { ExecutionContext, Type } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { describe, expect, it } from "vitest";

import { BooksController } from "../books";
import { HealthController } from "../health";
import { AuthGuard } from "./auth.guard";

function contextFor(
  controller: Type,
  handler: (...args: never[]) => unknown,
  user?: unknown,
): ExecutionContext {
  return {
    getClass: () => controller,
    getHandler: () => handler,
    switchToHttp: () => ({ getRequest: () => ({ user }) }),
  } as unknown as ExecutionContext;
}

const guard = new AuthGuard(new Reflector());

describe("AuthGuard", () => {
  it("laisse passer une route marquée @Public() sans utilisateur", () => {
    expect(guard.canActivate(contextFor(BooksController, BooksController.prototype.list))).toBe(
      true,
    );
  });

  it("laisse passer toutes les routes d'un contrôleur marqué @Public()", () => {
    expect(guard.canActivate(contextFor(HealthController, HealthController.prototype.check))).toBe(
      true,
    );
  });

  it("refuse une route protégée sans utilisateur", () => {
    expect(guard.canActivate(contextFor(BooksController, BooksController.prototype.get))).toBe(
      false,
    );
  });

  it("accepte une route protégée avec un utilisateur", () => {
    expect(
      guard.canActivate(
        contextFor(BooksController, BooksController.prototype.get, { id: "adherent-1" }),
      ),
    ).toBe(true);
  });
});
