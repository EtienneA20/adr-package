/**
 * Résultat d'une opération qui peut échouer, sous forme d'union discriminée par `ok`.
 *
 * À utiliser comme valeur de retour quand l'échec fait partie du fonctionnement normal et doit
 * être traité par l'appelant (plutôt qu'une exception qu'il pourrait oublier d'intercepter).
 * Tester `result.ok` affine le type : `value` est disponible en cas de succès, `error` en cas
 * d'échec. Produit notamment par `tryCatch` et `tryCatchAsync`.
 *
 * @typeParam T - Type de la valeur en cas de succès.
 * @typeParam E - Type de l'erreur en cas d'échec (`Error` par défaut).
 * @example
 * ```ts
 * function parseIsbn(input: string): Result<string, string> {
 *   const isbn = input.replaceAll("-", "");
 *   return /^\d{13}$/.test(isbn)
 *     ? { ok: true, value: isbn }
 *     : { ok: false, error: "ISBN invalide" };
 * }
 *
 * const result = parseIsbn("978-2-07-036024-5");
 * if (result.ok) {
 *   result.value; // string
 * } else {
 *   result.error; // string
 * }
 * ```
 * @since 0.2.0
 */
export type Result<T, E = Error> =
  | {
      /** Indique un succès. */
      ok: true;
      /** Valeur produite par l'opération. */
      value: T;
    }
  | {
      /** Indique un échec. */
      ok: false;
      /** Erreur ayant fait échouer l'opération. */
      error: E;
    };
