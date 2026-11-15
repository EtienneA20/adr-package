---
skill: adr-nest
description: >-
  À utiliser pour développer ou utiliser @etiennea20/adr-nest : utilitaires backend NestJS
  (décorateurs, guards, pipes, interceptors, services), gestion des droits et des routes
  publiques, filtrage avancé des requêtes, export Excel et JSON. Donne l'inventaire des éléments
  publics, leur signature, leurs erreurs et un exemple d'utilisation dans un module NestJS.
---

# SKILLS : @etiennea20/adr-nest

## Introduction

Utilitaires pour applications NestJS (11 ou 12), compilés en CommonJS avec les métadonnées de
décorateurs (`emitDecoratorMetadata`).

- Points d'entrée : `@etiennea20/adr-nest` (common, rights), `@etiennea20/adr-nest/filtering`
  (exige `@etiennea20/adr-misc` ≥ 0.3 et `zod` ≥ 4, peerDependencies optionnelles) et
  `@etiennea20/adr-nest/prisma` (aucune dépendance).
- peerDependencies : `@nestjs/common`, `@nestjs/core`, `reflect-metadata`, `rxjs`.
- Catégories : `common` (format d'erreur d'API, exceptions, validation, éléments
  transverses), `rights` (gestion des droits), `filtering` (requêtes de liste, sous-chemin),
  `prisma` (adaptateur, sous-chemin), `export` (export Excel et JSON).

## Table des matières

