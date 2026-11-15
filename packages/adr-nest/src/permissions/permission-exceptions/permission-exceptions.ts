import { ApiException, EApiErrorCode } from "../../common";

/**
 * Requête sans sujet sur une route protégée : 401 `UNAUTHENTICATED` au format d'erreur d'API.
 *
 * Levée par `PermissionsGuard` (route annotée `@Authenticated()` ou `@Can()`) et par
 * `PermissionsService.assertCan` quand le sujet est absent.
 *
 * @example
 * ```ts
 * if (!member) throw new UnauthenticatedException();
 * ```
 * @since 0.2.0
 */
export class UnauthenticatedException extends ApiException {
  /** Crée l'exception. */
  constructor() {
    super({
      status: 401,
      code: EApiErrorCode.UNAUTHENTICATED,
      title: "Authentification requise",
      detail: "Connectez-vous pour accéder à cette ressource.",
    });
  }
}

/**
 * Sujet authentifié sans le droit demandé : 403 `FORBIDDEN` au format d'erreur d'API.
 *
 * Le corps de la réponse ne révèle ni la règle ni la permission manquante ; elles restent
 * disponibles côté serveur (`action`, `resource`) pour la journalisation.
 *
 * @example
 * ```ts
 * throw new PermissionDeniedException("cancel", "loan");
 * ```
 * @since 0.2.0
 */
export class PermissionDeniedException extends ApiException {
  /**
   * Crée l'exception.
   *
   * @param action - Action refusée (non envoyée au client).
   * @param resource - Ressource concernée (non envoyée au client).
   */
  constructor(
    readonly action?: string,
    readonly resource?: string,
  ) {
    super({
      status: 403,
      code: EApiErrorCode.FORBIDDEN,
      title: "Accès refusé",
      detail: "Vous n'avez pas le droit d'effectuer cette action.",
    });
  }
}
