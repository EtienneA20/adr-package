import type { ExecutionContext } from "@nestjs/common";
import { ROUTE_ARGS_METADATA } from "@nestjs/common/constants";
import { describe, expect, it } from "vitest";

import { storeSubject } from "../subject-store";
import { CurrentSubject } from "./current-subject";

type Factory = (data: unknown, context: ExecutionContext) => unknown;

class LoansController {
  list(@CurrentSubject() member: unknown): unknown {
    return member;
  }
}

function factoryOf(): Factory {
  const args = Reflect.getMetadata(ROUTE_ARGS_METADATA, LoansController, "list") as Record<
    string,
    { factory: Factory }
  >;
  const [entry] = Object.values(args);
  if (!entry) throw new Error("décorateur absent");
  return entry.factory;
}

function contextFor(request: object): ExecutionContext {
  return { switchToHttp: () => ({ getRequest: () => request }) } as unknown as ExecutionContext;
}

describe("CurrentSubject", () => {
  it("injecte le sujet rangé par le guard pour la requête", () => {
    const request = {};
    const member = { id: "m-1", roles: ["member"] };
    storeSubject(request, member);

    expect(factoryOf()(undefined, contextFor(request))).toBe(member);
  });

  it("injecte null si la requête n'a pas de sujet", () => {
    expect(factoryOf()(undefined, contextFor({}))).toBeNull();
  });

  it("n'altère pas l'appel direct de la méthode", () => {
    expect(new LoansController().list("x")).toBe("x");
  });
});
