import { describe, expect, it } from "vitest";

import type { ICriteriaCondition, IListCriteria } from "../list-criteria";
import { andCriteria } from "./and-criteria";

const base: IListCriteria = {
  orderBy: [],
  skip: 0,
  take: 21,
  page: 1,
  pageSize: 20,
  withTotal: true,
};
const owner: ICriteriaCondition = { path: "ownerId", op: "eq", value: "m-1", caseSensitive: false };
const title: ICriteriaCondition = {
  path: "title",
  op: "contains",
  value: "dune",
  caseSensitive: false,
};

describe("andCriteria", () => {
  it("pose la condition quand la requête n'a pas de filtre", () => {
    expect(andCriteria(base, owner).where).toBe(owner);
  });

  it("combine par and avec le filtre du client, sans modifier les critères d'origine", () => {
    const criteria = { ...base, where: title };
    expect(andCriteria(criteria, owner).where).toEqual({ and: [title, owner] });
    expect(criteria.where).toBe(title);
  });
});
