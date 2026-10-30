import type { Result } from "../result";
import { toError } from "../to-error";

/**
 * Attend une promesse (ou exécute une fonction asynchrone) et renvoie sa valeur ou son erreur
 * sous forme de `Result`, sans bloc `try`/`catch`.
 *
 * À utiliser quand l'échec d'une opération asynchrone (appel d'API, lecture de fichier…) doit
 * être traité comme une valeur. Avec une fonction, une erreur levée de façon synchrone avant la
 * première attente est elle aussi interceptée. L'erreur est normalisée en `Error` (voir
 * `toError`). La promesse renvoyée n'est jamais rejetée.
 *
 * @typeParam T - Type de la valeur produite par la promesse.
 * @param input - Promesse à attendre, ou fonction qui la crée.
 * @returns Une promesse de `{ ok: true, value }` en cas de succès, `{ ok: false, error }` sinon.
 * @example
 * ```ts
 * const result = await tryCatchAsync(() => api.get<IBook[]>("/books"));
 * if (!result.ok) {
 *   return { books: [], error: result.error.message };
 * }
 * return { books: result.value, error: undefined };
 * ```
 * @since 0.2.0
 */
export async function tryCatchAsync<T>(input: Promise<T> | (() => Promise<T>)): Promise<Result<T>> {
  try {
    const value = await (typeof input === "function" ? input() : input);
    return { ok: true, value };
  } catch (error) {
    return { ok: false, error: toError(error) };
  }
}
