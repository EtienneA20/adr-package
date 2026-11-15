import { describe, expect, expectTypeOf, it } from "vitest";

import {
  type FilterNode,
  type FilterValue,
  type IFilterCondition,
  isFilterCondition,
} from "./filter-node";

const condition: IFilterCondition<"title"> = { field: "title", op: "contains", value: "dune" };

describe("isFilterCondition", () => {
  it("reconnaît une condition", () => {
    expect(isFilterCondition(condition)).toBe(true);
  });

  it.each<FilterNode<"title">>([{ and: [condition] }, { or: [condition] }, { not: condition }])(
    "ne confond pas un groupe avec une condition : %j",
    (group) => {
      expect(isFilterCondition(group)).toBe(false);
    },
  );

  it("affine le type du nœud", () => {
    const node: FilterNode<"title"> = condition;
    if (isFilterCondition(node)) {
      expectTypeOf(node.field).toEqualTypeOf<"title">();
    }
  });
});

describe("FilterNode", () => {
  it("restreint les champs aux noms donnés et accepte les groupes imbriqués", () => {
    const filter: FilterNode<"status" | "title"> = {
      and: [{ field: "status", op: "eq", value: "available" }, { not: { or: [condition] } }],
    };
    expect(filter).toBeDefined();
    expectTypeOf<{ field: "author"; op: "eq"; value: "x" }>().not.toExtend<FilterNode<"title">>();
  });

  it("accepte des valeurs simples ou des listes", () => {
    expectTypeOf<[1, 2]>().toExtend<FilterValue>();
    expectTypeOf<"x">().toExtend<FilterValue>();
    expectTypeOf<null>().not.toExtend<FilterValue>();
  });
});
