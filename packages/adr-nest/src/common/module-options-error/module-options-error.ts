import type { IApiErrorIssue } from "../api-error";

/**
 * Options invalides passées à un module créé avec `defineConfigurableModule` : levée **au
 * démarrage** de l'application, jamais à cause d'une requête.
 *
 * @example
 * ```ts
 * // Lève ModuleOptionsError : « daysBeforeDue » doit être un entier entre 1 et 30.
 * RemindersModule.forRoot({ daysBeforeDue: 0 });
 * ```
 * @since 0.2.0
 */
export class ModuleOptionsError extends Error {
  override readonly name = "ModuleOptionsError";

  /**
   * Crée l'erreur.
   *
   * @param moduleName - Nom du module (`"Reminders"`).
   * @param issues - Problèmes relevés par le schéma, chemin en notation pointée.
   */
  constructor(
    readonly moduleName: string,
    readonly issues: readonly IApiErrorIssue[],
  ) {
    const lines = issues.map((issue) => `- ${issue.path || "(racine)"} : ${issue.message}`);
    super(`Options du module « ${moduleName} » invalides :\n${lines.join("\n")}`);
  }
}
