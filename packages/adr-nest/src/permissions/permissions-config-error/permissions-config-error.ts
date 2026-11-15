/**
 * Erreur de configuration des permissions, levée **au démarrage**, jamais à cause d'une
 * requête : règle invalide, route sans annotation ou `@Can` sans règle correspondante (mode
 * strict).
 *
 * @example
 * ```ts
 * // Lève PermissionsConfigError : l'action ne peut pas être vide.
 * definePermissions({ roles: { member: [{ action: "", resource: "loan" }] } });
 * ```
 * @since 0.2.0
 */
export class PermissionsConfigError extends Error {
  override readonly name = "PermissionsConfigError";

  /**
   * Crée l'erreur.
   *
   * @param issues - Problèmes relevés, un par ligne du message.
   */
  constructor(readonly issues: readonly string[]) {
    super(`Configuration des permissions invalide :\n- ${issues.join("\n- ")}`);
  }
}
