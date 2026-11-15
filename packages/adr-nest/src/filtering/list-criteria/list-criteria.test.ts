import type { FilterValue } from "@etiennea20/adr-misc/contract";
import { describe, expect, expectTypeOf, it } from "vitest";

import type {
  CriteriaNode,
  CriteriaValue,
  ICriteriaCondition,
  IListCriteria,
} from "./list-criteria";

describe("types des critères", () => {
  it("acceptent des conditions imbriquées et des dates", () => {
    const condition: ICriteriaCondition = {
      path: "publishedAt",
      op: "between",
      value: [new Date("1960-01-01"), new Date("1969-12-31")],
      caseSensitive: false,
    };
    const criteria: IListCriteria = {
      where: { and: [condition, { not: { or: [condition] } }] },
      orderBy: [{ path: "title", direction: "asc" }],
      skip: 0,
      take: 21,
      page: 1,
      pageSize: 20,
      withTotal: true,
    };
    expect(criteria.where).toBeDefined();
    expectTypeOf<ICriteriaCondition>().toExtend<CriteriaNode>();
  });

  it("étendent les valeurs du contrat avec les dates", () => {
    expectTypeOf<FilterValue>().toExtend<CriteriaValue>();
    expectTypeOf<Date>().toExtend<CriteriaValue>();
  });
});
