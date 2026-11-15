import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  Injectable,
  Logger,
} from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";

import { API_ERROR_CONTENT_TYPE, type IApiError } from "../api-error";
import { REQUEST_ID_HEADER, requestIdOf } from "../request-id";
import { requestPath } from "../request-path";
import { toApiError } from "../to-api-error";

/**
 * Filtre d'exceptions global : toute erreur d'une requête HTTP devient une réponse au format
 * d'erreur d'API (RFC 9457 + `code`), en `application/problem+json`.
 *
 * - `ApiException` (validation, permissions, export…) : corps tel quel.
 * - `HttpException` de NestJS (`NotFoundException`…) : code et titre français déduits du statut,
 *   message personnalisé en `detail`.
 * - Toute autre erreur : 500 `INTERNAL_ERROR` sans détail (le message d'origine n'est jamais
 *   envoyé), journalisée avec sa pile.
 *
 * Ajoute `instance` (chemin de la requête, sans paramètres) et `requestId` (identifiant de
 * corrélation, aussi renvoyé dans l'en-tête `x-request-id`). Indépendant de la plateforme
 * (Express, Fastify) grâce à l'adaptateur HTTP de NestJS. Les contextes non HTTP
 * (microservices, websockets) ne sont pas traités : l'exception est relancée.
 *
 * @example
 * ```ts
 * @Module({
 *   providers: [{ provide: APP_FILTER, useClass: ApiExceptionFilter }],
 * })
 * export class AppModule {}
 * ```
 * @throws L'exception d'origine, relancée hors contexte HTTP (microservices, websockets).
 * @since 0.2.0
 */
@Catch()
@Injectable()
export class ApiExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ApiExceptionFilter.name);

  /**
   * Crée le filtre.
   *
   * @param adapterHost - Accès à l'adaptateur HTTP de l'application.
   */
  constructor(private readonly adapterHost: HttpAdapterHost) {}

  /**
   * Répond à la requête en erreur.
   *
   * @param exception - Exception levée.
   * @param host - Contexte de la requête.
   * @throws L'exception d'origine, hors contexte HTTP.
   */
  catch(exception: unknown, host: ArgumentsHost): void {
    if (host.getType() !== "http") throw exception;
    const http = host.switchToHttp();
    const request = http.getRequest<object>();
    const response = http.getResponse<unknown>();
    const adapter = this.adapterHost.httpAdapter;
    const requestId = requestIdOf(request);
    const body: IApiError = {
      ...toApiError(exception),
      instance: requestPath(adapter.getRequestUrl(request)),
      requestId,
    };

    if (body.status >= 500) {
      const stack = exception instanceof Error ? exception.stack : String(exception);
      this.logger.error(`${String(body.status)} ${body.instance ?? ""} [${requestId}]`, stack);
    }
    // Erreur pendant un envoi déjà commencé (export en flux) : on ne peut que clore la réponse.
    if (adapter.isHeadersSent(response)) {
      adapter.end(response);
      return;
    }
    adapter.setHeader(response, REQUEST_ID_HEADER, requestId);
    adapter.setHeader(response, "Content-Type", API_ERROR_CONTENT_TYPE);
    adapter.reply(response, body, body.status);
  }
}
