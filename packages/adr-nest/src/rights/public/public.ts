import { SetMetadata } from "@nestjs/common";
import type { CustomDecorator } from "@nestjs/common";

/**
 * Clé de métadonnée posée par le décorateur {@link Public}.
 *
 * À utiliser dans un guard pour savoir si une route est publique, via le `Reflector` de NestJS.
 *
 * @example
 * ```ts
 * const isPublic = reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
 *   context.getHandler(),
 *   context.getClass(),
 * ]);
 * ```
 * @since 0.1.0
 */
export const IS_PUBLIC_KEY = "adr:isPublic";

/**
 * Marque une route, ou toutes les routes d'un contrôleur, comme publiques.
 *
 * À utiliser avec un guard d'authentification global : le guard lit {@link IS_PUBLIC_KEY} et
 * laisse passer les requêtes non authentifiées vers les routes marquées. Le décorateur ne fait
 * rien seul : il pose uniquement la métadonnée.
 *
 * @returns Un décorateur de méthode ou de classe qui pose `IS_PUBLIC_KEY = true`.
 * @example
 * ```ts
 * @Controller("health")
 * export class HealthController {
 *   @Public()
 *   @Get()
 *   check() {
 *     return { status: "ok" };
 *   }
 * }
 * ```
 * @since 0.1.0
 */
export function Public(): CustomDecorator<typeof IS_PUBLIC_KEY> {
  return SetMetadata(IS_PUBLIC_KEY, true);
}
