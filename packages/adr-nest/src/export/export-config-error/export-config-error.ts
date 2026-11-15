/**
 * Erreur de configuration d'un export côté serveur (colonnes invalides, limite incohérente),
 * levée à la définition des colonnes, jamais à cause d'une requête client.
 *
 * @example
 * ```ts
 * // Lève ExportConfigError : la clé « title » est en double.
 * defineExportColumns([{ key: "title", header: "Titre" }, { key: "title", header: "Nom" }]);
 * ```
 * @since 0.2.0
 */
export class ExportConfigError extends Error {
  override readonly name = "ExportConfigError";
}
