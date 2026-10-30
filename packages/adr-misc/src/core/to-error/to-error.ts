import { getErrorMessage } from "../get-error-message";

/**
 * Décrit une valeur levée sans message exploitable, pour l'inclure dans le message d'erreur.
 *
 * @param value - Valeur levée.
 * @returns Une représentation lisible de la valeur.
 */
function describeValue(value: unknown): string {
  if (typeof value === "object" && value !== null) {
    try {
      return JSON.stringify(value);
    } catch {
      // Structure circulaire ou non sérialisable : on se rabat sur l'étiquette du type.
      return Object.prototype.toString.call(value);
    }
  }
  return String(value);
}

/**
 * Convertit une valeur levée de type inconnu en instance d'`Error`.
 *
 * À utiliser dans un `catch` quand la suite du code a besoin d'une vraie `Error` (journal,
 * `Result`, nouvelle levée) alors que JavaScript permet de lever n'importe quelle valeur. Une
 * instance d'`Error` est renvoyée telle quelle ; une chaîne ou un objet doté d'un `message`
 * donnent une `Error` avec ce message ; toute autre valeur donne une `Error` qui la décrit. La
 * valeur d'origine est conservée dans `cause`.
 *
 * @param value - Valeur interceptée par le `catch`.
 * @returns La valeur elle-même si c'est une `Error`, sinon une nouvelle `Error` (`cause` = `value`).
 * @example
 * ```ts
 * try {
 *   await syncCatalog();
 * } catch (caught) {
 *   const error = toError(caught);
 *   logger.error(error.message, error.stack);
 * }
 *
 * toError("Catalogue indisponible").message; // "Catalogue indisponible"
 * toError({ message: "Quota atteint" }).message; // "Quota atteint"
 * toError(404).message; // "Valeur levée non conforme : 404"
 * ```
 * @since 0.2.0
 */
export function toError(value: unknown): Error {
  if (value instanceof Error) {
    return value;
  }
  const message = getErrorMessage(value, `Valeur levée non conforme : ${describeValue(value)}`);
  return new Error(message, { cause: value });
}
