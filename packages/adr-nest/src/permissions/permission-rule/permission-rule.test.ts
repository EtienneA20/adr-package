import { describe, expect, expectTypeOf, it } from "vitest";

import type {
  IPermissionRule,
  IPermissionSubject,
  IPermissionsDefinition,
  PermissionConditionValue,
} from "./permission-rule";

describe("types des règles de permission", () => {
  it("décrivent des règles sérialisables en JSON", () => {
    const definition: IPermissionsDefinition = {
      roles: {
        librarian: [{ action: "manage", resource: "all" }],
        member: [
          { action: ["read", "cancel"], resource: "loan", where: { memberId: "$subject.id" } },
        ],
      },
    };

    expect(JSON.parse(JSON.stringify(definition))).toEqual(definition);
  });

  it("n'acceptent que des valeurs simples ou des listes dans les conditions", () => {
    expectTypeOf<"$subject.id">().toExtend<PermissionConditionValue>();
    expectTypeOf<readonly number[]>().toExtend<PermissionConditionValue>();
    expectTypeOf<null>().not.toExtend<PermissionConditionValue>();
    expectTypeOf<() => boolean>().not.toExtend<IPermissionRule["where"]>();
  });

  it("acceptent un sujet étendu (identifiant, futur tenantId)", () => {
    interface IMember extends IPermissionSubject {
      readonly id: string;
      readonly tenantId?: string;
    }
    expectTypeOf<IMember>().toExtend<IPermissionSubject>();
  });
});
