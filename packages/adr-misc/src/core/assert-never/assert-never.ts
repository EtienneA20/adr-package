/**
 * Décrit la valeur inattendue pour le message d'erreur.
 *
 * @param value - Valeur reçue.
 * @returns Sa représentation JSON pour un objet ou une chaîne, `String(value)` sinon.
 */
function describeValue(value: unknown): string {
  if (typeof value === "object" && value !== null) {
    try {
      return JSON.stringify(value);
    } catch {
      // Structure circulaire : on se rabat sur l'étiquette du type.
      return Object.prototype.toString.call(value);
    }
  }
  return typeof value === "string" ? JSON.stringify(value) : String(value);
}

/**
 * Signale un cas qui ne devrait jamais être atteint et lève une erreur s'il l'est.
 *
 * À placer dans la branche `default` d'un `switch` (ou le `else` final d'une suite de tests)
 * sur une union discriminée : TypeScript refuse alors de compiler tant qu'un cas de l'union
 * n'est pas traité, et l'erreur protège l'exécution si une valeur inattendue arrive malgré tout
 * (donnée externe, version d'API différente…).
 *
 * @param value - Valeur restante après le traitement de tous les cas ; son type doit être `never`.
 * @param message - Message de l'erreur levée. Par défaut, il cite la valeur reçue.
 * @returns Ne renvoie jamais : lève toujours une erreur.
 * @throws {@link Error} Toujours, puisque l'appel signifie qu'un cas n'a pas été traité.
 * @example
 * ```ts
 * type LoanStatus = "active" | "returned" | "late";
 *
 * function getLabel(status: LoanStatus): string {
 *   switch (status) {
 *     case "active":
 *       return "En cours";
 *     case "returned":
 *       return "Rendu";
 *     case "late":
 *       return "En retard";
 *     default:
 *       return assertNever(status);
 *   }
 * }
 * ```
 * @since 0.2.0
 */
export function assertNever(value: never, message?: string): never {
  throw new Error(message ?? `Valeur inattendue : ${describeValue(value)}`);
}
