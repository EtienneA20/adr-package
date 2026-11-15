import { ConfigurableModuleBuilder, Module } from "@nestjs/common";
import { APP_GUARD, DiscoveryModule } from "@nestjs/core";

import { PermissionsBootCheck } from "../permissions-boot-check";
import { PermissionsGuard } from "../permissions-guard";
import { type IPermissionsModuleOptions, PERMISSIONS_OPTIONS } from "../permissions-options";
import { PermissionsService } from "../permissions-service";

const { ConfigurableModuleClass } = new ConfigurableModuleBuilder<IPermissionsModuleOptions>({
  optionsInjectionToken: PERMISSIONS_OPTIONS,
})
  .setClassMethodName("forRoot")
  .setExtras({ globalGuard: true }, (definition, extras) => ({
    ...definition,
    global: true,
    providers: [
      ...(definition.providers ?? []),
      ...(extras.globalGuard ? [{ provide: APP_GUARD, useClass: PermissionsGuard }] : []),
    ],
  }))
  .build();

/**
 * Module des permissions : règles par rôle, guard global à refus par défaut, contrôle des
 * routes au démarrage et `PermissionsService` injectable partout (module global).
 *
 * `forRoot(options)` ou `forRootAsync({ imports, inject, useFactory })` (règles chargées d'une
 * configuration). Options : `permissions` (règles), `subject` (sujet d'une requête,
 * `request.user` par défaut), `strict` (`true` par défaut). Extra `globalGuard` (`true` par
 * défaut) : `false` pour enregistrer soi-même `PermissionsGuard`, par exemple après un guard
 * d'authentification global.
 *
 * @example
 * ```ts
 * @Module({
 *   imports: [
 *     PermissionsModule.forRoot({
 *       permissions,
 *       subject: (context) => context.switchToHttp().getRequest().member ?? null,
 *     }),
 *     LoansModule,
 *   ],
 * })
 * export class AppModule {}
 * ```
 * @throws {@link PermissionsConfigError} Au démarrage : règles invalides, ou (mode strict)
 * route non annotée ou `@Can()` sans règle correspondante.
 * @since 0.2.0
 */
@Module({
  imports: [DiscoveryModule],
  providers: [PermissionsService, PermissionsBootCheck],
  exports: [PermissionsService],
})
export class PermissionsModule extends ConfigurableModuleClass {}
