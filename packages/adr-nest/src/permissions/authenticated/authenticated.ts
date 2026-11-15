import { type CustomDecorator, SetMetadata } from "@nestjs/common";

import { IS_AUTHENTICATED_KEY } from "../route-access";

/**
 * Ouvre une route, ou toutes les routes d'un contrôleur, à tout sujet authentifié, quels que
 * soient ses rôles.
 *
 * À utiliser avec `PermissionsModule` (refus par défaut) pour les routes qui exigent seulement
 * d'être connecté (profil, déconnexion). Sans sujet : 401. Pour exiger un droit, utiliser
 * `Can` ; pour une route ouverte à tous, `Public`.
 *
 * @returns Un décorateur de méthode ou de classe.
 * @example
 * ```ts
 * @Authenticated()
 * @Get("moi")
 * me(@CurrentSubject() member: IMember) {
 *   return member;
 * }
 * ```
 * @since 0.2.0
 */
export function Authenticated(): CustomDecorator<typeof IS_AUTHENTICATED_KEY> {
  return SetMetadata(IS_AUTHENTICATED_KEY, true);
}
