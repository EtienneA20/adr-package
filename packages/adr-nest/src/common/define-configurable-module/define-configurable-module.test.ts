import { Inject, Injectable, Module } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { describe, expect, expectTypeOf, it } from "vitest";
import { z } from "zod";

import { ModuleOptionsError } from "../module-options-error";
import { defineConfigurableModule } from "./define-configurable-module";

const remindersOptionsSchema = z.object({
  daysBeforeDue: z.int().min(1).max(30).default(3),
  sender: z.email(),
});
type RemindersOptions = z.output<typeof remindersOptionsSchema>;

const { ConfigurableModuleClass, OPTIONS_TOKEN, OPTIONS_TYPE } = defineConfigurableModule({
  name: "Reminders",
  schema: remindersOptionsSchema,
});

@Injectable()
class RemindersService {
  constructor(@Inject(OPTIONS_TOKEN) readonly options: RemindersOptions) {}
}

@Module({ providers: [RemindersService], exports: [RemindersService] })
class RemindersModule extends ConfigurableModuleClass {}

@Injectable()
class MailConfig {
  readonly sender = "bibliotheque@example.org";
}

@Module({ providers: [MailConfig], exports: [MailConfig] })
class MailConfigModule {}

@Injectable()
class Consumer {
  constructor(@Inject(OPTIONS_TOKEN) readonly options: RemindersOptions) {}
}

@Module({ providers: [Consumer] })
class SiblingModule {}

describe("defineConfigurableModule", () => {
  it("valide les options de forRoot et injecte la valeur produite (défauts appliqués)", async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [RemindersModule.forRoot({ sender: "bibliotheque@example.org" })],
    }).compile();

    expect(moduleRef.get(RemindersService).options).toEqual({
      daysBeforeDue: 3,
      sender: "bibliotheque@example.org",
    });
  });

  it("type les options d'entrée d'après le schéma", () => {
    expectTypeOf(OPTIONS_TYPE).toExtend<{ sender: string; daysBeforeDue?: number }>();
  });

  it("valide aussi les options produites par forRootAsync", async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        RemindersModule.forRootAsync({
          imports: [MailConfigModule],
          inject: [MailConfig],
          useFactory: (config: MailConfig) => ({ sender: config.sender, daysBeforeDue: 7 }),
        }),
      ],
    }).compile();

    expect(moduleRef.get(RemindersService).options.daysBeforeDue).toBe(7);
  });

  it("lève ModuleOptionsError au démarrage, avec le chemin de chaque problème", async () => {
    const error: unknown = await Test.createTestingModule({
      imports: [RemindersModule.forRoot({ sender: "pas-un-email", daysBeforeDue: 0 })],
    })
      .compile()
      .catch((cause: unknown) => cause);

    expect(error).toBeInstanceOf(ModuleOptionsError);
    expect((error as ModuleOptionsError).issues.map((issue) => issue.path)).toEqual([
      "daysBeforeDue",
      "sender",
    ]);
  });

  it("rend les options injectables dans les autres modules avec isGlobal", async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        RemindersModule.forRoot({ sender: "a@example.org", isGlobal: true }),
        SiblingModule,
      ],
    }).compile();

    expect(moduleRef.get(Consumer).options.sender).toBe("a@example.org");
  });

  it("réserve les options aux modules qui l'importent par défaut", async () => {
    await expect(
      Test.createTestingModule({
        imports: [RemindersModule.forRoot({ sender: "a@example.org" }), SiblingModule],
      }).compile(),
    ).rejects.toThrow();
  });
});
