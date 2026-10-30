/**
 * Méthodes HTTP, en majuscules comme dans les requêtes.
 *
 * À utiliser pour typer la méthode d'une requête ou d'une route (client HTTP, journalisation,
 * droits par méthode) plutôt qu'une chaîne libre.
 *
 * @example
 * ```ts
 * const method: EHttpMethod = EHttpMethod.POST; // "POST"
 * ```
 * @since 0.2.0
 */
export const EHttpMethod = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  PATCH: "PATCH",
  DELETE: "DELETE",
  HEAD: "HEAD",
  OPTIONS: "OPTIONS",
} as const;

/** Valeur possible de {@link EHttpMethod}. */
export type EHttpMethod = (typeof EHttpMethod)[keyof typeof EHttpMethod];