- [common](#common) : format d'erreur d'API, exceptions et validation (`API_ERROR_CONTENT_TYPE`, `ApiException`, `apiValidationExceptionFactory`, `EApiErrorCode`, `IApiError`, `IApiErrorIssue`, `IApiExceptionOptions`, `InferSchemaOutput`, `IStandardSchema`, `IStandardSchemaIssue`, `IValidationExceptionOptions`, `SchemaValidationPipe`, `StandardSchemaResult`, `ValidationException`, `ValidBody`, `ValidQuery`)
- [rights](#rights) : gestion des droits
  - [`Public`](#public)
  - [`IS_PUBLIC_KEY`](#is_public_key)
- [filtering](#filtering) : requêtes de liste et critères, sous-chemin `/filtering` (`andCriteria`, `applyCriteriaInMemory`, `CriteriaNode`, `CriteriaValue`, `ICriteriaCondition`, `ICriteriaOrder`, `IListCriteria`, `IListCriteriaOptions`, `IListQueryParamOptions`, `ListQuery`, `ListQueryConfigError`, `parseListQuery`, `toListCriteria`, `toPage`)
- [prisma](#prisma) : adaptateur Prisma, sous-chemin `/prisma` (`IPrismaFindArgs`, `toPrismaFindArgs`, `toPrismaWhere`)
- `export` : export Excel et JSON (aucun élément pour l'instant)

## common

Format d'erreur d'API (RFC 9457 + `code`), exceptions et validation par schéma Standard Schema (zod 4). Aucune dépendance au-delà des peerDependencies NestJS.

### `SchemaValidationPipe`

| Champ          | Valeur                                                             |
| -------------- | ------------------------------------------------------------------ |
| Catégorie      | `common`                                                           |
| Point d'entrée | `@etiennea20/adr-nest`                                             |
| Statut         | stable                                                             |
| Depuis         | 0.2.0                                                              |
| Source         | `src/common/schema-validation-pipe/schema-validation-pipe.ts`      |
| Tests          | `src/common/schema-validation-pipe/schema-validation-pipe.test.ts` |

**Signature**

```ts
class SchemaValidationPipe<S extends IStandardSchema> implements PipeTransform<
  unknown,
  Promise<InferSchemaOutput<S>>
> {
  constructor(schema: S, options?: IValidationExceptionOptions);
  readonly schema: S;
  transform(value: unknown): Promise<InferSchemaOutput<S>>;
}
```

**Description** : pipe de validation générique (NestJS 11 et 12) : valide une valeur avec un schéma Standard Schema (zod 4, Valibot, ArkType…) et renvoie la valeur **produite par le schéma** (textes nettoyés, valeurs par défaut, clés inconnues retirées par zod). Le schéma est la source de vérité du type : pas de DTO ni de `class-validator`. Préférer les raccourcis `ValidBody` et `ValidQuery`.

**Paramètres**

- `schema` : schéma Standard Schema.
- `options` : code, titre et statut de l'erreur levée (`IValidationExceptionOptions`).
- `transform(value)` : valeur reçue (corps, paramètres de requête…).

**Retour** : `transform` renvoie (promesse) la valeur produite par le schéma.

**Erreurs** : `transform` lève `ValidationException` (400 `VALIDATION_FAILED` par défaut, détail par champ) si la valeur ne respecte pas le schéma.

**Exemple**

```ts
import { SchemaValidationPipe } from "@etiennea20/adr-nest";
import { Body, Controller, Post } from "@nestjs/common";
import { z } from "zod";

const createBookSchema = z.object({ title: z.string().trim().min(1) });

@Controller("livres")
export class BooksController {
  @Post()
  create(
    @Body(new SchemaValidationPipe(createBookSchema)) input: z.output<typeof createBookSchema>,
  ) {
    return input;
  }
}
```

### `ValidBody`

| Champ          | Valeur                                                             |
| -------------- | ------------------------------------------------------------------ |
| Catégorie      | `common`                                                           |
| Point d'entrée | `@etiennea20/adr-nest`                                             |
| Statut         | stable                                                             |
| Depuis         | 0.2.0                                                              |
| Source         | `src/common/schema-validation-pipe/schema-validation-pipe.ts`      |
| Tests          | `src/common/schema-validation-pipe/schema-validation-pipe.test.ts` |

**Signature**

```ts
function ValidBody(
  schema: IStandardSchema,
  options?: IValidationExceptionOptions,
): ParameterDecorator;
```

**Description** : décorateur de paramètre : le corps de la requête, validé par un schéma Standard Schema. Raccourci de `@Body(new SchemaValidationPipe(schema, options))`, valable sous NestJS 11 et 12. Typer le paramètre avec `z.output<typeof schema>`.

**Paramètres**

- `schema` : schéma du corps.
- `options` : code, titre et statut de l'erreur.

**Retour** : un décorateur de paramètre.

**Erreurs** : à l'exécution de la route, `ValidationException` si le corps est invalide.

**Exemple**

```ts
import { ValidBody } from "@etiennea20/adr-nest";

@Post()
create(@ValidBody(createBookSchema) input: CreateBookInput) {
  return this.books.create(input);
}
```

### `ValidQuery`

| Champ          | Valeur                                                             |
| -------------- | ------------------------------------------------------------------ |
| Catégorie      | `common`                                                           |
| Point d'entrée | `@etiennea20/adr-nest`                                             |
| Statut         | stable                                                             |
| Depuis         | 0.2.0                                                              |
| Source         | `src/common/schema-validation-pipe/schema-validation-pipe.ts`      |
| Tests          | `src/common/schema-validation-pipe/schema-validation-pipe.test.ts` |

**Signature**

```ts
function ValidQuery(
  schema: IStandardSchema,
  options?: IValidationExceptionOptions,
): ParameterDecorator;
```

**Description** : décorateur de paramètre : l'objet des paramètres de requête (`?…`), validé par un schéma Standard Schema. Raccourci de `@Query(new SchemaValidationPipe(schema, options))`. Les paramètres d'URL arrivent en texte : utiliser `z.coerce` pour les nombres et booléens. Pour une liste paginée, préférer le décorateur du filtrage.

**Paramètres**

- `schema` : schéma des paramètres de requête.
- `options` : code, titre et statut de l'erreur.

**Retour** : un décorateur de paramètre.

**Erreurs** : à l'exécution de la route, `ValidationException` si les paramètres sont invalides.

**Exemple**

```ts
import { ValidQuery } from "@etiennea20/adr-nest";
import { z } from "zod";

const availableQuerySchema = z.object({ limit: z.coerce.number().int().max(50).default(10) });

@Get("disponibles")
available(@ValidQuery(availableQuerySchema) query: z.output<typeof availableQuerySchema>) {
  return this.books.available(query.limit);
}
```

### `ValidationException`

| Champ          | Valeur                                                         |
| -------------- | -------------------------------------------------------------- |
| Catégorie      | `common`                                                       |
| Point d'entrée | `@etiennea20/adr-nest`                                         |
| Statut         | stable                                                         |
| Depuis         | 0.2.0                                                          |
| Source         | `src/common/validation-exception/validation-exception.ts`      |
| Tests          | `src/common/validation-exception/validation-exception.test.ts` |

**Signature**

```ts
class ValidationException extends ApiException {
  constructor(issues: readonly IStandardSchemaIssue[], options?: IValidationExceptionOptions);
}
```

**Description** : erreur de validation au format d'erreur d'API : 400 (ou 422), code `VALIDATION_FAILED` par défaut, titre « Données invalides », `errors` = un problème par champ (`path` en notation pointée, `message`, `code` : `params.code` applicatif s'il existe, sinon le code zod). Levée par `SchemaValidationPipe` et `apiValidationExceptionFactory` ; à lever soi-même après une validation manuelle.

**Paramètres**

- `issues` : problèmes renvoyés par un schéma Standard Schema.
- `options` : code, titre et statut (`IValidationExceptionOptions`).

**Retour** : sans objet (classe).

**Erreurs** : aucune.

**Exemple**

```ts
import { ValidationException } from "@etiennea20/adr-nest";

const result = await createBookSchema["~standard"].validate(input);
if (result.issues) throw new ValidationException(result.issues);
```

### `IValidationExceptionOptions`

| Champ          | Valeur                                                         |
| -------------- | -------------------------------------------------------------- |
| Catégorie      | `common`                                                       |
| Point d'entrée | `@etiennea20/adr-nest`                                         |
| Statut         | stable                                                         |
| Depuis         | 0.2.0                                                          |
| Source         | `src/common/validation-exception/validation-exception.ts`      |
| Tests          | `src/common/validation-exception/validation-exception.test.ts` |

**Signature**

```ts
interface IValidationExceptionOptions {
  readonly code?: string | undefined;
  readonly title?: string | undefined;
  readonly status?: 400 | 422 | undefined;
}
```

**Description** : options d'une `ValidationException` (et de `SchemaValidationPipe`, `ValidBody`, `ValidQuery`) : code (`VALIDATION_FAILED`), titre (« Données invalides ») et statut (400) de la réponse.

**Exemple**

```ts
import type { IValidationExceptionOptions } from "@etiennea20/adr-nest";

const options: IValidationExceptionOptions = {
  code: "INVALID_QUERY",
  title: "Paramètres de liste invalides",
};
```

### `apiValidationExceptionFactory`

| Champ          | Valeur                                                         |
| -------------- | -------------------------------------------------------------- |
| Catégorie      | `common`                                                       |
| Point d'entrée | `@etiennea20/adr-nest`                                         |
| Statut         | stable                                                         |
| Depuis         | 0.2.0                                                          |
| Source         | `src/common/validation-exception/validation-exception.ts`      |
| Tests          | `src/common/validation-exception/validation-exception.test.ts` |

**Signature**

```ts
function apiValidationExceptionFactory(
  issues: readonly IStandardSchemaIssue[],
): ValidationException;
```

**Description** : fabrique d'exception pour le `StandardSchemaValidationPipe` natif de NestJS 12 (`@Body({ schema })`) : ses erreurs suivent alors le format d'erreur d'API. Sous NestJS 11, utiliser `SchemaValidationPipe`, `ValidBody` ou `ValidQuery`.

**Paramètres**

- `issues` : problèmes renvoyés par le schéma.

**Retour** : une `ValidationException` (400, `VALIDATION_FAILED`).

**Erreurs** : aucune.

**Exemple**

```ts
import { apiValidationExceptionFactory } from "@etiennea20/adr-nest";
import { StandardSchemaValidationPipe } from "@nestjs/common";
import { APP_PIPE } from "@nestjs/core";

const providers = [
  {
    provide: APP_PIPE,
    useValue: new StandardSchemaValidationPipe({ exceptionFactory: apiValidationExceptionFactory }),
  },
];
```

### `ApiException`

| Champ          | Valeur                                           |
| -------------- | ------------------------------------------------ |
| Catégorie      | `common`                                         |
| Point d'entrée | `@etiennea20/adr-nest`                           |
| Statut         | stable                                           |
| Depuis         | 0.2.0                                            |
| Source         | `src/common/api-exception/api-exception.ts`      |
| Tests          | `src/common/api-exception/api-exception.test.ts` |

**Signature**

```ts
class ApiException extends HttpException {
  constructor(options: IApiExceptionOptions);
  readonly code: string;
  getResponse(): IApiError;
}
```

**Description** : exception HTTP dont la réponse suit le format d'erreur d'API (RFC 9457 + `code`). À lever pour une erreur métier que le front reconnaît par son code, plutôt qu'une `HttpException` au corps libre. `message` vaut `detail`, sinon `title` ; `cause` est conservée pour les journaux, jamais envoyée. Sans filtre dédié, NestJS renvoie déjà ce corps avec le bon statut.

**Paramètres**

- `options` : statut, code, titre, détail, problèmes par champ, type, cause (`IApiExceptionOptions`).

**Retour** : sans objet (classe) ; `getResponse()` renvoie une copie du corps.

**Erreurs** : aucune.

**Exemple**

```ts
import { ApiException } from "@etiennea20/adr-nest";

throw new ApiException({
  status: 409,
  code: "LOAN_LIMIT_REACHED",
  title: "Nombre maximal d'emprunts atteint",
  detail: "Un adhérent ne peut pas emprunter plus de 5 livres.",
});
```

### `IApiExceptionOptions`

| Champ          | Valeur                                           |
| -------------- | ------------------------------------------------ |
| Catégorie      | `common`                                         |
| Point d'entrée | `@etiennea20/adr-nest`                           |
| Statut         | stable                                           |
| Depuis         | 0.2.0                                            |
| Source         | `src/common/api-exception/api-exception.ts`      |
| Tests          | `src/common/api-exception/api-exception.test.ts` |

**Signature**

```ts
interface IApiExceptionOptions {
  readonly status: number;
  readonly code: string;
  readonly title: string;
  readonly detail?: string | undefined;
  readonly errors?: readonly IApiErrorIssue[] | undefined;
  readonly type?: string | undefined;
  readonly cause?: unknown;
}
```

**Description** : description d'une erreur d'API passée à `ApiException` : statut, code stable, titre (français), détail, problèmes par champ, URI du type (`about:blank` par défaut) et erreur d'origine.

**Exemple**

```ts
import type { IApiExceptionOptions } from "@etiennea20/adr-nest";

const options: IApiExceptionOptions = {
  status: 409,
  code: "LOAN_LIMIT_REACHED",
  title: "Trop d'emprunts",
};
```

### `IApiError`

| Champ          | Valeur                                   |
| -------------- | ---------------------------------------- |
| Catégorie      | `common`                                 |
| Point d'entrée | `@etiennea20/adr-nest`                   |
| Statut         | stable                                   |
| Depuis         | 0.2.0                                    |
| Source         | `src/common/api-error/api-error.ts`      |
| Tests          | `src/common/api-error/api-error.test.ts` |

**Signature**

```ts
interface IApiError {
  type: string;
  title: string;
  status: number;
  detail?: string | undefined;
  instance?: string | undefined;
  code: string;
  errors?: IApiErrorIssue[] | undefined;
  requestId?: string | undefined;
}
```

**Description** : corps d'une réponse d'erreur d'API : RFC 9457 étendue par `code`, `errors` et `requestId`. Même forme que `ApiError` de `@etiennea20/adr-misc/contract` (vérifié par un test), que le front relit avec `apiErrorSchema`.

**Exemple**

```ts
import type { IApiError } from "@etiennea20/adr-nest";

const body: IApiError = {
  type: "about:blank",
  title: "Accès refusé",
  status: 403,
  code: "FORBIDDEN",
};
```

### `IApiErrorIssue`

| Champ          | Valeur                                   |
| -------------- | ---------------------------------------- |
| Catégorie      | `common`                                 |
| Point d'entrée | `@etiennea20/adr-nest`                   |
| Statut         | stable                                   |
| Depuis         | 0.2.0                                    |
| Source         | `src/common/api-error/api-error.ts`      |
| Tests          | `src/common/api-error/api-error.test.ts` |

**Signature**

```ts
interface IApiErrorIssue {
  path: string;
  message: string;
  code?: string | undefined;
}
```

**Description** : problème précis d'une erreur d'API : chemin du champ en notation pointée (`"items.0.title"`, `""` pour la racine), message, code facultatif. Même forme que `ApiErrorIssue` d'adr-misc.

**Exemple**

```ts
import type { IApiErrorIssue } from "@etiennea20/adr-nest";

const issue: IApiErrorIssue = {
  path: "author.name",
  message: "Champ requis",
  code: "invalid_type",
};
```

### `EApiErrorCode`

| Champ          | Valeur                                   |
| -------------- | ---------------------------------------- |
| Catégorie      | `common`                                 |
| Point d'entrée | `@etiennea20/adr-nest`                   |
| Statut         | stable                                   |
| Depuis         | 0.2.0                                    |
| Source         | `src/common/api-error/api-error.ts`      |
| Tests          | `src/common/api-error/api-error.test.ts` |

**Signature**

```ts
const EApiErrorCode = {
  BAD_REQUEST: "BAD_REQUEST",
  VALIDATION_FAILED: "VALIDATION_FAILED",
  INVALID_QUERY: "INVALID_QUERY",
  QUERY_LIMIT_EXCEEDED: "QUERY_LIMIT_EXCEEDED",
  UNAUTHENTICATED: "UNAUTHENTICATED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  CONFLICT: "CONFLICT",
  EXPORT_LIMIT_EXCEEDED: "EXPORT_LIMIT_EXCEEDED",
  INTERNAL_ERROR: "INTERNAL_ERROR",
} as const;
type EApiErrorCode = (typeof EApiErrorCode)[keyof typeof EApiErrorCode];
```

**Description** : codes d'erreur stables du format d'erreur d'API, identiques à ceux de `@etiennea20/adr-misc/contract` (vérifié par un test) : reproduits pour que l'entrée principale ne dépende ni d'adr-misc ni de zod. Statuts usuels : 400 (`BAD_REQUEST`, `VALIDATION_FAILED`, `INVALID_QUERY`, `QUERY_LIMIT_EXCEEDED`, `EXPORT_LIMIT_EXCEEDED`), 401, 403, 404, 409, 500.

**Exemple**

```ts
import { ApiException, EApiErrorCode } from "@etiennea20/adr-nest";

throw new ApiException({ status: 409, code: EApiErrorCode.CONFLICT, title: "Livre déjà emprunté" });
```

### `API_ERROR_CONTENT_TYPE`

| Champ          | Valeur                                   |
| -------------- | ---------------------------------------- |
| Catégorie      | `common`                                 |
| Point d'entrée | `@etiennea20/adr-nest`                   |
| Statut         | stable                                   |
| Depuis         | 0.2.0                                    |
| Source         | `src/common/api-error/api-error.ts`      |
| Tests          | `src/common/api-error/api-error.test.ts` |

**Signature**

```ts
const API_ERROR_CONTENT_TYPE: "application/problem+json";
```

**Description** : type de média d'une réponse d'erreur RFC 9457.

**Exemple**

```ts
import { API_ERROR_CONTENT_TYPE } from "@etiennea20/adr-nest";

response.type(API_ERROR_CONTENT_TYPE);
```

### `IStandardSchema`

| Champ          | Valeur                                               |
| -------------- | ---------------------------------------------------- |
| Catégorie      | `common`                                             |
| Point d'entrée | `@etiennea20/adr-nest`                               |
| Statut         | stable                                               |
| Depuis         | 0.2.0                                                |
| Source         | `src/common/standard-schema/standard-schema.ts`      |
| Tests          | `src/common/standard-schema/standard-schema.test.ts` |

**Signature**

```ts
interface IStandardSchema<TInput = unknown, TOutput = TInput> {
  readonly "~standard": {
    readonly version: 1;
    readonly vendor: string;
    readonly validate: (
      value: unknown,
    ) => StandardSchemaResult<TOutput> | Promise<StandardSchemaResult<TOutput>>;
    readonly types?: { readonly input: TInput; readonly output: TOutput } | undefined;
  };
}
```

**Description** : schéma compatible Standard Schema v1 (https://standardschema.dev), satisfait sans adaptateur par tout schéma zod 4 (et Valibot, ArkType…). Copie minimale de la spécification, pour ne pas dépendre de `@standard-schema/spec`.

**Exemple**

```ts
import type { IStandardSchema } from "@etiennea20/adr-nest";
import { z } from "zod";

const schema: IStandardSchema<unknown, { title: string }> = z.object({ title: z.string() });
```

### `IStandardSchemaIssue`

| Champ          | Valeur                                               |
| -------------- | ---------------------------------------------------- |
| Catégorie      | `common`                                             |
| Point d'entrée | `@etiennea20/adr-nest`                               |
| Statut         | stable                                               |
| Depuis         | 0.2.0                                                |
| Source         | `src/common/standard-schema/standard-schema.ts`      |
| Tests          | `src/common/standard-schema/standard-schema.test.ts` |

**Signature**

```ts
interface IStandardSchemaIssue {
  readonly message: string;
  readonly path?: readonly (PropertyKey | { readonly key: PropertyKey })[] | undefined;
}
```

**Description** : problème renvoyé par un schéma Standard Schema : message et chemin de la valeur fautive.

**Exemple**

```ts
import type { IStandardSchemaIssue } from "@etiennea20/adr-nest";

const issue: IStandardSchemaIssue = { message: "Champ requis", path: ["author", "name"] };
```

### `StandardSchemaResult`

| Champ          | Valeur                                               |
| -------------- | ---------------------------------------------------- |
| Catégorie      | `common`                                             |
| Point d'entrée | `@etiennea20/adr-nest`                               |
| Statut         | stable                                               |
| Depuis         | 0.2.0                                                |
| Source         | `src/common/standard-schema/standard-schema.ts`      |
| Tests          | `src/common/standard-schema/standard-schema.test.ts` |

**Signature**

```ts
type StandardSchemaResult<T> =
  | { readonly value: T; readonly issues?: undefined }
  | { readonly issues: readonly IStandardSchemaIssue[] };
```

**Description** : résultat de la validation d'un schéma Standard Schema : la valeur validée, ou les problèmes.

**Exemple**

```ts
import type { StandardSchemaResult } from "@etiennea20/adr-nest";

const result: StandardSchemaResult<string> = { value: "Dune" };
```

### `InferSchemaOutput`

| Champ          | Valeur                                               |
| -------------- | ---------------------------------------------------- |
| Catégorie      | `common`                                             |
| Point d'entrée | `@etiennea20/adr-nest`                               |
| Statut         | stable                                               |
| Depuis         | 0.2.0                                                |
| Source         | `src/common/standard-schema/standard-schema.ts`      |
| Tests          | `src/common/standard-schema/standard-schema.test.ts` |

**Signature**

```ts
type InferSchemaOutput<S extends IStandardSchema> = NonNullable<S["~standard"]["types"]>["output"];
```

**Description** : type de sortie d'un schéma Standard Schema (valeur produite après validation).

**Exemple**

```ts
import type { InferSchemaOutput } from "@etiennea20/adr-nest";

type CreateBookInput = InferSchemaOutput<typeof createBookSchema>;
```

## filtering

Sous-chemin `@etiennea20/adr-nest/filtering` (peerDependencies optionnelles `@etiennea20/adr-misc` ≥ 0.3 et `zod` ≥ 4) : requêtes de liste validées par le contrat partagé avec le front (`defineListQuery`) et converties en critères neutres vis-à-vis de l'ORM. Jamais réexporté par l'entrée principale.

### `ListQuery`

| Champ          | Valeur                                        |
| -------------- | --------------------------------------------- |
| Catégorie      | `filtering`                                   |
| Point d'entrée | `@etiennea20/adr-nest/filtering`              |
| Statut         | stable                                        |
| Depuis         | 0.2.0                                         |
| Source         | `src/filtering/list-query/list-query.ts`      |
| Tests          | `src/filtering/list-query/list-query.test.ts` |

**Signature**

```ts
function ListQuery<T extends FieldDefinitions>(
  definition: IListQueryDefinition<T>,
  options?: IListQueryParamOptions<T>,
): ParameterDecorator;
```

**Description** : décorateur de paramètre : la requête de liste (filtre, `q`, tri, pagination, sélection) validée par le contrat et convertie en `IListCriteria`. Source `"query"` par défaut (un paramètre d'URL par clé, en JSON, convention TanStack Router) ou `"body"` (`POST …/search`). Colonnes vérifiées dès la déclaration. Requête invalide : la route n'est pas appelée, 400 `INVALID_QUERY` ou `QUERY_LIMIT_EXCEEDED` au format d'erreur d'API.

**Paramètres**

- `definition` : contrat de liste (`defineListQuery`), partagé avec le front.
- `options` : `source` et `columns` (chemin de colonne par champ public, `authorName` → `author.name`).

**Retour** : un décorateur de paramètre qui fournit les critères.

**Erreurs** : `ListQueryConfigError` à la déclaration si `columns` est invalide ; `ValidationException` à l'exécution si la requête est invalide.

**Exemple**

```ts
import { type IListCriteria, ListQuery, applyCriteriaInMemory } from "@etiennea20/adr-nest/filtering";

@Get()
list(@ListQuery(bookListQuery, { columns: { authorName: "author.name" } }) criteria: IListCriteria) {
  return this.books.findPage(criteria);
}
```

### `IListQueryParamOptions`

| Champ          | Valeur                                                    |
| -------------- | --------------------------------------------------------- |
| Catégorie      | `filtering`                                               |
| Point d'entrée | `@etiennea20/adr-nest/filtering`                          |
| Statut         | stable                                                    |
| Depuis         | 0.2.0                                                     |
| Source         | `src/filtering/parse-list-query/parse-list-query.ts`      |
| Tests          | `src/filtering/parse-list-query/parse-list-query.test.ts` |

**Signature**

```ts
interface IListQueryParamOptions<
  T extends FieldDefinitions = FieldDefinitions,
> extends IListCriteriaOptions<T> {
  readonly source?: "query" | "body";
}
```

**Description** : options de `ListQuery` et `parseListQuery` : forme de l'entrée (`"query"` par défaut, ou `"body"`) et chemins de colonnes.

**Exemple**

```ts
import type { IListQueryParamOptions } from "@etiennea20/adr-nest/filtering";

const options: IListQueryParamOptions = { source: "body", columns: { authorName: "author.name" } };
```

### `parseListQuery`

| Champ          | Valeur                                                    |
| -------------- | --------------------------------------------------------- |
| Catégorie      | `filtering`                                               |
| Point d'entrée | `@etiennea20/adr-nest/filtering`                          |
| Statut         | stable                                                    |
| Depuis         | 0.2.0                                                     |
| Source         | `src/filtering/parse-list-query/parse-list-query.ts`      |
| Tests          | `src/filtering/parse-list-query/parse-list-query.test.ts` |

**Signature**

```ts
function parseListQuery<T extends FieldDefinitions>(
  definition: IListQueryDefinition<T>,
  input: unknown,
  options?: IListQueryParamOptions<T>,
): IListCriteria;
```

**Description** : valide une requête de liste reçue du client et la convertit en critères (ce que fait `ListQuery`). À utiliser hors d'une route HTTP (file de messages, WebSocket).

**Paramètres**

- `definition` : contrat de liste.
- `input` : `req.query` (source `"query"`) ou `req.body` (source `"body"`).
- `options` : source et colonnes.

**Retour** : les critères de liste.

**Erreurs** : `ValidationException` 400 `QUERY_LIMIT_EXCEEDED` (limite du contrat dépassée) ou `INVALID_QUERY` (requête invalide), détail par champ ; `ListQueryConfigError` si `columns` est invalide.

**Exemple**

```ts
import { parseListQuery } from "@etiennea20/adr-nest/filtering";

const criteria = parseListQuery(bookListQuery, message.payload, { source: "body" });
```

### `toListCriteria`

| Champ          | Valeur                                                    |
| -------------- | --------------------------------------------------------- |
| Catégorie      | `filtering`                                               |
| Point d'entrée | `@etiennea20/adr-nest/filtering`                          |
| Statut         | stable                                                    |
| Depuis         | 0.2.0                                                     |
| Source         | `src/filtering/to-list-criteria/to-list-criteria.ts`      |
| Tests          | `src/filtering/to-list-criteria/to-list-criteria.test.ts` |

**Signature**

```ts
function toListCriteria<T extends FieldDefinitions>(
  definition: IListQueryDefinition<T>,
  query: IListQuery<T>,
  options?: IListCriteriaOptions<T>,
): IListCriteria;
```

**Description** : convertit une requête de liste **déjà validée** en critères : noms publics → chemins de colonnes, dates du contrat → `Date`, `q` → groupe `or` de `contains` insensibles à la casse sur les champs `search: true` (combiné au filtre par `and`), `skip`, `take = pageSize + 1`.

**Paramètres**

- `definition` : contrat de liste.
- `query` : requête validée par `definition.schema` ou `searchParamsSchema`.
- `options` : colonnes.

**Retour** : les critères de liste.

**Erreurs** : `ListQueryConfigError` si `columns` cite un champ absent du contrat ou un chemin invalide.

**Exemple**

```ts
import { toListCriteria } from "@etiennea20/adr-nest/filtering";

const criteria = toListCriteria(bookListQuery, bookListQuery.schema.parse(input), {
  columns: { authorName: "author.name" },
});
```

### `IListCriteriaOptions`

| Champ          | Valeur                                                    |
| -------------- | --------------------------------------------------------- |
| Catégorie      | `filtering`                                               |
| Point d'entrée | `@etiennea20/adr-nest/filtering`                          |
| Statut         | stable                                                    |
| Depuis         | 0.2.0                                                     |
| Source         | `src/filtering/to-list-criteria/to-list-criteria.ts`      |
| Tests          | `src/filtering/to-list-criteria/to-list-criteria.test.ts` |

**Signature**

```ts
interface IListCriteriaOptions<T extends FieldDefinitions = FieldDefinitions> {
  readonly columns?: Partial<Record<keyof T & string, string>>;
}
```

**Description** : options de conversion : chemin de colonne de chaque champ public, déclaré côté serveur (par défaut le nom du champ). Chemins : segments identifiants séparés par des points, sans `__proto__`.

**Exemple**

```ts
import type { IListCriteriaOptions } from "@etiennea20/adr-nest/filtering";

const options: IListCriteriaOptions = { columns: { authorName: "author.name" } };
```

### `applyCriteriaInMemory`

| Champ          | Valeur                                                                    |
| -------------- | ------------------------------------------------------------------------- |
| Catégorie      | `filtering`                                                               |
| Point d'entrée | `@etiennea20/adr-nest/filtering`                                          |
| Statut         | stable                                                                    |
| Depuis         | 0.2.0                                                                     |
| Source         | `src/filtering/apply-criteria-in-memory/apply-criteria-in-memory.ts`      |
| Tests          | `src/filtering/apply-criteria-in-memory/apply-criteria-in-memory.test.ts` |

**Signature**

```ts
function applyCriteriaInMemory<T>(items: readonly T[], criteria: IListCriteria): IPage<T>;
```

**Description** : applique des critères à un tableau en mémoire : filtre, tri (valeurs absentes en dernier, texte en français), pagination et total si `withTotal`. Même sémantique que les adaptateurs (texte insensible à la casse par défaut, dates comparées en tant que dates, y compris stockées en texte ISO). `select` n'est pas appliqué. Pour les petites listes, les démonstrations et les tests.

**Paramètres**

- `items` : éléments (non modifiés).
- `criteria` : critères de la requête.

**Retour** : la page de résultats (`IPage` d'adr-misc).

**Erreurs** : aucune.

**Exemple**

```ts
import { applyCriteriaInMemory } from "@etiennea20/adr-nest/filtering";

return applyCriteriaInMemory(this.repository.findAll(), criteria);
```

### `toPage`

| Champ          | Valeur                                  |
| -------------- | --------------------------------------- |
| Catégorie      | `filtering`                             |
| Point d'entrée | `@etiennea20/adr-nest/filtering`        |
| Statut         | stable                                  |
| Depuis         | 0.2.0                                   |
| Source         | `src/filtering/to-page/to-page.ts`      |
| Tests          | `src/filtering/to-page/to-page.test.ts` |

**Signature**

```ts
function toPage<T>(
  rows: readonly T[],
  criteria: Pick<IListCriteria, "page" | "pageSize">,
  total?: number,
): IPage<T>;
```

**Description** : construit la page de résultats (`IPage`, format partagé avec le front) à partir des lignes lues avec `criteria.take` : la ligne en plus est retirée et donne `hasNextPage` ; `total` et `pageCount` seulement si `total` est fourni.

**Paramètres**

- `rows` : lignes lues (au plus `criteria.take`).
- `criteria` : page et taille de page.
- `total` : nombre total, si le comptage a été fait.

**Retour** : la page de résultats.

**Erreurs** : aucune.

**Exemple**

```ts
import { toPage } from "@etiennea20/adr-nest/filtering";

const [rows, total] = await Promise.all([
  prisma.book.findMany(args),
  criteria.withTotal ? prisma.book.count({ where: args.where }) : undefined,
]);
return toPage(rows, criteria, total);
```

### `andCriteria`

| Champ          | Valeur                                            |
| -------------- | ------------------------------------------------- |
| Catégorie      | `filtering`                                       |
| Point d'entrée | `@etiennea20/adr-nest/filtering`                  |
| Statut         | stable                                            |
| Depuis         | 0.2.0                                             |
| Source         | `src/filtering/and-criteria/and-criteria.ts`      |
| Tests          | `src/filtering/and-criteria/and-criteria.test.ts` |

**Signature**

```ts
function andCriteria(criteria: IListCriteria, condition: CriteriaNode): IListCriteria;
```

**Description** : ajoute une condition **de confiance** du serveur (périmètre de droits, état imposé) aux critères d'une requête client, par `and`. La condition n'est pas soumise à la liste blanche et utilise des chemins de colonnes.

**Paramètres**

- `criteria` : critères de la requête client.
- `condition` : condition imposée par le serveur.

**Retour** : de nouveaux critères (les originaux ne sont pas modifiés).

**Erreurs** : aucune.

**Exemple**

```ts
import { andCriteria } from "@etiennea20/adr-nest/filtering";

const scoped = andCriteria(criteria, {
  path: "ownerId",
  op: "eq",
  value: member.id,
  caseSensitive: false,
});
```

### `ListQueryConfigError`

| Champ          | Valeur                                                                  |
| -------------- | ----------------------------------------------------------------------- |
| Catégorie      | `filtering`                                                             |
| Point d'entrée | `@etiennea20/adr-nest/filtering`                                        |
| Statut         | stable                                                                  |
| Depuis         | 0.2.0                                                                   |
| Source         | `src/filtering/list-query-config-error/list-query-config-error.ts`      |
| Tests          | `src/filtering/list-query-config-error/list-query-config-error.test.ts` |

**Signature**

```ts
class ListQueryConfigError extends Error {
  readonly name: "ListQueryConfigError";
}
```

**Description** : erreur de configuration côté serveur (colonne pour un champ absent du contrat, chemin invalide), levée au démarrage ou au premier appel, jamais à cause d'une requête client.

**Exemple**

```ts
import { ListQuery } from "@etiennea20/adr-nest/filtering";

// Lève ListQueryConfigError au chargement du contrôleur : « isbn » n'est pas dans le contrat.
ListQuery(bookListQuery, { columns: { isbn: "isbn13" } });
```

### `IListCriteria`

| Champ          | Valeur                                              |
| -------------- | --------------------------------------------------- |
| Catégorie      | `filtering`                                         |
| Point d'entrée | `@etiennea20/adr-nest/filtering`                    |
| Statut         | stable                                              |
| Depuis         | 0.2.0                                               |
| Source         | `src/filtering/list-criteria/list-criteria.ts`      |
| Tests          | `src/filtering/list-criteria/list-criteria.test.ts` |

**Signature**

```ts
interface IListCriteria {
  readonly where?: CriteriaNode | undefined;
  readonly orderBy: readonly ICriteriaOrder[];
  readonly select?: readonly string[] | undefined;
  readonly skip: number;
  readonly take: number;
  readonly page: number;
  readonly pageSize: number;
  readonly withTotal: boolean;
}
```

**Description** : critères de liste, neutres vis-à-vis de l'ORM : filtre et recherche combinés (`where`), tri, colonnes sélectionnées, `skip`, `take` (`pageSize + 1`, la ligne en plus indique la page suivante), page, taille, comptage. Uniquement des chemins issus de la liste blanche du serveur et des valeurs validées.

**Exemple**

```ts
import type { IListCriteria } from "@etiennea20/adr-nest/filtering";

function offset(criteria: IListCriteria): number {
  return criteria.skip;
}
```

### `CriteriaNode`

| Champ          | Valeur                                              |
| -------------- | --------------------------------------------------- |
| Catégorie      | `filtering`                                         |
| Point d'entrée | `@etiennea20/adr-nest/filtering`                    |
| Statut         | stable                                              |
| Depuis         | 0.2.0                                               |
| Source         | `src/filtering/list-criteria/list-criteria.ts`      |
| Tests          | `src/filtering/list-criteria/list-criteria.test.ts` |

**Signature**

```ts
type CriteriaNode =
  | ICriteriaCondition
  | { readonly and: readonly CriteriaNode[] }
  | { readonly or: readonly CriteriaNode[] }
  | { readonly not: CriteriaNode };
```

**Description** : nœud de l'arbre de critères : une condition ou un groupe `and`, `or`, `not`.

**Exemple**

```ts
import type { CriteriaNode } from "@etiennea20/adr-nest/filtering";

const node: CriteriaNode = { or: [conditionA, { not: conditionB }] };
```

### `ICriteriaCondition`

| Champ          | Valeur                                              |
| -------------- | --------------------------------------------------- |
| Catégorie      | `filtering`                                         |
| Point d'entrée | `@etiennea20/adr-nest/filtering`                    |
| Statut         | stable                                              |
| Depuis         | 0.2.0                                               |
| Source         | `src/filtering/list-criteria/list-criteria.ts`      |
| Tests          | `src/filtering/list-criteria/list-criteria.test.ts` |

**Signature**

```ts
interface ICriteriaCondition {
  readonly path: string;
  readonly op: EFilterOperator;
  readonly value: CriteriaValue;
  readonly caseSensitive: boolean;
}
```

**Description** : condition de critères : chemin de colonne (serveur), opérateur du contrat, valeur convertie (dates en `Date`), respect de la casse (opérateurs de texte, `false` par défaut).

**Exemple**

```ts
import type { ICriteriaCondition } from "@etiennea20/adr-nest/filtering";

const condition: ICriteriaCondition = {
  path: "author.name",
  op: "contains",
  value: "zola",
  caseSensitive: false,
};
```

### `ICriteriaOrder`

| Champ          | Valeur                                              |
| -------------- | --------------------------------------------------- |
| Catégorie      | `filtering`                                         |
| Point d'entrée | `@etiennea20/adr-nest/filtering`                    |
| Statut         | stable                                              |
| Depuis         | 0.2.0                                               |
| Source         | `src/filtering/list-criteria/list-criteria.ts`      |
| Tests          | `src/filtering/list-criteria/list-criteria.test.ts` |

**Signature**

```ts
interface ICriteriaOrder {
  readonly path: string;
  readonly direction: ISortItem["direction"];
}
```

**Description** : critère de tri : chemin de colonne et sens (`asc` ou `desc`).

**Exemple**

```ts
import type { ICriteriaOrder } from "@etiennea20/adr-nest/filtering";

const order: ICriteriaOrder = { path: "publishedAt", direction: "desc" };
```

### `CriteriaValue`

| Champ          | Valeur                                              |
| -------------- | --------------------------------------------------- |
| Catégorie      | `filtering`                                         |
| Point d'entrée | `@etiennea20/adr-nest/filtering`                    |
| Statut         | stable                                              |
| Depuis         | 0.2.0                                               |
| Source         | `src/filtering/list-criteria/list-criteria.ts`      |
| Tests          | `src/filtering/list-criteria/list-criteria.test.ts` |

**Signature**

```ts
type CriteriaValue =
  string | number | boolean | Date | readonly (string | number | boolean | Date)[];
```

**Description** : valeur d'une condition : simple (dates converties en `Date`), couple `[min, max]` ou liste.

**Exemple**

```ts
import type { CriteriaValue } from "@etiennea20/adr-nest/filtering";

const value: CriteriaValue = [new Date("2020-01-01"), new Date("2020-12-31")];
```

## prisma

Sous-chemin `@etiennea20/adr-nest/prisma` : adaptateur des critères de liste (`filtering`) vers les arguments de Prisma. Objets simples : aucune dépendance à `@prisma/client`.

### `toPrismaFindArgs`

| Champ          | Valeur                                                       |
| -------------- | ------------------------------------------------------------ |
| Catégorie      | `prisma`                                                     |
| Point d'entrée | `@etiennea20/adr-nest/prisma`                                |
| Statut         | stable                                                       |
| Depuis         | 0.2.0                                                        |
| Source         | `src/prisma/to-prisma-find-args/to-prisma-find-args.ts`      |
| Tests          | `src/prisma/to-prisma-find-args/to-prisma-find-args.test.ts` |

**Signature**

```ts
function toPrismaFindArgs(criteria: IListCriteria): IPrismaFindArgs;
```

**Description** : convertit des critères de liste en arguments `findMany` de Prisma : `where`, `orderBy`, `select` (relations en `select` imbriqué), `skip`, `take`. Chemins de relation (`author.name`) en objets imbriqués : relations « vers un » uniquement. Texte insensible à la casse (`mode: "insensitive"`, PostgreSQL) sauf `caseSensitive`. Le `where` sert aussi à `count`.

**Paramètres**

- `criteria` : critères de liste.

**Retour** : les arguments `findMany` (à passer au client généré avec une assertion de type).

**Erreurs** : aucune.

**Exemple**

```ts
import { toPage } from "@etiennea20/adr-nest/filtering";
import { toPrismaFindArgs } from "@etiennea20/adr-nest/prisma";

const args = toPrismaFindArgs(criteria);
const [rows, total] = await Promise.all([
  prisma.book.findMany(args as Prisma.BookFindManyArgs),
  criteria.withTotal
    ? prisma.book.count({ where: args.where as Prisma.BookWhereInput })
    : undefined,
]);
return toPage(rows, criteria, total);
```

### `toPrismaWhere`

| Champ          | Valeur                                                       |
| -------------- | ------------------------------------------------------------ |
| Catégorie      | `prisma`                                                     |
| Point d'entrée | `@etiennea20/adr-nest/prisma`                                |
| Statut         | stable                                                       |
| Depuis         | 0.2.0                                                        |
| Source         | `src/prisma/to-prisma-find-args/to-prisma-find-args.ts`      |
| Tests          | `src/prisma/to-prisma-find-args/to-prisma-find-args.test.ts` |

**Signature**

```ts
function toPrismaWhere(node: CriteriaNode): Record<string, unknown>;
```

**Description** : convertit un arbre de critères en filtre `where` de Prisma : `AND`, `OR`, `NOT` ; `eq` → `equals`, `ne` → `not`, `nin` → `notIn`, `between` → `gte` + `lte`, `isNull` → `equals: null` / `not: null`.

**Paramètres**

- `node` : arbre de critères.

**Retour** : le filtre Prisma.

**Erreurs** : aucune.

**Exemple**

```ts
import { toPrismaWhere } from "@etiennea20/adr-nest/prisma";

toPrismaWhere({ path: "author.name", op: "contains", value: "zola", caseSensitive: false });
// { author: { name: { contains: "zola", mode: "insensitive" } } }
```

### `IPrismaFindArgs`

| Champ          | Valeur                                                       |
| -------------- | ------------------------------------------------------------ |
| Catégorie      | `prisma`                                                     |
| Point d'entrée | `@etiennea20/adr-nest/prisma`                                |
| Statut         | stable                                                       |
| Depuis         | 0.2.0                                                        |
| Source         | `src/prisma/to-prisma-find-args/to-prisma-find-args.ts`      |
| Tests          | `src/prisma/to-prisma-find-args/to-prisma-find-args.test.ts` |

**Signature**

```ts
interface IPrismaFindArgs {
  where?: Record<string, unknown> | undefined;
  orderBy: Record<string, unknown>[];
  select?: Record<string, unknown> | undefined;
  skip: number;
  take: number;
}
```

**Description** : arguments `findMany` produits par `toPrismaFindArgs` : objets simples, à passer au client généré avec une assertion vers ses types (`as Prisma.BookFindManyArgs`).

**Exemple**

```ts
import type { IPrismaFindArgs } from "@etiennea20/adr-nest/prisma";

const args: IPrismaFindArgs = toPrismaFindArgs(criteria);
```

## rights

### `Public`

| Champ          | Valeur                             |
| -------------- | ---------------------------------- |
| Catégorie      | `rights`                           |
| Point d'entrée | `@etiennea20/adr-nest`             |
| Statut         | stable                             |
| Depuis         | 0.1.0                              |
| Source         | `src/rights/public/public.ts`      |
| Tests          | `src/rights/public/public.test.ts` |

**Signature**

```ts
function Public(): CustomDecorator<"adr:isPublic">;
```

**Description** : décorateur de méthode ou de classe qui marque une route (ou toutes les routes
d'un contrôleur) comme publique en posant la métadonnée [`IS_PUBLIC_KEY`](#is_public_key).
Ne fait rien seul : un guard d'authentification doit lire la métadonnée.

**Paramètres** : aucun.

**Retour** : un décorateur NestJS (`SetMetadata(IS_PUBLIC_KEY, true)`).

**Erreurs** : aucune.

**Exemple**

```ts
import { Controller, Get } from "@nestjs/common";
import { Public } from "@etiennea20/adr-nest";

@Controller("health")
export class HealthController {
  @Public()
  @Get()
  check() {
    return { status: "ok" };
  }
}
```

### `IS_PUBLIC_KEY`

| Champ          | Valeur                             |
| -------------- | ---------------------------------- |
| Catégorie      | `rights`                           |
| Point d'entrée | `@etiennea20/adr-nest`             |
| Statut         | stable                             |
| Depuis         | 0.1.0                              |
| Source         | `src/rights/public/public.ts`      |
| Tests          | `src/rights/public/public.test.ts` |

**Signature**

```ts
const IS_PUBLIC_KEY: "adr:isPublic";
```

**Description** : clé de métadonnée posée par [`Public`](#public), à lire dans un guard avec le
`Reflector` de NestJS.

**Paramètres** : sans objet (constante).

**Retour** : sans objet (constante).

**Erreurs** : aucune.

**Exemple**

```ts
import { Injectable, type CanActivate, type ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_KEY } from "@etiennea20/adr-nest";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    return isPublic || Boolean(context.switchToHttp().getRequest().user);
  }
}
```
