import { Controller, Get } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { describe, expect, it } from "vitest";

import { Authenticated } from "../authenticated";
import { Can } from "../can";
import { Public } from "../public";
import { readRouteAccess } from "./route-access";

@Can("read", "loan")
@Controller("emprunts")
class LoansController {
  @Get()
  list(): string {
    return "";
  }

  @Public()
  @Get("tarifs")
  prices(): string {
    return "";
  }

  @Authenticated()
  @Get("moi")
  mine(): string {
    return "";
  }

  @Public()
  @Can("cancel", "loan")
  @Authenticated()
  @Get("tout")
  all(): string {
    return "";
  }

  @Can("cancel", "loan")
  @Authenticated()
  @Get("annulation")
  cancel(): string {
    return "";
  }
}

@Controller("divers")
class PlainController {
  @Get()
  index(): string {
    return "";
  }
}

const reflector = new Reflector();
const access = (
  controller: typeof LoansController | typeof PlainController,
  name: string,
): unknown =>
  readRouteAccess(
    reflector,
    (controller.prototype as unknown as Record<string, () => string>)[name] as () => string,
    controller,
  );

describe("readRouteAccess", () => {
  it("lit l'annotation du contrôleur si la méthode n'en a pas", () => {
    expect(access(LoansController, "list")).toEqual({
      kind: "permission",
      action: "read",
      resource: "loan",
    });
  });

  it("donne la priorité à l'annotation de la méthode sur celle du contrôleur", () => {
    expect(access(LoansController, "prices")).toEqual({ kind: "public" });
    expect(access(LoansController, "mine")).toEqual({ kind: "authenticated" });
  });

  it("sur un même élément : Public, puis Can, puis Authenticated", () => {
    expect(access(LoansController, "all")).toEqual({ kind: "public" });
    expect(access(LoansController, "cancel")).toEqual({
      kind: "permission",
      action: "cancel",
      resource: "loan",
    });
  });

  it("renvoie undefined pour une route sans annotation", () => {
    expect(access(PlainController, "index")).toBeUndefined();
  });
});
