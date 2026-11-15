import { describe, expect, expectTypeOf, it } from "vitest";

import type { IPermissionCondition, PermissionScope } from "./permission-scope";
import type { CriteriaNode, ICriteriaCondition } from "../../filtering";

describe("types du périmètre", () => {
  it("décrivent un arbre de conditions eq / in", () => {
    const scope: PermissionScope = {
      or: [
        { path: "memberId", op: "eq", value: "m-1", caseSensitive: true },
        { and: [{ path: "libraryId", op: "in", value: [1, 2], caseSensitive: true }] },
      ],
    };

    expect(scope).toHaveProperty("or");
  });

  it("sont compatibles avec les critères du filtrage (andCriteria)", () => {
    expectTypeOf<IPermissionCondition>().toExtend<ICriteriaCondition>();
    expectTypeOf<PermissionScope>().toExtend<CriteriaNode>();
  });
});
