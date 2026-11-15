import { type CanActivate, type ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

import { PermissionDeniedException, UnauthenticatedException } from "../permission-exceptions";
import { PermissionsService } from "../permissions-service";
import { readRouteAccess } from "../route-access";
import { storeSubject } from "../subject-store";

/**
 * Guard des permissions, **refus par défaut** : une route doit être annotée `@Public()`,
 * `@Authenticated()` ou `@Can()`.
 *
 * Résout le sujet (fonction `subject` du module), le rend disponible à `@CurrentSubject()`,
 * puis : route publique → acceptée ; sans sujet → 401 ; route non annotée → 403 ;
 * `@Can(action, resource)` sans règle correspondante → 403. L'annotation de la méthode
 * l'emporte sur celle du contrôleur. Enregistré comme guard global par `PermissionsModule`
 * (option `globalGuard`, `true` par défaut).
 *
 * @example
 * ```ts
 * // globalGuard: false : enregistrer le guard après celui d'authentification.
 * providers: [
 *   { provide: APP_GUARD, useClass: JwtAuthGuard },
 *   { provide: APP_GUARD, useClass: PermissionsGuard },
 * ];
 * ```
 * @throws {@link UnauthenticatedException} Sans sujet sur une route protégée (401).
 * @throws {@link PermissionDeniedException} Route non annotée ou droit manquant (403).
 * @since 0.2.0
 */
@Injectable()
export class PermissionsGuard implements CanActivate {
  /**
   * Crée le guard.
   *
   * @param reflector - Lecteur des métadonnées de NestJS.
   * @param permissions - Service des permissions.
   */
  constructor(
    private readonly reflector: Reflector,
    private readonly permissions: PermissionsService,
  ) {}

  /**
   * Décide de l'accès à la route.
   *
   * @param context - Contexte d'exécution de NestJS.
   * @returns `true` si l'accès est accordé.
   * @throws {@link UnauthenticatedException} Sans sujet sur une route protégée.
   * @throws {@link PermissionDeniedException} Route non annotée ou droit manquant.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const access = readRouteAccess(this.reflector, context.getHandler(), context.getClass());
    const subject = await this.permissions.resolveSubject(context);
    const request = context.switchToHttp().getRequest<unknown>();
    if (typeof request === "object" && request !== null) storeSubject(request, subject);

    if (access?.kind === "public") return true;
    if (!subject) throw new UnauthenticatedException();
    if (!access) throw new PermissionDeniedException();
    if (
      access.kind === "permission" &&
      !this.permissions.canOnSome(subject, access.action, access.resource)
    ) {
      throw new PermissionDeniedException(access.action, access.resource);
    }
    return true;
  }
}
