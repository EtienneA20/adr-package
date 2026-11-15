import { describe, expect, it } from "vitest";

import type { IPermissionsDefinition } from "../permission-rule";
import {
  allowsResource,
  applicableRules,
  isKnownPermission,
  rulesScope,
} from "./evaluate-permissions";

const definition: IPermissionsDefinition = {
  roles: {
    librarian: [{ action: "manage", resource: "all" }],
    member: [
      { action: "read", resource: "book" },
      { action: ["read", "cancel"], resource: "loan", where: { memberId: "$subject.id" } },
    ],
    manager: [
      {
        action: "read",
        resource: "loan",
        where: { libraryId: "$subject.libraryIds", status: ["active", "late"] },
      },
    ],
    auditor: [
      { action: "read", resource: "loan", where: { memberId: ["$subject.delegateOf", "m-9"] } },
    ],
  },
};

const member = { id: "m-1", roles: ["member"] };

describe("applicableRules", () => {
  it("garde les règles des rôles du sujet qui portent sur l'action et la ressource", () => {
    expect(applicableRules(definition, member, "cancel", "loan")).toHaveLength(1);
    expect(applicableRules(definition, member, "update", "loan")).toEqual([]);
    expect(applicableRules(definition, member, "read", "author")).toEqual([]);
  });

  it("applique les jokers manage (toute action) et all (toute ressource)", () => {
    expect(applicableRules(definition, { roles: ["librarian"] }, "delete", "author")).toHaveLength(
      1,
    );
  });

  it("refuse un sujet absent, sans rôles, aux rôles inconnus ou mal typés", () => {
    expect(applicableRules(definition, null, "read", "book")).toEqual([]);
    expect(applicableRules(definition, { id: "x" }, "read", "book")).toEqual([]);
    expect(applicableRules(definition, { roles: ["admin", "toString"] }, "read", "book")).toEqual(
      [],
    );
    expect(applicableRules(definition, { roles: "member" }, "read", "book")).toEqual([]);
    expect(applicableRules(definition, { roles: [1, "member"] }, "read", "book")).toHaveLength(1);
  });
});

describe("isKnownPermission", () => {
  it("indique si une règle, tous rôles confondus, cite l'action", () => {
    expect(
      isKnownPermission({ roles: { member: definition.roles.member ?? [] } }, "cancel", "loan"),
    ).toBe(true);
    expect(
      isKnownPermission({ roles: { member: definition.roles.member ?? [] } }, "delete", "loan"),
    ).toBe(false);
    expect(isKnownPermission(definition, "delete", "loan")).toBe(true);
  });
});

describe("allowsResource", () => {
  const loanRules = applicableRules(definition, member, "cancel", "loan");

  it("vérifie l'égalité avec une référence au sujet", () => {
    expect(allowsResource(loanRules, member, { memberId: "m-1" })).toBe(true);
    expect(allowsResource(loanRules, member, { memberId: "m-2" })).toBe(false);
  });

  it("refuse si la référence est absente du sujet ou le champ absent de la ressource", () => {
    expect(allowsResource(loanRules, { roles: ["member"] }, { memberId: "m-1" })).toBe(false);
    expect(allowsResource(loanRules, member, {})).toBe(false);
    expect(allowsResource(loanRules, member, { memberId: { id: "m-1" } })).toBe(false);
  });

  it("n'assimile pas une valeur absente à une autre (null, undefined)", () => {
    const anonymous = { roles: ["member"], id: null };
    expect(allowsResource(loanRules, anonymous, { memberId: null })).toBe(false);
  });

  it("vérifie l'appartenance : référence vers une liste, liste fixe, combinées en ET", () => {
    const manager = { roles: ["manager"], libraryIds: [1, 2] };
    const rules = applicableRules(definition, manager, "read", "loan");

    expect(allowsResource(rules, manager, { libraryId: 2, status: "late" })).toBe(true);
    expect(allowsResource(rules, manager, { libraryId: 3, status: "late" })).toBe(false);
    expect(allowsResource(rules, manager, { libraryId: 1, status: "returned" })).toBe(false);
    expect(allowsResource(rules, { ...manager, libraryIds: [{}] }, { libraryId: 1 })).toBe(false);
  });

  it("ignore les références absentes dans une liste (moins de droits, jamais plus)", () => {
    const auditor = { roles: ["auditor"] };
    const rules = applicableRules(definition, auditor, "read", "loan");

    expect(allowsResource(rules, auditor, { memberId: "m-9" })).toBe(true);
    expect(allowsResource(rules, { ...auditor, delegateOf: "m-3" }, { memberId: "m-3" })).toBe(
      true,
    );
    expect(allowsResource(rules, auditor, { memberId: "m-3" })).toBe(false);
  });

  it("accorde sans condition une règle sans where", () => {
    const rules = applicableRules(definition, member, "read", "book");
    expect(allowsResource(rules, member, {})).toBe(true);
  });
});

describe("rulesScope", () => {
  it("renvoie la condition d'une règle unique, références résolues", () => {
    expect(rulesScope(applicableRules(definition, member, "read", "loan"), member)).toEqual({
      path: "memberId",
      op: "eq",
      value: "m-1",
      caseSensitive: true,
    });
  });

  it("combine en ET les conditions d'une règle et en OU les règles", () => {
    const subject = { id: "m-1", roles: ["member", "manager"], libraryIds: [1] };
    expect(rulesScope(applicableRules(definition, subject, "read", "loan"), subject)).toEqual({
      or: [
        { path: "memberId", op: "eq", value: "m-1", caseSensitive: true },
        {
          and: [
            { path: "libraryId", op: "in", value: [1], caseSensitive: true },
            { path: "status", op: "in", value: ["active", "late"], caseSensitive: true },
          ],
        },
      ],
    });
  });

  it("renvoie { and: [] } si une règle est sans condition", () => {
    const subject = { roles: ["member", "librarian"] };
    expect(rulesScope(applicableRules(definition, subject, "read", "loan"), subject)).toEqual({
      and: [],
    });
  });

  it("renvoie { or: [] } sans règle ou si aucune référence n'est résolue", () => {
    expect(rulesScope([], member)).toEqual({ or: [] });
    const subject = { roles: ["member"] };
    expect(rulesScope(applicableRules(definition, subject, "read", "loan"), subject)).toEqual({
      or: [],
    });
  });
});
