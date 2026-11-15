import { HttpException } from "@nestjs/common";

import type { IApiError, IApiErrorIssue } from "../api-error";

/**
 * Description d'une erreur d'API, passée au constructeur de {@link ApiException}.
 *
 * @example
 * ```ts
 * const options: IApiExceptionOptions = { status: 409, code: "LOAN_LIMIT_REACHED", title: "Trop d'emprunts" };
 * ```
 * @since 0.2.0
 */
export interface IApiExceptionOptions {
  /** Statut HTTP (400 à 599). */
  readonly status: number;
  /** Code stable (`EApiErrorCode` ou code applicatif). */
  readonly code: string;
  /** Résumé lisible, en français. */
  readonly title: string;
  /** Explication propre à cette occurrence. */
  readonly detail?: string | undefined;
  /** Problèmes par champ. */
  readonly errors?: readonly IApiErrorIssue[] | undefined;
  /** URI du type de problème (`"about:blank"` par défaut). */
  readonly type?: string | undefined;
  /** Erreur d'origine, conservée pour la journalisation (jamais envoyée au client). */
  readonly cause?: unknown;
}

/**
 * Exception HTTP dont la réponse suit le format d'erreur d'API (RFC 9457 + `code`).
 *
 * À lever dans un service ou un contrôleur pour une erreur métier que le front doit pouvoir
 * reconnaître par son code (`LOAN_LIMIT_REACHED`), plutôt qu'une `HttpException` au corps
 * libre. Sans filtre d'exceptions dédié, NestJS renvoie déjà ce corps (`getResponse()`) avec
 * le bon statut ; le filtre du package ajoute `instance`, `requestId` et l'en-tête
 * `application/problem+json`.
 *
 * @example
 * ```ts
 * throw new ApiException({
 *   status: 409,
 *   code: "LOAN_LIMIT_REACHED",
 *   title: "Nombre maximal d'emprunts atteint",
 *   detail: "Un adhérent ne peut pas emprunter plus de 5 livres.",
 * });
 * ```
 * @since 0.2.0
 */
export class ApiException extends HttpException {
  /** Code stable de l'erreur. */
  readonly code: string;

  /**
   * Crée une exception au format d'erreur d'API.
   *
   * @param options - Statut, code, titre et détails de l'erreur.
   */
  constructor(options: IApiExceptionOptions) {
    const body: IApiError = {
      type: options.type ?? "about:blank",
      title: options.title,
      status: options.status,
      code: options.code,
      ...(options.detail === undefined ? {} : { detail: options.detail }),
      ...(options.errors === undefined
        ? {}
        : { errors: options.errors.map((issue) => ({ ...issue })) }),
    };
    super(body, options.status, { cause: options.cause });
    this.code = options.code;
    this.message = options.detail ?? options.title;
  }

  /**
   * Renvoie le corps de la réponse (format d'erreur d'API).
   *
   * @returns Une copie du corps de la réponse.
   */
  override getResponse(): IApiError {
    const body = super.getResponse() as IApiError;
    return {
      ...body,
      ...(body.errors ? { errors: body.errors.map((issue) => ({ ...issue })) } : {}),
    };
  }
}
