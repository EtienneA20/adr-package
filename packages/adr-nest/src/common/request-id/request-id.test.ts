import type { ExecutionContext } from "@nestjs/common";
import { ROUTE_ARGS_METADATA } from "@nestjs/common/constants";
import { describe, expect, it } from "vitest";

import { REQUEST_ID_HEADER, RequestId, requestIdOf } from "./request-id";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

describe("requestIdOf", () => {
  it("reprend l'en-tête x-request-id s'il est valide", () => {
    expect(requestIdOf({ headers: { [REQUEST_ID_HEADER]: "front-42:a.b_c" } })).toBe(
      "front-42:a.b_c",
    );
  });

  it("génère un UUID sans en-tête, ou si l'en-tête est invalide (injection, longueur)", () => {
    expect(requestIdOf({})).toMatch(UUID);
    expect(requestIdOf({ headers: null })).toMatch(UUID);
    expect(requestIdOf({ headers: { [REQUEST_ID_HEADER]: "a\nFAUX journal" } })).toMatch(UUID);
    expect(requestIdOf({ headers: { [REQUEST_ID_HEADER]: "x".repeat(129) } })).toMatch(UUID);
    expect(requestIdOf({ headers: { [REQUEST_ID_HEADER]: ["a", "b"] } })).toMatch(UUID);
  });

  it("renvoie toujours le même identifiant pour la même requête", () => {
    const request = {};
    expect(requestIdOf(request)).toBe(requestIdOf(request));
    expect(requestIdOf({})).not.toBe(requestIdOf(request));
  });
});

describe("RequestId", () => {
  class BooksController {
    create(@RequestId() requestId: string): string {
      return requestId;
    }
  }

  it("injecte l'identifiant de corrélation de la requête", () => {
    const args = Reflect.getMetadata(ROUTE_ARGS_METADATA, BooksController, "create") as Record<
      string,
      { factory: (data: unknown, context: ExecutionContext) => unknown }
    >;
    const factory = Object.values(args)[0]?.factory;
    const request = { headers: { [REQUEST_ID_HEADER]: "req-1" } };
    const context = {
      switchToHttp: () => ({ getRequest: () => request }),
    } as unknown as ExecutionContext;

    expect(factory?.(undefined, context)).toBe("req-1");
    expect(new BooksController().create("x")).toBe("x");
  });
});
