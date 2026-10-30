/**
 * Erreur levée quand une opération dépasse le délai qui lui était accordé.
 *
 * Levée (promesse rejetée) par `withTimeout` et `waitUntil`. À tester avec `instanceof` (ou
 * `error.name === "TimeoutError"`) pour distinguer un dépassement de délai des autres erreurs,
 * par exemple pour afficher « Le serveur ne répond pas » plutôt qu'une erreur générique.
 *
 * @example
 * ```ts
 * try {
 *   await withTimeout(fetchCatalog(), 5000);
 * } catch (error) {
 *   if (error instanceof TimeoutError) {
 *     showToast("Le catalogue met trop de temps à répondre.");
 *   }
 * }
 *
 * throw new TimeoutError("La réservation n'a pas été confirmée à temps.");
 * ```
 * @since 0.2.0
 */
export class TimeoutError extends Error {
  /** Nom de l'erreur, toujours `"TimeoutError"`. */
  override readonly name = "TimeoutError";

  /**
   * Crée une erreur de dépassement de délai.
   *
   * @param message - Message de l'erreur, en français.
   */
  constructor(message = "Le délai d'attente est dépassé.") {
    super(message);
  }
}
