import { Controller, Get, Injectable } from "@nestjs/common";
import type { Type } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Test } from "@nestjs/testing";
import { describe, expect, it } from "vitest";

import { IS_PUBLIC_KEY, Public } from "./public";

@Injectable()
class GreetingService {
  greet(): string {
    return "bonjour";
  }
}

@Controller("mixed")
class MixedController {
  constructor(readonly greetingService: GreetingService) {}

  @Public()
  @Get("open")
  open(): string {
    return this.greetingService.greet();
  }

  @Get("closed")
  closed(): string {
    return "privé";
  }
}

@Public()
@Controller("open")
class OpenController {
  @Get()
  index(): string {
    return "ouvert";
  }
}

/**
 * Lit la métadonnée comme le ferait un guard : la méthode prime sur la classe.
 */
function isPublic(reflector: Reflector, handler: () => unknown, target: Type): boolean {
  return (
    reflector.getAllAndOverride<boolean | undefined>(IS_PUBLIC_KEY, [handler, target]) === true
  );
}

/**
 * Compile un module de test contenant les contrôleurs d'exemple.
 */
async function compileModule(): Promise<{ reflector: Reflector; controller: MixedController }> {
  const moduleRef = await Test.createTestingModule({
    controllers: [MixedController, OpenController],
    providers: [GreetingService],
  }).compile();
  return { reflector: moduleRef.get(Reflector), controller: moduleRef.get(MixedController) };
}

describe("Public", () => {
  it("pose IS_PUBLIC_KEY sur la méthode décorée", async () => {
    const { reflector } = await compileModule();

    expect(isPublic(reflector, MixedController.prototype.open, MixedController)).toBe(true);
  });

  it("ne marque pas les autres méthodes du contrôleur", async () => {
    const { reflector } = await compileModule();

    expect(isPublic(reflector, MixedController.prototype.closed, MixedController)).toBe(false);
  });

  it("marque toutes les routes quand il décore la classe", async () => {
    const { reflector } = await compileModule();

    expect(isPublic(reflector, OpenController.prototype.index, OpenController)).toBe(true);
  });

  it("n'empêche pas l'injection de dépendances du contrôleur décoré", async () => {
    const { controller } = await compileModule();

    expect(controller.open()).toBe("bonjour");
  });
});

describe("IS_PUBLIC_KEY", () => {
  it("est préfixée par l'espace de noms du package", () => {
    expect(IS_PUBLIC_KEY).toBe("adr:isPublic");
  });
});
