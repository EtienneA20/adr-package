import { ConfigurableModuleBuilder } from "@nestjs/common";

import { toApiErrorIssues } from "../issue-path";
import { ModuleOptionsError } from "../module-options-error";
import type { IStandardSchema, InferSchemaInput, InferSchemaOutput } from "../standard-schema";

/**
 * Paramètres de `defineConfigurableModule`.
 *
 * @typeParam S - Schéma des options.
 * @example
 * ```ts
 * const definition: IConfigurableModuleDefinition<typeof remindersOptionsSchema> = {
 *   name: "Reminders",
 *   schema: remindersOptionsSchema,
 * };
 * ```
 * @since 0.2.0
 */
export interface IConfigurableModuleDefinition<S extends IStandardSchema> {
  /** Nom du module, repris dans les messages d'erreur (`"Reminders"`). */
  readonly name: string;
  /** Schéma Standard Schema (zod 4) des options : source de vérité de leur type. */
  readonly schema: S;
}

async function validateOptions<S extends IStandardSchema>(
  definition: IConfigurableModuleDefinition<S>,
  options: unknown,
): Promise<InferSchemaOutput<S>> {
  const result = await definition.schema["~standard"].validate(options);
  if (result.issues) throw new ModuleOptionsError(definition.name, toApiErrorIssues(result.issues));
  return result.value;
}

/**
 * Crée la base d'un module dynamique `forRoot` / `forRootAsync` dont les options sont
 * **validées par un schéma** au démarrage.
 *
 * S'appuie sur `ConfigurableModuleBuilder` de NestJS : `forRoot(options)`,
 * `forRootAsync({ imports, inject, useFactory })` (ou `useClass`, `useExisting`) et l'extra
 * `isGlobal` (`false` par défaut). Les options reçues (type d'entrée du schéma) sont validées,
 * puis la valeur produite (type de sortie : valeurs par défaut appliquées, conversions faites)
 * est injectable avec `OPTIONS_TOKEN`. À utiliser pour tout module réutilisable configuré par
 * l'application.
 *
 * @typeParam S - Schéma des options.
 * @param definition - Nom du module et schéma de ses options.
 * @returns `ConfigurableModuleClass` (classe à étendre), `OPTIONS_TOKEN` (jeton des options
 * validées), `OPTIONS_TYPE` et `ASYNC_OPTIONS_TYPE` (types des arguments, avec `typeof`).
 * @throws {@link ModuleOptionsError} Au démarrage de l'application, si les options ne
 * respectent pas le schéma (pas à l'appel de cette fonction).
 * @example
 * ```ts
 * export const remindersOptionsSchema = z.object({ daysBeforeDue: z.int().min(1).max(30).default(3) });
 * export const { ConfigurableModuleClass, OPTIONS_TOKEN } = defineConfigurableModule({
 *   name: "Reminders",
 *   schema: remindersOptionsSchema,
 * });
 *
 * @Module({ providers: [RemindersService], exports: [RemindersService] })
 * export class RemindersModule extends ConfigurableModuleClass {}
 *
 * // Dans RemindersService :
 * constructor(@Inject(OPTIONS_TOKEN) private readonly options: z.output<typeof remindersOptionsSchema>) {}
 * ```
 * @since 0.2.0
 */
export function defineConfigurableModule<S extends IStandardSchema>(
  definition: IConfigurableModuleDefinition<S>,
) {
  const rawOptionsToken = Symbol(`adr:${definition.name}RawOptions`);
  const optionsToken = Symbol(`adr:${definition.name}Options`);
  const { ConfigurableModuleClass, OPTIONS_TYPE, ASYNC_OPTIONS_TYPE } =
    new ConfigurableModuleBuilder<InferSchemaInput<S>>({
      moduleName: definition.name,
      optionsInjectionToken: rawOptionsToken,
    })
      .setClassMethodName("forRoot")
      .setExtras({ isGlobal: false }, (module, extras) => ({
        ...module,
        global: extras.isGlobal,
        providers: [
          ...(module.providers ?? []),
          {
            provide: optionsToken,
            inject: [rawOptionsToken],
            useFactory: (options: unknown) => validateOptions(definition, options),
          },
        ],
        exports: [...(module.exports ?? []), optionsToken],
      }))
      .build();
  return { ConfigurableModuleClass, OPTIONS_TOKEN: optionsToken, OPTIONS_TYPE, ASYNC_OPTIONS_TYPE };
}
