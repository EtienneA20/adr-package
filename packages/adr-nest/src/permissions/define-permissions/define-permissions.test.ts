import { describe, expect, it } from "vitest";

import type { IPermissionsDefinition } from "../permission-rule";
import { PermissionsConfigError } from "../permissions-config-error";
import { definePermissions } from "./define-permissions";

describe("definePermissions", () => {
  it("renvoie une copie validée, figée en profondeur et sérialisable", () => {
    const input = {
      roles: {
        member: [{ action: ["read"], resource: "loan", where: { memberId: "$subject.id" } }],
      },
    };
    const definition = definePermissions(input);

    expect(definition).toEqual(input);
    expect(definition).not.toBe(input);
    expect(Object.isFrozen(definition.roles.member?.[0]?.where)).toBe(true);
    expect(Object.isFrozen(definition.roles.member?.[0]?.action)).toBe(true);
    expect(JSON.parse(JSON.stringify(definition))).toEqual(input);
  });

  it("accepte des règles chargées d'un JSON", () => {
    const raw = '{"roles":{"librarian":[{"action":"manage","resource":"all"}]}}';

    expect(definePermissions(JSON.parse(raw) as IPermissionsDefinition).roles).toHaveProperty(
      "librarian",
    );
  });

  it("lève PermissionsConfigError avec tous les problèmes", () => {
    const invalid = {
      roles: { member: [{ action: "", resource: "loan" }, { action: "read" }] },
    } as unknown as IPermissionsDefinition;

    const error = (() => {
      try {
        return definePermissions(invalid);
      } catch (cause) {
        return cause;
      }
    })();
    expect(error).toBeInstanceOf(PermissionsConfigError);
    expect((error as PermissionsConfigError).issues).toHaveLength(2);
    expect((error as PermissionsConfigError).message).toContain("roles.member[1]");
  });
});
