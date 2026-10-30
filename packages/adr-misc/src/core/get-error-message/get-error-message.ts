/** Message renvoyé quand aucune information exploitable n'est trouvée dans la valeur levée. */
const DEFAULT_ERROR_MESSAGE = "Une erreur inconnue est survenue.";

/**
 * Lit le message d'une valeur levée (instance d'`Error`, chaîne ou objet `message`).
 *
 * @param value - Valeur levée.
 * @returns Le message trouvé, ou `undefined`.
 */
function readMessage(value: unknown): string | undefined {
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "object" && value !== null && "message" in value) {
    return typeof value.message === "string" ? value.message : undefined;
  }
  return undefined;
}

/**
 * Renvoie un message lisible à partir d'une valeur levée de type inconnu.
 *
 * À utiliser dans un `catch` pour afficher ou journaliser une erreur sans vérifier son type :
 * JavaScript permet de lever n'importe quelle valeur (chaîne, objet, `undefined`…). Le message
 * d'une `Error`, une chaîne levée telle quelle ou la propriété `message` d'un objet (réponse
 * d'API, erreur sérialisée) sont repris ; sinon, le message de repli est renvoyé.
 *
 * @param value - Valeur interceptée par le `catch`.
 * @param fallback - Message renvoyé si `value` ne contient aucun message non vide.
 * @returns Le message de l'erreur, ou `fallback` (par défaut « Une erreur inconnue est survenue. »).
 * @example
 * ```ts
 * try {
 *   await borrowBook(bookId);
 * } catch (error) {
 *   showToast(getErrorMessage(error, "Impossible d'emprunter ce livre."));
 * }
 *
 * getErrorMessage(new Error("Livre indisponible")); // "Livre indisponible"
 * getErrorMessage("Adhérent suspendu"); // "Adhérent suspendu"
 * getErrorMessage({ message: "Quota atteint" }); // "Quota atteint"
 * getErrorMessage(42); // "Une erreur inconnue est survenue."
 * ```
 * @since 0.2.0
 */
export function getErrorMessage(value: unknown, fallback = DEFAULT_ERROR_MESSAGE): string {
  const message = readMessage(value);
  return message === undefined || message.trim() === "" ? fallback : message;
}
