// Lecture des annotations d'accès d'une route, commune au guard et au contrôle de démarrage.
// L'annotation de la méthode l'emporte sur celle du contrôleur (une route peut être plus ou
// moins ouverte que son contrôleur) ; sur un même élément : Public > Can > Authenticated.
import type { Reflector } from "@nestjs/core";

import { IS_PUBLIC_KEY } from "../public";

/** Clé de métadonnée posée par `Authenticated()`. */
export const IS_AUTHENTICATED_KEY = "adr:isAuthenticated";

/** Clé de métadonnée posée par `Can()`. */
export const REQUIRED_PERMISSION_KEY = "adr:requiredPermission";

/** Permission exigée par `Can()`. */
export interface IRequiredPermission {
  readonly action: string;
  readonly resource: string;
}

/** Accès exigé par une route. */
export type RouteAccess =
  | { readonly kind: "public" }
  | { readonly kind: "authenticated" }
  | ({ readonly kind: "permission" } & IRequiredPermission);

/** Méthode de route ou classe de contrôleur, cible des métadonnées. */
export type MetadataTarget = Parameters<Reflector["get"]>[1];

function accessOf(reflector: Reflector, target: MetadataTarget): RouteAccess | undefined {
  if (reflector.get<boolean | undefined>(IS_PUBLIC_KEY, target) === true) {
    return { kind: "public" };
  }
  const permission = reflector.get<IRequiredPermission | undefined>(
    REQUIRED_PERMISSION_KEY,
    target,
  );
  if (permission) return { kind: "permission", ...permission };
  return reflector.get<boolean | undefined>(IS_AUTHENTICATED_KEY, target) === true
    ? { kind: "authenticated" }
    : undefined;
}

/**
 * Lit l'accès exigé par une route : annotation de la méthode, sinon du contrôleur.
 *
 * @param reflector - Lecteur des métadonnées de NestJS.
 * @param handler - Méthode de la route.
 * @param controller - Classe du contrôleur.
 * @returns L'accès exigé, ou `undefined` si la route n'est pas annotée (refusée).
 * @example
 * ```ts
 * readRouteAccess(reflector, context.getHandler(), context.getClass());
 * // { kind: "permission", action: "cancel", resource: "loan" }
 * ```
 * @internal
 */
export function readRouteAccess(
  reflector: Reflector,
  handler: MetadataTarget,
  controller: MetadataTarget,
): RouteAccess | undefined {
  return accessOf(reflector, handler) ?? accessOf(reflector, controller);
}
