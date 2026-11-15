/**
 * Erreur de configuration d'une liste côté serveur, levée **au démarrage** (à la déclaration du
 * décorateur ou au premier appel), jamais à cause d'une requête client.
 *
 * Signale par exemple une colonne associée à un champ absent du contrat, ou un chemin de colonne
 * invalide. À corriger dans le code de l'application.
 *
 * @example
 * ```ts
 * // Lève ListQueryConfigError : « isbn » n'est pas un champ du contrat.
 * ListQuery(bookListQuery, { columns: { isbn: "isbn13" } });
 * ```
 * @since 0.2.0
 */
export class ListQueryConfigError extends Error {
  override readonly name = "ListQueryConfigError";
}
