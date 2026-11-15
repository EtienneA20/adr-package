import { Controller, type ExecutionContext, Get, Post } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { describe, expect, it } from "vitest";

import { Authenticated } from "../authenticated";
import { Can } from "../can";
import { PermissionDeniedException, UnauthenticatedException } from "../permission-exceptions";
import { PermissionsModule } from "../permissions-module";
import { Public } from "../public";
import { readSubject } from "../subject-store";
import { PermissionsGuard } from "./permissions-guard";

@Controller("emprunts")
class LoansController {
  @Public()
  @Get("tarifs")
  prices(): string {
    return "";
  }

  @Authenticated()
  @Get("moi")
  mine(): string {
    return "";
  }

  @Can("cancel", "loan")
  @Post(":id/annulation")
  cancel(): string {
    return "";
  }

  @Get("oubli")
  forgotten(): string {
    return "";
  }
}

const member = { id: "m-1", roles: ["member"] };

async function createGuard(): Promise<PermissionsGuard> {
  // globalGuard: false : le guard est enregistré par l'application, comme après un guard
  // d'authentification global.
  const moduleRef = await Test.createTestingModule({
    imports: [
      PermissionsModule.forRoot({
        permissions: {
          roles: {
            member: [{ action: "cancel", resource: "loan", where: { memberId: "$subject.id" } }],
          },
        },
        strict: false,
        globalGuard: false,
      }),
    ],
    controllers: [LoansController],
    providers: [PermissionsGuard],
  }).compile();
  return moduleRef.get(PermissionsGuard);
}

function contextFor(handler: keyof LoansController, request: object): ExecutionContext {
  return {
    getHandler: () => LoansController.prototype[handler],
    getClass: () => LoansController,
    switchToHttp: () => ({ getRequest: () => request }),
  } as unknown as ExecutionContext;
}

describe("PermissionsGuard", () => {
  it("laisse passer une route publique sans sujet, en rangeant le sujet (null)", async () => {
    const guard = await createGuard();
    const request = {};

    await expect(guard.canActivate(contextFor("prices", request))).resolves.toBe(true);
    expect(readSubject(request)).toBeNull();
  });

  it("répond 401 sans sujet sur une route protégée", async () => {
    const guard = await createGuard();

    await expect(guard.canActivate(contextFor("mine", {}))).rejects.toThrow(
      UnauthenticatedException,
    );
    await expect(guard.canActivate(contextFor("cancel", {}))).rejects.toThrow(
      UnauthenticatedException,
    );
  });

  it("accepte tout sujet sur une route @Authenticated() et le rend disponible", async () => {
    const guard = await createGuard();
    const request = { user: { roles: [] } };

    await expect(guard.canActivate(contextFor("mine", request))).resolves.toBe(true);
    expect(readSubject(request)).toBe(request.user);
  });

  it("vérifie la permission d'une route @Can() (conditions évaluées plus tard)", async () => {
    const guard = await createGuard();

    await expect(guard.canActivate(contextFor("cancel", { user: member }))).resolves.toBe(true);
    await expect(
      guard.canActivate(contextFor("cancel", { user: { id: "x", roles: ["visitor"] } })),
    ).rejects.toThrow(PermissionDeniedException);
  });

  it("refuse par défaut une route sans annotation (403)", async () => {
    const guard = await createGuard();

    await expect(guard.canActivate(contextFor("forgotten", { user: member }))).rejects.toThrow(
      PermissionDeniedException,
    );
  });
});
