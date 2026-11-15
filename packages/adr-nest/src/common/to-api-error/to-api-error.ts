import { STATUS_CODES } from "node:http";

import { HttpException } from "@nestjs/common";

import { EApiErrorCode, type IApiError, type IApiErrorIssue } from "../api-error";
import { ApiException } from "../api-exception";

const CODES: Readonly<Record<number, EApiErrorCode>> = {
  400: EApiErrorCode.BAD_REQUEST,
  401: EApiErrorCode.UNAUTHENTICATED,
  403: EApiErrorCode.FORBIDDEN,
  404: EApiErrorCode.NOT_FOUND,
  409: EApiErrorCode.CONFLICT,
};

const TITLES: Readonly<Record<number, string>> = {
  400: "Requête invalide",
  401: "Authentification requise",
  403: "Accès refusé",
  404: "Ressource introuvable",
  405: "Méthode non autorisée",
  409: "Conflit",
  413: "Requête trop volumineuse",
  415: "Type de contenu non pris en charge",
  422: "Données invalides",
  429: "Trop de requêtes",
  500: "Erreur interne",
  503: "Service indisponible",
};

function messagesOf(exception: HttpException): readonly string[] {
  const response = exception.getResponse();
  const message: unknown =
    typeof response === "string" ? response : Reflect.get(response, "message");
  if (typeof message === "string") return [message];
  return Array.isArray(message) ? message.filter((item) => typeof item === "string") : [];
}

function fromHttpException(exception: HttpException): IApiError {
  const status = exception.getStatus();
  const messages = messagesOf(exception);
  const [first] = messages;
  // Le message par défaut de NestJS (« Not Found ») n'apporte rien au titre en français.
  const detail = messages.length === 1 && first !== STATUS_CODES[status] ? first : undefined;
  const errors: IApiErrorIssue[] | undefined =
    messages.length > 1 ? messages.map((message) => ({ path: "", message })) : undefined;
  return {
    type: "about:blank",
    title: TITLES[status] ?? (status >= 500 ? "Erreur du serveur" : "Requête refusée"),
    status,
    code:
      CODES[status] ?? (status >= 500 ? EApiErrorCode.INTERNAL_ERROR : EApiErrorCode.BAD_REQUEST),
    ...(detail === undefined ? {} : { detail }),
    ...(errors === undefined ? {} : { errors }),
  };
}

/**
 * Convertit une exception quelconque en corps d'erreur d'API (RFC 9457 + `code`).
 *
 * `ApiException` : corps tel quel. `HttpException` de NestJS : statut conservé, code et titre
 * français déduits du statut, message personnalisé en `detail`, liste de messages (ancien pipe
 * de validation) en `errors`. Toute autre erreur : 500 `INTERNAL_ERROR`, **sans** son message
 * (il peut contenir une requête SQL, un chemin, un secret).
 *
 * @param exception - Exception levée.
 * @returns Le corps de l'erreur, sans `instance` ni `requestId`.
 * @example
 * ```ts
 * toApiError(new NotFoundException("Livre introuvable."));
 * // { type: "about:blank", title: "Ressource introuvable", status: 404, code: "NOT_FOUND", detail: "Livre introuvable." }
 * ```
 * @internal
 */
export function toApiError(exception: unknown): IApiError {
  if (exception instanceof ApiException) return exception.getResponse();
  if (exception instanceof HttpException) return fromHttpException(exception);
  return {
    type: "about:blank",
    title: "Erreur interne",
    status: 500,
    code: EApiErrorCode.INTERNAL_ERROR,
    detail: "Une erreur inattendue est survenue. Réessayez plus tard.",
  };
}
