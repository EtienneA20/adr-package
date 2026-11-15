import { randomUUID } from "node:crypto";

import { type ExecutionContext, createParamDecorator } from "@nestjs/common";

/**
 * En-tête HTTP de l'identifiant de corrélation : lu sur la requête (proxy, front) et renvoyé
 * dans la réponse.
 *
 * @example
 * ```ts
 * fetch("/api/livres", { headers: { [REQUEST_ID_HEADER]: crypto.randomUUID() } });
 * ```
 * @since 0.2.0
 */
export const REQUEST_ID_HEADER = "x-request-id";

// Identifiant accepté depuis le client : court et sans caractère de contrôle, pour qu'il ne
// puisse ni injecter de fausses lignes de journal ni gonfler les journaux.
const ACCEPTED_REQUEST_ID = /^[\w.:-]{1,128}$/;

const requestIds = new WeakMap<object, string>();

function headerValue(request: object): string | undefined {
  const headers: unknown = Reflect.get(request, "headers");
  if (typeof headers !== "object" || headers === null) return undefined;
  const value: unknown = Reflect.get(headers, REQUEST_ID_HEADER);
  return typeof value === "string" && ACCEPTED_REQUEST_ID.test(value) ? value : undefined;
}

/**
 * Renvoie l'identifiant de corrélation d'une requête, attribué au premier appel : celui de
 * l'en-tête `x-request-id` s'il est valide (lettres, chiffres, `_ . : -`, 128 caractères au
 * plus), sinon un UUID généré.
 *
 * Partagé par `RequestLoggingInterceptor`, `ApiExceptionFilter` et `RequestId` : la même
 * requête a toujours le même identifiant, dans les journaux comme dans la réponse d'erreur.
 *
 * @param request - Objet requête (Express, Fastify).
 * @returns L'identifiant de corrélation.
 * @example
 * ```ts
 * this.logger.log(`Export lancé [${requestIdOf(request)}]`);
 * ```
 * @since 0.2.0
 */
export function requestIdOf(request: object): string {
  let id = requestIds.get(request);
  if (id === undefined) {
    id = headerValue(request) ?? randomUUID();
    requestIds.set(request, id);
  }
  return id;
}

/**
 * Injecte dans un paramètre de route l'identifiant de corrélation de la requête
 * (`requestIdOf`), par exemple pour le transmettre à un service appelé ou à un journal métier.
 *
 * @returns Un décorateur de paramètre.
 * @example
 * ```ts
 * @Post()
 * create(@RequestId() requestId: string, @ValidBody(createBookSchema) input: CreateBookInput) {
 *   return this.books.create(input, { requestId });
 * }
 * ```
 * @since 0.2.0
 */
export function RequestId(): ParameterDecorator {
  return createParamDecorator((_data: unknown, context: ExecutionContext) =>
    requestIdOf(context.switchToHttp().getRequest<object>()),
  )();
}
