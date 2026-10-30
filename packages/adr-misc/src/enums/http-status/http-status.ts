/**
 * Codes de statut HTTP courants, nommés comme dans la RFC 9110 (et comme `HttpStatus` de
 * NestJS).
 *
 * À utiliser côté front pour interpréter une réponse (`error.response.status`) et côté back
 * pour renvoyer un statut, sans nombre magique. Seuls les codes d'usage courant sont présents.
 *
 * @example
 * ```ts
 * if (response.status === EHttpStatus.NOT_FOUND) {
 *   showMessage("Livre introuvable");
 * }
 * ```
 * @since 0.2.0
 */
export const EHttpStatus = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  MOVED_PERMANENTLY: 301,
  FOUND: 302,
  NOT_MODIFIED: 304,
  TEMPORARY_REDIRECT: 307,
  PERMANENT_REDIRECT: 308,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  GONE: 410,
  PAYLOAD_TOO_LARGE: 413,
  UNSUPPORTED_MEDIA_TYPE: 415,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const;

/** Valeur possible de {@link EHttpStatus}. */
export type EHttpStatus = (typeof EHttpStatus)[keyof typeof EHttpStatus];
