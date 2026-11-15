import type { ExecutionContext } from "@nestjs/common";

import type { IPermissionSubject, IPermissionsDefinition } from "../permission-rule";

/**
 * Fonction qui fournit le sujet d'une requête : point d'extension de l'authentification.
 *
 * Renvoie `null` (ou `undefined`) pour une requête anonyme ; peut être asynchrone (lecture d'un
 * jeton, chargement des rôles) et lever une exception (jeton invalide). Par défaut :
 * `request.user` (convention Passport).
 *
 * @example
 * ```ts
 * const subject: SubjectResolver = (context) =>
 *   context.switchToHttp().getRequest<{ member?: IMember }>().member ?? null;
 * ```
 * @since 0.2.0
 */
export type SubjectResolver = (
  context: ExecutionContext,
) => IPermissionSubject | null | undefined | Promise<IPermissionSubject | null | undefined>;

/**
 * Options de `PermissionsModule.forRoot` (ou renvoyées par la fabrique de `forRootAsync`).
 *
 * @example
 * ```ts
 * const options: IPermissionsModuleOptions = { permissions, strict: true };
 * ```
 * @since 0.2.0
 */
export interface IPermissionsModuleOptions {
  /** Règles par rôle (`definePermissions`), validées au démarrage. */
  readonly permissions: IPermissionsDefinition;
  /** Fournit le sujet d'une requête (`request.user` par défaut). */
  readonly subject?: SubjectResolver | undefined;
  /**
   * Mode strict (`true` par défaut) : le démarrage échoue si une route n'a ni `@Public()`, ni
   * `@Authenticated()`, ni `@Can()`, ou si un `@Can()` ne correspond à aucune règle.
   */
  readonly strict?: boolean | undefined;
}

/** Jeton d'injection des options du module. */
export const PERMISSIONS_OPTIONS = Symbol("adr:PermissionsOptions");
