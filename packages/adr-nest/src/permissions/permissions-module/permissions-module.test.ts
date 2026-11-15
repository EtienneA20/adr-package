import { Controller, Get, Injectable, Module, type Type } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { Test } from "@nestjs/testing";
import { describe, expect, it } from "vitest";

import { Authenticated } from "../authenticated";
import { Can } from "../can";
import type { IPermissionsDefinition } from "../permission-rule";
import { PermissionsConfigError } from "../permissions-config-error";
import { PermissionsGuard } from "../permissions-guard";
import { PermissionsService } from "../permissions-service";
import { Public } from "../public";
import { PermissionsModule } from "./permissions-module";

const permissions: IPermissionsDefinition = {
  roles: { member: [{ action: ["read", "cancel"], resource: "loan" }] },
};

@Public()
@Controller("sante")
class HealthController {
  @Get()
  check(): string {
    return "ok";
  }
}

@Controller("emprunts")
class LoansController {
  @Can("read", "loan")
  @Get()
  list(): string {
    return "";
  }

  @Authenticated()
  @Get("moi")
  mine(): string {
    return "";
  }

  // Méthode utilitaire, pas une route : ignorée par le contrôle.
  helper(): string {
    return "";
  }
}

@Controller("oublis")
class ForgottenController {
  @Get()
  index(): string {
    return "";
  }

  @Can("cancle", "loan")
  @Get("faute")
  typo(): string {
    return "";
  }
}

@Injectable()
class RulesConfig {
  readonly permissions = permissions;
}

@Module({ providers: [RulesConfig], exports: [RulesConfig] })
class ConfigModule {}

async function boot(controllers: Type[], strict?: boolean): Promise<void> {
  const moduleRef = await Test.createTestingModule({
    imports: [PermissionsModule.forRoot({ permissions, strict })],
    controllers,
  }).compile();
  await moduleRef.init();
  await moduleRef.close();
}

describe("PermissionsModule", () => {
  it("rend PermissionsService injectable partout (module global)", async () => {
    @Injectable()
    class LoansService {
      constructor(readonly permissions: PermissionsService) {}
    }
    @Module({ providers: [LoansService] })
    class LoansModule {}

    const moduleRef = await Test.createTestingModule({
      imports: [PermissionsModule.forRoot({ permissions }), LoansModule],
    }).compile();

    expect(
      moduleRef.get(LoansService).permissions.canOnSome({ roles: ["member"] }, "read", "loan"),
    ).toBe(true);
  });

  it("enregistre le guard global par défaut, pas avec globalGuard: false", () => {
    const guardProviders = (options: { globalGuard?: boolean }): unknown[] =>
      (PermissionsModule.forRoot({ permissions, ...options }).providers ?? []).filter(
        (provider) =>
          typeof provider === "object" && "provide" in provider && provider.provide === APP_GUARD,
      );

    expect(guardProviders({})).toEqual([{ provide: APP_GUARD, useClass: PermissionsGuard }]);
    expect(guardProviders({ globalGuard: false })).toEqual([]);
  });

  it("accepte des règles fournies par une fabrique (forRootAsync)", async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        PermissionsModule.forRootAsync({
          imports: [ConfigModule],
          inject: [RulesConfig],
          useFactory: (config: RulesConfig) => ({ permissions: config.permissions }),
        }),
      ],
      controllers: [HealthController, LoansController],
    }).compile();
    await moduleRef.init();

    expect(moduleRef.get(PermissionsService).definition).toEqual(permissions);
    await moduleRef.close();
  });

  it("démarre en mode strict si toutes les routes sont annotées", async () => {
    await expect(boot([HealthController, LoansController])).resolves.toBeUndefined();
  });

  it("échoue au démarrage en listant les routes non annotées et les @Can inconnus", async () => {
    const error = await boot([LoansController, ForgottenController]).catch(
      (cause: unknown) => cause,
    );

    expect(error).toBeInstanceOf(PermissionsConfigError);
    expect((error as PermissionsConfigError).issues).toEqual([
      "ForgottenController.index : aucune annotation (@Public(), @Authenticated() ou @Can()).",
      'ForgottenController.typo : @Can("cancle", "loan") ne correspond à aucune règle.',
    ]);
  });

  it("ne vérifie pas les routes avec strict: false", async () => {
    await expect(boot([ForgottenController], false)).resolves.toBeUndefined();
  });

  it("échoue au démarrage si les règles sont invalides", async () => {
    const invalid = {
      roles: { member: [{ action: "read" }] },
    } as unknown as IPermissionsDefinition;

    await expect(
      Test.createTestingModule({
        imports: [PermissionsModule.forRoot({ permissions: invalid })],
      }).compile(),
    ).rejects.toThrow(PermissionsConfigError);
  });
});
