import { describe, expect, it } from "vitest";
import { z } from "zod";

import { toApiErrorIssues } from "./issue-path";

describe("toApiErrorIssues", () => {
  it("écrit le chemin en notation pointée, segments { key } compris", () => {
    expect(
      toApiErrorIssues([
        { message: "Requis", path: ["items", 0, { key: "title" }] },
        { message: "Racine", path: [] },
        { message: "Sans chemin" },
        { message: "Symbole", path: [Symbol("secret"), Symbol()] },
      ]),
    ).toEqual([
      { path: "items.0.title", message: "Requis" },
      { path: "", message: "Racine" },
      { path: "", message: "Sans chemin" },
      { path: "secret.", message: "Symbole" },
    ]);
  });

  it("reprend le code zod d'un problème", () => {
    const issues = z.object({ title: z.string() }).safeParse({}).error?.issues ?? [];
    expect(toApiErrorIssues(issues)).toEqual([
      { path: "title", message: expect.any(String) as string, code: "invalid_type" },
    ]);
  });

  it("préfère le code applicatif de params.code", () => {
    expect(
      toApiErrorIssues([
        {
          message: "Trop de conditions",
          code: "custom",
          params: { code: "QUERY_LIMIT_EXCEEDED" },
        } as never,
        { message: "Sans code applicatif", code: "custom", params: { limit: 3 } } as never,
        { message: "Paramètres invalides", params: null } as never,
      ]).map((issue) => issue.code),
    ).toEqual(["QUERY_LIMIT_EXCEEDED", "custom", undefined]);
  });
});
