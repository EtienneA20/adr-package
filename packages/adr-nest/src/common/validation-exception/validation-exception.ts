import { EApiErrorCode } from "../api-error";
import { ApiException } from "../api-exception";
import { toApiErrorIssues } from "../issue-path";
import type { IStandardSchemaIssue } from "../standard-schema";

/**
 * Options d'une {@link ValidationException} : code, titre et statut de la réponse.
 *
 * @example
 * ```ts
 * const options: IValidationExceptionOptions = { code: "INVALID_QUERY", title: "Paramètres de liste invalides" };
 * ```
 * @since 0.2.0
 */
export interface IValidationExceptionOptions {
  /** Code de l'erreur (`VALIDATION_FAILED` par défaut). */
  readonly code?: string | undefined;
  /** Titre de l'erreur (`"Données invalides"` par défaut). */
  readonly title?: string | undefined;
  /** Statut HTTP : 400 (par défaut) ou 422. */
  readonly status?: 400 | 422 | undefined;
}

/**
 * Erreur de validation au format d'erreur d'API : une `400` (par défaut) dont `errors` liste
 * chaque problème avec le chemin du champ.
 *
 * Levée par `SchemaValidationPipe` et par `apiValidationExceptionFactory`. À lever soi-même
 * après une validation manuelle (`schema["~standard"].validate`). Le code par défaut est
 * `VALIDATION_FAILED` ; un problème qui porte un code applicatif (`params.code`, par exemple
 * `QUERY_LIMIT_EXCEEDED` du contrat de liste) le garde dans `errors[].code`.
 *
 * @example
 * ```ts
 * const result = await createBookSchema["~standard"].validate(input);
 * if (result.issues) throw new ValidationException(result.issues);
 * ```
 * @since 0.2.0
 */
export class ValidationException extends ApiException {
  /**
   * Crée une erreur de validation à partir des problèmes d'un schéma.
   *
   * @param issues - Problèmes renvoyés par un schéma Standard Schema (zod 4…).
   * @param options - Code, titre et statut de la réponse.
   */
  constructor(issues: readonly IStandardSchemaIssue[], options: IValidationExceptionOptions = {}) {
    super({
      status: options.status ?? 400,
      code: options.code ?? EApiErrorCode.VALIDATION_FAILED,
      title: options.title ?? "Données invalides",
      errors: toApiErrorIssues(issues),
    });
  }
}

/**
 * Fabrique d'exception pour le `StandardSchemaValidationPipe` natif de NestJS 12 : les erreurs
 * de validation suivent alors le format d'erreur d'API.
 *
 * À utiliser avec la validation intégrée de NestJS 12 (`@Body({ schema })`). Sous NestJS 11,
 * utiliser `SchemaValidationPipe` (ou `ValidBody`, `ValidQuery`).
 *
 * @param issues - Problèmes renvoyés par le schéma.
 * @returns Une `ValidationException` (400, `VALIDATION_FAILED`).
 * @example
 * ```ts
 * app.useGlobalPipes(new StandardSchemaValidationPipe({ exceptionFactory: apiValidationExceptionFactory }));
 * ```
 * @since 0.2.0
 */
export function apiValidationExceptionFactory(
  issues: readonly IStandardSchemaIssue[],
): ValidationException {
  return new ValidationException(issues);
}
