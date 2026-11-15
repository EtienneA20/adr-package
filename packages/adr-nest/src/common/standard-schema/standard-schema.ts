/**
 * Problème renvoyé par un schéma Standard Schema (zod 4, Valibot, ArkType…).
 *
 * Copie de `StandardSchemaV1.Issue` (https://standardschema.dev), que la spécification autorise
 * à recopier pour ne pas dépendre de `@standard-schema/spec`.
 *
 * @example
 * ```ts
 * const issue: IStandardSchemaIssue = { message: "Champ requis", path: ["author", "name"] };
 * ```
 * @since 0.2.0
 */
export interface IStandardSchemaIssue {
  /** Message du problème. */
  readonly message: string;
  /** Chemin de la valeur fautive : clés simples ou segments `{ key }`. */
  readonly path?: readonly (PropertyKey | { readonly key: PropertyKey })[] | undefined;
}

/**
 * Résultat de la validation d'un schéma Standard Schema : la valeur validée, ou les problèmes.
 *
 * @typeParam T - Type de la valeur validée.
 * @example
 * ```ts
 * const result: StandardSchemaResult<string> = { value: "Dune" };
 * ```
 * @since 0.2.0
 */
export type StandardSchemaResult<T> =
  | { readonly value: T; readonly issues?: undefined }
  | { readonly issues: readonly IStandardSchemaIssue[] };

/**
 * Schéma compatible Standard Schema v1 : tout schéma zod 4 (et de nombreuses autres
 * bibliothèques) le satisfait sans adaptateur.
 *
 * À utiliser pour typer un paramètre qui accepte un schéma de validation sans imposer zod.
 * Copie minimale de `StandardSchemaV1` (https://standardschema.dev).
 *
 * @typeParam TInput - Type accepté en entrée.
 * @typeParam TOutput - Type produit après validation.
 * @example
 * ```ts
 * const schema: IStandardSchema<unknown, { title: string }> = z.object({ title: z.string() });
 * ```
 * @since 0.2.0
 */
export interface IStandardSchema<TInput = unknown, TOutput = TInput> {
  /** Propriétés normalisées du schéma. */
  readonly "~standard": {
    /** Version de la spécification. */
    readonly version: 1;
    /** Bibliothèque qui fournit le schéma (`"zod"`…). */
    readonly vendor: string;
    /** Valide une valeur, de façon synchrone ou asynchrone. */
    readonly validate: (
      value: unknown,
    ) => StandardSchemaResult<TOutput> | Promise<StandardSchemaResult<TOutput>>;
    /** Types d'entrée et de sortie (inférence uniquement). */
    readonly types?: { readonly input: TInput; readonly output: TOutput } | undefined;
  };
}

/**
 * Type de sortie d'un schéma Standard Schema (valeur produite après validation).
 *
 * @typeParam S - Schéma.
 * @example
 * ```ts
 * const bookSchema = z.object({ title: z.string() });
 * type IBookInput = InferSchemaOutput<typeof bookSchema>; // { title: string }
 * ```
 * @since 0.2.0
 */
export type InferSchemaOutput<S extends IStandardSchema> = NonNullable<
  S["~standard"]["types"]
>["output"];

/**
 * Type d'entrée d'un schéma Standard Schema (valeur acceptée avant validation : champs avec
 * valeur par défaut facultatifs).
 *
 * @typeParam S - Schéma.
 * @example
 * ```ts
 * const optionsSchema = z.object({ days: z.int().default(3) });
 * type OptionsInput = InferSchemaInput<typeof optionsSchema>; // { days?: number | undefined }
 * ```
 * @since 0.2.0
 */
export type InferSchemaInput<S extends IStandardSchema> = NonNullable<
  S["~standard"]["types"]
>["input"];
