// Mode strict : les oublis d'annotation et les fautes de frappe dans `@Can()` sont signalés au
// démarrage, en une seule erreur qui liste toutes les routes concernées, au lieu d'un 403
// découvert en production.
import { Inject, Injectable, type OnApplicationBootstrap } from "@nestjs/common";
import { PATH_METADATA } from "@nestjs/common/constants";
import { DiscoveryService, MetadataScanner, Reflector } from "@nestjs/core";

import { PermissionsConfigError } from "../permissions-config-error";
import { type IPermissionsModuleOptions, PERMISSIONS_OPTIONS } from "../permissions-options";
import { PermissionsService } from "../permissions-service";
import { type MetadataTarget, readRouteAccess } from "../route-access";

/**
 * Vérification des routes au démarrage (mode strict), enregistrée par `PermissionsModule`.
 *
 * @example
 * ```ts
 * providers: [PermissionsService, PermissionsBootCheck];
 * ```
 * @internal
 */
@Injectable()
export class PermissionsBootCheck implements OnApplicationBootstrap {
  constructor(
    @Inject(PERMISSIONS_OPTIONS) private readonly options: IPermissionsModuleOptions,
    private readonly discovery: DiscoveryService,
    private readonly scanner: MetadataScanner,
    private readonly reflector: Reflector,
    private readonly permissions: PermissionsService,
  ) {}

  onApplicationBootstrap(): void {
    if (this.options.strict === false) return;
    const issues = this.discovery
      .getControllers()
      .flatMap(({ metatype, instance }: { metatype: unknown; instance: unknown }) =>
        typeof metatype === "function" && typeof instance === "object" && instance !== null
          ? this.controllerIssues(metatype as MetadataTarget, instance)
          : [],
      );
    if (issues.length > 0) throw new PermissionsConfigError(issues);
  }

  private controllerIssues(controller: MetadataTarget, instance: object): string[] {
    const prototype = Object.getPrototypeOf(instance) as Record<string, MetadataTarget>;
    return this.scanner.getAllMethodNames(prototype).flatMap((name) => {
      const handler = prototype[name];
      if (!handler || this.reflector.get(PATH_METADATA, handler) === undefined) return [];
      const route = `${controller.name}.${name}`;
      const access = readRouteAccess(this.reflector, handler, controller);
      if (!access) {
        return [`${route} : aucune annotation (@Public(), @Authenticated() ou @Can()).`];
      }
      return access.kind === "permission" &&
        !this.permissions.isKnownPermission(access.action, access.resource)
        ? [
            `${route} : @Can("${access.action}", "${access.resource}") ne correspond à aucune règle.`,
          ]
        : [];
    });
  }
}
