---
name: adr-nest
description: "À utiliser pour développer ou utiliser @etiennea20/adr-nest : utilitaires backend NestJS (décorateurs, guards, pipes, interceptors, services), gestion des droits et des routes publiques, filtrage avancé des requêtes, export Excel et JSON. Donne l'inventaire des éléments publics, leur signature, leurs erreurs et un exemple d'utilisation dans un module NestJS."
metadata:
  generated-by: adr-package/install-skills
  source: packages/adr-nest/SKILLS.md
---

<!-- Généré par `pnpm run install:skills` à partir de packages/adr-nest/SKILLS.md, ne pas modifier à la main. -->

# @etiennea20/adr-nest

Utilitaires pour applications NestJS (11 ou 12), compilés en CommonJS avec les métadonnées de
décorateurs (`emitDecoratorMetadata`).

- Points d'entrée : `@etiennea20/adr-nest` (common, permissions), `@etiennea20/adr-nest/filtering`
  (exige `@etiennea20/adr-misc` ≥ 0.3 et `zod` ≥ 4, peerDependencies optionnelles),
  `@etiennea20/adr-nest/prisma` (aucune dépendance), `@etiennea20/adr-nest/export` (exige
  `@etiennea20/adr-misc`) et `@etiennea20/adr-nest/excel` (exige `@etiennea20/adr-misc` et
  `fflate` ≥ 0.8).
- peerDependencies : `@nestjs/common`, `@nestjs/core`, `reflect-metadata`, `rxjs`.
- Catégories : `common` (format d'erreur d'API, exceptions, validation, éléments
  transverses), `permissions` (permissions à refus par défaut), `filtering` (requêtes de liste, sous-chemin),
  `prisma` (adaptateur, sous-chemin), `export` (JSON, NDJSON, CSV, sous-chemin), `excel` (XLSX,
  sous-chemin).

## Catégories

- [common](reference.md#common) : format d'erreur d'API, exceptions et validation (`API_ERROR_CONTENT_TYPE`, `ApiException`, `apiValidationExceptionFactory`, `EApiErrorCode`, `IApiError`, `IApiErrorIssue`, `IApiExceptionOptions`, `InferSchemaOutput`, `IStandardSchema`, `IStandardSchemaIssue`, `IValidationExceptionOptions`, `SchemaValidationPipe`, `StandardSchemaResult`, `ValidationException`, `ValidBody`, `ValidQuery`)
- [permissions](reference.md#permissions) : permissions à refus par défaut, règles sérialisables (`Authenticated`, `Can`, `CurrentSubject`, `definePermissions`, `IPermissionCondition`, `IPermissionRule`, `IPermissionsDefinition`, `IPermissionsModuleOptions`, `IPermissionSubject`, `IS_PUBLIC_KEY`, `PermissionConditionValue`, `PermissionDeniedException`, `PermissionScope`, `PermissionsConfigError`, `PermissionsGuard`, `PermissionsModule`, `PermissionsService`, `Public`, `SubjectResolver`, `UnauthenticatedException`)
- [filtering](reference.md#filtering) : requêtes de liste et critères, sous-chemin `/filtering` (`andCriteria`, `applyCriteriaInMemory`, `CriteriaNode`, `CriteriaValue`, `ICriteriaCondition`, `ICriteriaOrder`, `IListCriteria`, `IListCriteriaOptions`, `IListQueryParamOptions`, `ListQuery`, `ListQueryConfigError`, `parseListQuery`, `toListCriteria`, `toPage`)
- [prisma](reference.md#prisma) : adaptateur Prisma, sous-chemin `/prisma` (`IPrismaFindArgs`, `toPrismaFindArgs`, `toPrismaWhere`)
- [export](reference.md#export) : exports JSON, NDJSON, CSV et réponse de téléchargement, sous-chemin `/export` (`assertExportSize`, `contentDisposition`, `createExportFile`, `DEFAULT_EXPORT_MAX_ROWS`, `defineExportColumns`, `EExportColumnType`, `EExportFormat`, `EXPORT_CONTENT_TYPES`, `ExportCellValue`, `ExportConfigError`, `ExportHeaders`, `ExportLimitExceededException`, `ICsvExportOptions`, `IExportColumn`, `IExportFileOptions`, `IExportOptions`, `limitExportRows`, `readExportCell`, `selectExportColumns`, `toCsvExport`, `toJsonExport`, `toNdjsonExport`)
- [excel](reference.md#excel) : export XLSX, sous-chemin `/excel` (`IXlsxExportOptions`, `toXlsxExport`)

## Retrouver un élément

- L'inventaire complet est dans [reference.md](reference.md) : une entrée
  `` ### `NomExporté` `` par élément public (signature, paramètres, retour, erreurs, exemple,
  point d'entrée, statut, version d'introduction, fichiers source et test).
- Importer uniquement depuis le « Point d'entrée » indiqué, jamais depuis un chemin interne.
- Les chemins « Source » et « Tests » sont relatifs au package (`packages/adr-nest/`
  dans le monorepo adr-package).
- Pour modifier le package : lire d'abord `packages/adr-nest/CLAUDE.md` et le
  `CLAUDE.md` racine du monorepo.
