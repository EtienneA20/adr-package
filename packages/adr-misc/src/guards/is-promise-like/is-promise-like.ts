/**
 * Indique si une valeur est « thenable » : un objet ou une fonction qui possède une méthode
 * `then` (`Promise` native ou toute implémentation compatible).
 *
 * À utiliser quand une fonction accepte un rappel synchrone **ou** asynchrone et doit savoir
 * s'il faut attendre son résultat.
 *
 * @typeParam T - Type de la valeur résolue (déduit de l'argument, `unknown` par défaut).
 * @param value - Valeur à tester, éventuellement de type `T | PromiseLike<T>`.
 * @returns `true` si `value` est un objet ou une fonction non `null` dont la propriété `then`
 * est une fonction.
 * @example
 * ```ts
 * const result = loadBooks(); // Book[] | Promise<Book[]>
 * const books = isPromiseLike(result) ? await result : result;
 * isPromiseLike(Promise.resolve(1)); // true
 * isPromiseLike({ then: 1 }); // false
 * ```
 * @since 0.2.0
 */
export function isPromiseLike<T>(value: T | PromiseLike<T>): value is PromiseLike<T> {
  const isCandidate = (typeof value === "object" && value !== null) || typeof value === "function";
  return isCandidate && typeof (value as { then?: unknown }).then === "function";
}
