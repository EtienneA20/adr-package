import type { ExecutionContext } from "@nestjs/common";
import { describe, expect, it } from "vitest";

import { PermissionDeniedException, UnauthenticatedException } from "../permission-exceptions";
import type { IPermissionsDefinition } from "../permission-rule";
import { PermissionsConfigError } from "../permissions-config-error";
import { PermissionsService } from "./permissions-service";

const permissions: IPermissionsDefinition = {
  roles: {
    librarian: [{ action: "manage", resource: "all" }],
    member: [
      { action: "read", resource: "book" },
      { action: ["read", "cancel"], resource: "loan", where: { memberId: "$subject.id" } },
    ],
  },
};

const member = { id: "m-1", roles: ["member"] };
const librarian = { id: "b-1", roles: ["librarian"] };
const ownLoan = { id: "l-1", memberId: "m-1" };
const otherLoan = { id: "l-2", memberId: "m-2" };

function contextWith(request: object): ExecutionContext {
  return { switchToHttp: () => ({ getRequest: () => request }) } as unknown as ExecutionContext;
}

describe("PermissionsService", () => {
  const service = new PermissionsService({ permissions });

  it("valide et fige les règles à la construction", () => {
    expect(Object.isFrozen(service.definition.roles)).toBe(true);
    expect(
      () =>
        new PermissionsService({
          permissions: {
            roles: { member: [{ action: "read" }] },
          } as unknown as IPermissionsDefinition,
        }),
    ).toThrow(PermissionsConfigError);
  });

  it("résout le sujet depuis request.user par défaut, null si absent", async () => {
    await expect(service.resolveSubject(contextWith({ user: member }))).resolves.toBe(member);
    await expect(service.resolveSubject(contextWith({}))).resolves.toBeNull();
  });

  it("utilise la fonction subject fournie, même asynchrone", async () => {
    const custom = new PermissionsService({
      permissions,
      subject: (context) =>
        Promise.resolve(context.switchToHttp().getRequest<{ member?: typeof member }>().member),
    });
    await expect(custom.resolveSubject(contextWith({ member }))).resolves.toBe(member);
    await expect(custom.resolveSubject(contextWith({ user: member }))).resolves.toBeNull();
  });

  it("canOnSome : une règle porte sur l'action et la ressource, conditions ignorées", () => {
    expect(service.canOnSome(member, "cancel", "loan")).toBe(true);
    expect(service.canOnSome(member, "delete", "loan")).toBe(false);
    expect(service.canOnSome(null, "read", "book")).toBe(false);
    expect(service.canOnSome(librarian, "delete", "author")).toBe(true);
  });

  it("can : évalue les conditions sur la ressource chargée", () => {
    expect(service.can(member, "cancel", "loan", ownLoan)).toBe(true);
    expect(service.can(member, "cancel", "loan", otherLoan)).toBe(false);
    expect(service.can(librarian, "cancel", "loan", otherLoan)).toBe(true);
    expect(service.can(undefined, "read", "book", {})).toBe(false);
  });

  it("assertCan : 401 sans sujet, 403 sans droit, rien sinon", () => {
    expect(() => {
      service.assertCan(null, "cancel", "loan", ownLoan);
    }).toThrow(UnauthenticatedException);
    expect(() => {
      service.assertCan(member, "cancel", "loan", otherLoan);
    }).toThrow(PermissionDeniedException);
    expect(() => {
      service.assertCan(member, "cancel", "loan", ownLoan);
    }).not.toThrow();
  });

  it("scope : périmètre d'une liste selon les règles du sujet", () => {
    expect(service.scope(member, "read", "loan")).toEqual({
      path: "memberId",
      op: "eq",
      value: "m-1",
      caseSensitive: true,
    });
    expect(service.scope(librarian, "read", "loan")).toEqual({ and: [] });
    expect(service.scope(null, "read", "loan")).toEqual({ or: [] });
  });

  it("isKnownPermission : l'action est citée par une règle", () => {
    const strict = new PermissionsService({
      permissions: { roles: { member: permissions.roles.member ?? [] } },
    });
    expect(strict.isKnownPermission("cancel", "loan")).toBe(true);
    expect(strict.isKnownPermission("cancle", "loan")).toBe(false);
  });
});
