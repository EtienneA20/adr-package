import { type CustomDecorator, SetMetadata } from "@nestjs/common";

import { type IRequiredPermission, REQUIRED_PERMISSION_KEY } from "../route-access";

/**
 * Exige un droit pour accéder à une route, ou à toutes les routes d'un contrôleur.
 *
 * `PermissionsGuard` vérifie qu'une règle d'un des rôles du sujet porte sur `action` et
 * `resource` (401 sans sujet, 403 sinon). Les conditions `where` des règles ne sont **pas**
 * vérifiées ici, faute de ressource chargée : les vérifier dans le service avec
 * `PermissionsService.assertCan` (une ressource) ou `scope` (une liste).
 *
 * @param action - Action exigée (`"read"`, `"cancel"`).
 * @param resource - Type de ressource (`"loan"`).
 * @returns Un décorateur de méthode ou de classe.
 * @example
 * ```ts
 * @Can("cancel", "loan")
 * @Post(":id/annulation")
 * cancel(@CurrentSubject() member: IMember, @Param("id") id: string) {
 *   return this.loans.cancel(member, id);
 * }
 * ```
 * @since 0.2.0
 */
export function Can(
  action: string,
  resource: string,
): CustomDecorator<typeof REQUIRED_PERMISSION_KEY> {
  const permission: IRequiredPermission = { action, resource };
  return SetMetadata(REQUIRED_PERMISSION_KEY, permission);
}
