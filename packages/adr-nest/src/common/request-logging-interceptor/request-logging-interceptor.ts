import {
  type CallHandler,
  type ExecutionContext,
  HttpException,
  Injectable,
  Logger,
  type NestInterceptor,
} from "@nestjs/common";
import { HTTP_CODE_METADATA } from "@nestjs/common/constants";
import { HttpAdapterHost } from "@nestjs/core";
import { type Observable, tap } from "rxjs";

import { REQUEST_ID_HEADER, requestIdOf } from "../request-id";
import { requestPath } from "../request-path";

function successStatus(context: ExecutionContext, method: string): number {
  const status: unknown = Reflect.getMetadata(HTTP_CODE_METADATA, context.getHandler());
  if (typeof status === "number") return status;
  return method === "POST" ? 201 : 200;
}

function errorStatus(error: unknown): number {
  return error instanceof HttpException ? error.getStatus() : 500;
}

/**
 * Intercepteur de journalisation : une ligne par requête HTTP, avec son identifiant de
 * corrélation, et l'en-tête `x-request-id` dans la réponse.
 *
 * Format : `GET /livres 200 12 ms [<requestId>]` (contexte `HTTP` du `Logger` de NestJS), en
 * `log` (succès), `warn` (4xx) ou `error` (5xx ; la pile est journalisée par
 * `ApiExceptionFilter`). Le chemin est écrit sans paramètres d'URL, qui peuvent contenir des
 * données personnelles. Une requête refusée par un guard (401, 403) n'atteint pas les
 * intercepteurs : elle n'est pas journalisée ici. L'identifiant reprend l'en-tête
 * `x-request-id` reçu s'il est valide, sinon il est généré.
 *
 * @example
 * ```ts
 * @Module({
 *   providers: [{ provide: APP_INTERCEPTOR, useClass: RequestLoggingInterceptor }],
 * })
 * export class AppModule {}
 * ```
 * @since 0.2.0
 */
@Injectable()
export class RequestLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger("HTTP");

  /**
   * Crée l'intercepteur.
   *
   * @param adapterHost - Accès à l'adaptateur HTTP de l'application.
   */
  constructor(private readonly adapterHost: HttpAdapterHost) {}

  /**
   * Journalise la requête à la fin de son traitement.
   *
   * @param context - Contexte d'exécution.
   * @param next - Suite du traitement.
   * @returns Le flux de la réponse, inchangé.
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() !== "http") return next.handle();
    const http = context.switchToHttp();
    const request = http.getRequest<object>();
    const adapter = this.adapterHost.httpAdapter;
    const requestId = requestIdOf(request);
    adapter.setHeader(http.getResponse(), REQUEST_ID_HEADER, requestId);

    const method = String(adapter.getRequestMethod(request));
    const path = requestPath(adapter.getRequestUrl(request));
    const start = performance.now();
    const line = (status: number): string =>
      `${method} ${path} ${String(status)} ${String(Math.round(performance.now() - start))} ms [${requestId}]`;

    return next.handle().pipe(
      tap({
        complete: () => {
          this.logger.log(line(successStatus(context, method)));
        },
        error: (error: unknown) => {
          const status = errorStatus(error);
          if (status >= 500) this.logger.error(line(status));
          else this.logger.warn(line(status));
        },
      }),
    );
  }
}
