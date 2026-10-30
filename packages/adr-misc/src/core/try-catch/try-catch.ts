import type { Result } from "../result";
import { toError } from "../to-error";

/**
 * Exécute une fonction synchrone et renvoie son résultat ou son erreur sous forme de `Result`,
 * sans bloc `try`/`catch`.
 *
 * À utiliser quand l'échec d'une opération synchrone (parsing JSON, conversion…) doit être
 * traité comme une valeur, par exemple pour garder une variable `const` ou enchaîner un
 * traitement de repli. L'erreur levée est normalisée en `Error` (voir `toError`). Pour une
 * opération asynchrone, utiliser `tryCatchAsync`.
 *
 * @typeParam T - Type de la valeur renvoyée par `fn`.
 * @param fn - Fonction à exécuter.
 * @returns `{ ok: true, value }` si `fn` réussit, `{ ok: false, error }` si elle lève.
 * @example
 * ```ts
 * const parsed = tryCatch(() => JSON.parse(rawLoan) as ILoan);
 * if (!parsed.ok) {
 *   logger.warn(`Emprunt illisible : ${parsed.error.message}`);
 *   return;
 * }
 * parsed.value.bookId;
 * ```
 * @since 0.2.0
 */
export function tryCatch<T>(fn: () => T): Result<T> {
  try {
    return { ok: true, value: fn() };
  } catch (error) {
    return { ok: false, error: toError(error) };
  }
}
