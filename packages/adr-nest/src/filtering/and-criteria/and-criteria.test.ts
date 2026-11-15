import { describe, expect, it } from "vitest";

import { PermissionsService } from "../../permissions";
import { applyCriteriaInMemory } from "../apply-criteria-in-memory";
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

  it("accepte le périmètre de PermissionsService (même arbre neutre)", () => {
    const permissions = new PermissionsService({
      permissions: {
        roles: {
          member: [{ action: "read", resource: "loan", where: { ownerId: "$subject.id" } }],
          librarian: [{ action: "manage", resource: "all" }],
        },
      },
    });
    const loans = [
      { id: "l-1", ownerId: "m-1" },
      { id: "l-2", ownerId: "m-2" },
    ];
    const scoped = (subject: { id: string; roles: string[] } | null): string[] =>
      applyCriteriaInMemory(
        loans,
        andCriteria(base, permissions.scope(subject, "read", "loan")),
      ).items.map((loan) => loan.id);

    expect(scoped({ id: "m-1", roles: ["member"] })).toEqual(["l-1"]);
    expect(scoped({ id: "b-1", roles: ["librarian"] })).toEqual(["l-1", "l-2"]);
    expect(scoped(null)).toEqual([]);
  });
});
