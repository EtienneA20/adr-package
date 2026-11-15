import {
  PermissionDeniedException,
  PermissionsGuard,
  PermissionsService,
  UnauthenticatedException,
} from "@etiennea20/adr-nest";
import type { ExecutionContext, Type } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Test } from "@nestjs/testing";
import { describe, expect, it } from "vitest";

import { AppModule } from "../app.module";
import { BooksController } from "../books";
import { HealthController } from "../health";
import { LoansController } from "../loans";
import { memberSubject } from "./member-subject";

const librarian = { sub: "bibliothecaire-1", roles: ["librarian"] };
const member = { sub: "adherent-1", roles: ["member"] };

function contextFor<T>(controller: Type<T>, handler: keyof T, user?: object): ExecutionContext {
  const request = user ? { user } : {};
  const prototype = controller.prototype as T;
  return {
    getClass: () => controller,
    getHandler: () => prototype[handler],
    switchToHttp: () => ({ getRequest: () => request }),
  } as unknown as ExecutionContext;
}

async function createGuard(): Promise<PermissionsGuard> {
  const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
  return new PermissionsGuard(new Reflector(), moduleRef.get(PermissionsService));
}

describe("memberSubject", () => {
  it("traduit la charge utile du jeton en adhérent, null si anonyme", () => {
    expect(memberSubject(contextFor(LoansController, "list", member))).toEqual({
      id: "adherent-1",
      roles: ["member"],
    });
    expect(memberSubject(contextFor(LoansController, "list", { sub: "x" }))).toEqual({
      id: "x",
      roles: [],
    });
    expect(memberSubject(contextFor(LoansController, "list"))).toBeNull();
  });
});

describe("permissions de la bibliothèque", () => {
  it("ouvre le catalogue et la santé sans compte", async () => {
    const guard = await createGuard();

    await expect(guard.canActivate(contextFor(BooksController, "list"))).resolves.toBe(true);
    await expect(guard.canActivate(contextFor(HealthController, "check"))).resolves.toBe(true);
  });

  it("réserve le détail d'un livre aux utilisateurs connectés (401 sinon)", async () => {
    const guard = await createGuard();

    await expect(guard.canActivate(contextFor(BooksController, "get"))).rejects.toThrow(
      UnauthenticatedException,
    );
    await expect(guard.canActivate(contextFor(BooksController, "get", member))).resolves.toBe(true);
  });

  it("réserve la gestion du catalogue et l'export aux bibliothécaires (403 sinon)", async () => {
    const guard = await createGuard();

    for (const route of ["create", "update", "export"] as const) {
      await expect(guard.canActivate(contextFor(BooksController, route, member))).rejects.toThrow(
        PermissionDeniedException,
      );
      await expect(guard.canActivate(contextFor(BooksController, route, librarian))).resolves.toBe(
        true,
      );
    }
  });

  it("ouvre les emprunts aux adhérents, le service vérifiant ensuite l'emprunt", async () => {
    const guard = await createGuard();

    await expect(guard.canActivate(contextFor(LoansController, "cancel", member))).resolves.toBe(
      true,
    );
    await expect(
      guard.canActivate(contextFor(LoansController, "list", { sub: "x", roles: [] })),
    ).rejects.toThrow(PermissionDeniedException);
  });
});
