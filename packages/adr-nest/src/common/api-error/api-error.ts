/**
 * Codes d'erreur stables du format d'erreur d'API (`IApiError.code`).
 *
 * Mêmes valeurs que `EApiErrorCode` de `@etiennea20/adr-misc/contract` (vérifié par un test) :
 * reproduits ici pour que l'entrée principale d'adr-nest ne dépende ni d'adr-misc ni de zod.
 * Statuts usuels : 400 (`BAD_REQUEST`, `VALIDATION_FAILED`, `INVALID_QUERY`,
 * `QUERY_LIMIT_EXCEEDED`, `EXPORT_LIMIT_EXCEEDED`), 401 (`UNAUTHENTICATED`), 403
 * (`FORBIDDEN`), 404 (`NOT_FOUND`), 409 (`CONFLICT`), 500 (`INTERNAL_ERROR`).
 *
 * @example
 * ```ts
 * throw new ApiException({ status: 409, code: EApiErrorCode.CONFLICT, title: "Livre déjà emprunté" });
 * ```
 * @since 0.2.0
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

/**
 * Type de média d'une réponse d'erreur RFC 9457 (Problem Details for HTTP APIs).
 *
 * @example
 * ```ts
 * response.type(API_ERROR_CONTENT_TYPE);
 * ```
 * @since 0.2.0
 */
export const API_ERROR_CONTENT_TYPE = "application/problem+json";

/**
 * Problème précis d'une erreur d'API (un champ invalide, une limite dépassée).
 *
 * @example
 * ```ts
 * const issue: IApiErrorIssue = { path: "author.name", message: "Champ requis", code: "invalid_type" };
 * ```
 * @since 0.2.0
 */
export interface IApiErrorIssue {
  /** Chemin du champ en notation pointée (`"items.0.title"`), `""` pour la racine. */
  path: string;
  /** Message en français. */
  message: string;
  /** Code du problème (code zod comme `"invalid_type"`, ou code applicatif). */
  code?: string | undefined;
}

/**
 * Corps d'une réponse d'erreur d'API : RFC 9457 étendue par un code stable, le détail par
 * champ et l'identifiant de corrélation.
 *
 * Même forme que `ApiError` de `@etiennea20/adr-misc/contract` (vérifié par un test), que le
 * front utilise pour relire l'erreur.
 *
 * @example
 * ```ts
 * const body: IApiError = { type: "about:blank", title: "Accès refusé", status: 403, code: "FORBIDDEN" };
 * ```
 * @since 0.2.0
 */
export interface IApiError {
  /** URI du type de problème, `"about:blank"` par défaut. */
  type: string;
  /** Résumé lisible, en français. */
  title: string;
  /** Statut HTTP. */
  status: number;
  /** Explication propre à cette occurrence. */
  detail?: string | undefined;
  /** URI de la requête concernée. */
  instance?: string | undefined;
  /** Code stable (`EApiErrorCode` ou code applicatif). */
  code: string;
  /** Problèmes par champ. */
  errors?: IApiErrorIssue[] | undefined;
  /** Identifiant de corrélation de la requête. */
  requestId?: string | undefined;
}
