/**
 * Codes d'erreur stables du format d'erreur d'API (`ApiError.code`), partagés entre le serveur
 * et le front.
 *
 * À utiliser pour réagir à une erreur sans dépendre de son message (traduit, susceptible de
 * changer) ni seulement de son statut HTTP. Une application peut définir ses propres codes en
 * plus de ceux-ci (`ApiError.code` est un texte). Statut HTTP usuel :
 *
 * - `BAD_REQUEST` (400) : requête mal formée, sans détail par champ ;
 * - `VALIDATION_FAILED` (400) : corps ou paramètres invalides, détail dans `errors` ;
 * - `INVALID_QUERY` (400) : paramètres de liste (filtre, tri, pagination) invalides ;
 * - `QUERY_LIMIT_EXCEEDED` (400) : limite du contrat de liste dépassée ;
 * - `UNAUTHENTICATED` (401), `FORBIDDEN` (403), `NOT_FOUND` (404), `CONFLICT` (409) ;
 * - `EXPORT_LIMIT_EXCEEDED` (400) : export au-delà du nombre de lignes autorisé ;
 * - `INTERNAL_ERROR` (500) : erreur inattendue, sans détail.
 *
 * @example
 * ```ts
 * if (error.code === EApiErrorCode.FORBIDDEN) showAccessDenied();
 * ```
 * @since 0.3.0
 */
export const EApiErrorCode = {
  BAD_REQUEST: "BAD_REQUEST",
  VALIDATION_FAILED: "VALIDATION_FAILED",
  INVALID_QUERY: "INVALID_QUERY",
  QUERY_LIMIT_EXCEEDED: "QUERY_LIMIT_EXCEEDED",
  UNAUTHENTICATED: "UNAUTHENTICATED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  CONFLICT: "CONFLICT",
  EXPORT_LIMIT_EXCEEDED: "EXPORT_LIMIT_EXCEEDED",
  INTERNAL_ERROR: "INTERNAL_ERROR",
} as const;

/** Valeur possible de {@link EApiErrorCode}. */
export type EApiErrorCode = (typeof EApiErrorCode)[keyof typeof EApiErrorCode];
