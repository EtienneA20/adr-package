import { type ExecutionContext, createParamDecorator } from "@nestjs/common";

import { readSubject } from "../subject-store";

/**
 * Injecte dans un paramètre de route le sujet résolu par `PermissionsGuard`.
 *
 * Le sujet vaut `null` sur une route `@Public()` appelée sans authentification. Sur une route
 * `@Authenticated()` ou `@Can()`, il est toujours présent (sinon le guard a répondu 401).
 * Requêtes HTTP uniquement.
 *
 * @returns Un décorateur de paramètre.
 * @example
 * ```ts
 * @Can("read", "loan")
 * @Get()
 * list(@CurrentSubject() member: IMember) {
 *   return this.loans.findFor(member);
 * }
 * ```
 * @since 0.2.0
 */
export function CurrentSubject(): ParameterDecorator {
  return createParamDecorator((_data: unknown, context: ExecutionContext) =>
    readSubject(context.switchToHttp().getRequest<object>()),
  )();
}
