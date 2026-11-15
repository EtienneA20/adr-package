import { Body, type PipeTransform, Query } from "@nestjs/common";

import type { IStandardSchema, InferSchemaOutput } from "../standard-schema";
import { type IValidationExceptionOptions, ValidationException } from "../validation-exception";

/**
 * Pipe de validation générique : valide une valeur avec un schéma Standard Schema (zod 4,
 * Valibot, ArkType…) et renvoie la valeur produite par le schéma (valeurs par défaut,
 * conversions, clés inconnues retirées par zod).
 *
 * À utiliser sous NestJS 11 et 12 sur un paramètre (`@Body(new SchemaValidationPipe(schema))`),
 * ou plus simplement via `ValidBody` et `ValidQuery`. Le schéma est la source de vérité du
 * type : pas de classe DTO ni de `class-validator`. En cas d'échec, lève une
 * `ValidationException` (400, format d'erreur d'API, détail par champ).
 *
 * @typeParam S - Schéma de validation.
 * @throws {@link ValidationException} Par `transform`, si la valeur ne respecte pas le schéma.
 * @example
 * ```ts
 * @Post()
 * create(@Body(new SchemaValidationPipe(createBookSchema)) input: z.output<typeof createBookSchema>) {
 *   return this.books.create(input);
 * }
 * ```
 * @since 0.2.0
 */
export class SchemaValidationPipe<S extends IStandardSchema> implements PipeTransform<
  unknown,
  Promise<InferSchemaOutput<S>>
> {
  /**
   * Crée un pipe pour un schéma.
   *
   * @param schema - Schéma Standard Schema (zod 4…).
   * @param options - Code, titre et statut de l'erreur levée en cas d'échec.
   */
  constructor(
    readonly schema: S,
    private readonly options: IValidationExceptionOptions = {},
  ) {}

  /**
   * Valide la valeur.
   *
   * @param value - Valeur reçue (corps, paramètres de requête…).
   * @returns La valeur produite par le schéma.
   * @throws {@link ValidationException} Si la valeur ne respecte pas le schéma.
   */
  async transform(value: unknown): Promise<InferSchemaOutput<S>> {
    const result = await this.schema["~standard"].validate(value);
    if (result.issues) throw new ValidationException(result.issues, this.options);
    return result.value;
  }
}

/**
 * Décorateur de paramètre : le corps de la requête, validé par un schéma Standard Schema.
 *
 * Raccourci de `@Body(new SchemaValidationPipe(schema, options))`, valable sous NestJS 11 et 12.
 * Le type du paramètre s'écrit `z.output<typeof schema>` (ou `InferSchemaOutput`).
 *
 * @param schema - Schéma du corps.
 * @param options - Code, titre et statut de l'erreur levée en cas d'échec.
 * @returns Un décorateur de paramètre.
 * @throws {@link ValidationException} À l'exécution de la route, si le corps est invalide.
 * @example
 * ```ts
 * @Post()
 * create(@ValidBody(createBookSchema) input: z.output<typeof createBookSchema>) {
 *   return this.books.create(input);
 * }
 * ```
 * @since 0.2.0
 */
export function ValidBody(
  schema: IStandardSchema,
  options?: IValidationExceptionOptions,
): ParameterDecorator {
  return Body(new SchemaValidationPipe(schema, options));
}

/**
 * Décorateur de paramètre : les paramètres de requête (`?…`), validés par un schéma Standard
 * Schema.
 *
 * Raccourci de `@Query(new SchemaValidationPipe(schema, options))`, valable sous NestJS 11 et
 * 12. Les paramètres d'URL arrivent en texte : utiliser `z.coerce` pour les nombres et
 * booléens. Pour une liste paginée, préférer le décorateur du filtrage.
 *
 * @param schema - Schéma de l'objet des paramètres de requête.
 * @param options - Code, titre et statut de l'erreur levée en cas d'échec.
 * @returns Un décorateur de paramètre.
 * @throws {@link ValidationException} À l'exécution de la route, si les paramètres sont invalides.
 * @example
 * ```ts
 * @Get("disponibles")
 * available(@ValidQuery(z.object({ limit: z.coerce.number().int().max(50) })) query: { limit: number }) {
 *   return this.books.available(query.limit);
 * }
 * ```
 * @since 0.2.0
 */
export function ValidQuery(
  schema: IStandardSchema,
  options?: IValidationExceptionOptions,
): ParameterDecorator {
  return Query(new SchemaValidationPipe(schema, options));
}
