import { assertDelay } from "../assert-delay";
import { TimeoutError } from "../timeout-error";
import { getTimers } from "../timers";

/**
 * Attend une promesse en limitant la durée d'attente.
 *
 * À utiliser pour ne pas rester bloqué sur une opération qui peut ne jamais aboutir (appel
 * réseau, service externe lent). Si la promesse n'est pas réglée dans le délai, la promesse
 * renvoyée est rejetée avec une {@link TimeoutError}. Attention : l'opération d'origine n'est
 * pas annulée, seule l'attente l'est (utiliser un `AbortController` pour l'annuler réellement).
 *
 * @typeParam T - Type de la valeur produite par la promesse.
 * @param promise - Promesse à attendre.
 * @param ms - Délai maximal en millisecondes (nombre fini, positif ou nul).
 * @param message - Message de la `TimeoutError`. Par défaut : « Délai d'attente de `ms` ms dépassé. »
 * @returns Une promesse réglée comme `promise` si elle se règle à temps.
 * @throws {@link TimeoutError} (promesse rejetée) Si `promise` n'est pas réglée dans le délai.
 * @throws {@link RangeError} (promesse rejetée) Si `ms` est négatif, infini ou `NaN`.
 * @example
 * ```ts
 * const books = await withTimeout(
 *   api.get<IBook[]>("/books"),
 *   5000,
 *   "Le catalogue met trop de temps à répondre.",
 * );
 * ```
 * @since 0.2.0
 */
export async function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  message?: string,
): Promise<T> {
  assertDelay(ms, "ms");
  const timers = getTimers();
  let handle: unknown;
  const timeout = new Promise<never>((_resolve, reject) => {
    handle = timers.setTimeout(() => {
      reject(new TimeoutError(message ?? `Délai d'attente de ${ms} ms dépassé.`));
    }, ms);
  });
  try {
    return await Promise.race([promise, timeout]);
  } finally {
    timers.clearTimeout(handle);
  }
}
