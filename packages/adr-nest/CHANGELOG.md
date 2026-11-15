# @etiennea20/adr-nest

## 0.3.0

### Minor Changes

- [#22](https://github.com/EtienneA20/adr-package/pull/22) [`a2483b3`](https://github.com/EtienneA20/adr-package/commit/a2483b3479f8372214c4503692c3f5a5d60e4b27) Thanks [@EtienneA20](https://github.com/EtienneA20)! - Ajoute `ApiExceptionFilter` (toute erreur au format d'erreur d'API RFC 9457, `instance` et `requestId`, erreurs inattendues masquées et journalisées), `RequestLoggingInterceptor` (une ligne de journal par requête), l'identifiant de corrélation (`REQUEST_ID_HEADER`, `requestIdOf`, `RequestId`), `defineConfigurableModule` (module `forRoot` / `forRootAsync` à options validées par schéma, `ModuleOptionsError`) et le type `InferSchemaInput`.

- [#20](https://github.com/EtienneA20/adr-package/pull/20) [`c24d33b`](https://github.com/EtienneA20/adr-package/commit/c24d33b5f6ee10a3fa3e8ccb3c105f7899cd8b39) Thanks [@EtienneA20](https://github.com/EtienneA20)! - Ajoute le sous-chemin `@etiennea20/adr-nest/export` (peerDependency optionnelle `@etiennea20/adr-misc` ≥ 0.3) : colonnes en liste blanche (`defineExportColumns`, `selectExportColumns`), exports JSON, NDJSON et CSV (Excel en français) en flux, neutralisation des formules, limite de lignes (`assertExportSize`, `limitExportRows`, 50 000 par défaut, `ExportLimitExceededException`), réponse `createExportFile` (nom de fichier assaini) et `ExportHeaders`. Ajoute le sous-chemin `@etiennea20/adr-nest/excel` (peerDependency optionnelle `fflate` ≥ 0.8) : `toXlsxExport`, XLSX en flux à cellules typées au format français, protégé contre l'injection de formules.

- [#21](https://github.com/EtienneA20/adr-package/pull/21) [`e86a7ff`](https://github.com/EtienneA20/adr-package/commit/e86a7ff56ebf6f7e5505e0dfd82782fd1b50ec7f) Thanks [@EtienneA20](https://github.com/EtienneA20)! - Ajoute les permissions à refus par défaut : `PermissionsModule` (`forRoot` / `forRootAsync`, guard global, contrôle des routes au démarrage en mode strict), `PermissionsService` (`canOnSome`, `can`, `assertCan`, `scope` combinable avec `andCriteria`), `PermissionsGuard`, les décorateurs `Authenticated`, `Can` et `CurrentSubject`, des règles sérialisables validées par `definePermissions` (rôle → `{ action, resource, where }`, références `$subject.…`), et les erreurs `UnauthenticatedException` (401), `PermissionDeniedException` (403) et `PermissionsConfigError`. `Public` et `IS_PUBLIC_KEY` sont inchangés.

### Patch Changes

- Updated dependencies [[`6e4d499`](https://github.com/EtienneA20/adr-package/commit/6e4d49970abc4b31d5c601ed8da172cf34672d04)]:
  - @etiennea20/adr-misc@0.4.0

## 0.2.0

### Minor Changes

- [#16](https://github.com/EtienneA20/adr-package/pull/16) [`859c257`](https://github.com/EtienneA20/adr-package/commit/859c257d347681bfb4f86f5d548444172965ecb9) Thanks [@EtienneA20](https://github.com/EtienneA20)! - Ajoute le sous-chemin `@etiennea20/adr-nest/filtering` (peerDependencies optionnelles `@etiennea20/adr-misc` ≥ 0.3 et `zod` ≥ 4) : décorateur `ListQuery` qui valide une requête de liste avec le contrat partagé avec le front et la convertit en critères neutres (`IListCriteria`), `parseListQuery`, `toListCriteria`, `andCriteria`, `applyCriteriaInMemory` et `toPage`. Ajoute le sous-chemin `@etiennea20/adr-nest/prisma` : `toPrismaFindArgs` et `toPrismaWhere` (objets simples, sans dépendance à `@prisma/client`).

- [#16](https://github.com/EtienneA20/adr-package/pull/16) [`87a3b8a`](https://github.com/EtienneA20/adr-package/commit/87a3b8ace911f77db92a5b6ef2e0ddb66cd9dee7) Thanks [@EtienneA20](https://github.com/EtienneA20)! - Ajoute la catégorie `common` : format d'erreur d'API RFC 9457 (`IApiError`, `EApiErrorCode`, `API_ERROR_CONTENT_TYPE`, identiques à ceux d'`@etiennea20/adr-misc/contract`), `ApiException`, `ValidationException`, et la validation par schéma Standard Schema (zod 4…) sous NestJS 11 et 12 : `SchemaValidationPipe`, `ValidBody`, `ValidQuery`, et `apiValidationExceptionFactory` pour le pipe natif de NestJS 12. Aucune nouvelle peerDependency.

## 0.1.1

### Patch Changes

- [#10](https://github.com/EtienneA20/adr-package/pull/10) [`86f85a8`](https://github.com/EtienneA20/adr-package/commit/86f85a88a335b3ce5235cbb84fc2063a1b621441) Thanks [@EtienneA20](https://github.com/EtienneA20)! - La commande d'installation des skills (`adr-nest-skills`, `adr-misc-skills`) n'installe que le skill du package et vérifie sa présence avant de copier.

## 0.1.0

### Minor Changes

- [`442b44c`](https://github.com/EtienneA20/adr-package/commit/442b44cd77741a07803bc98bd0f3dc153a833889) Thanks [@EtienneA20](https://github.com/EtienneA20)! - Première version de `@etiennea20/adr-nest` : build CommonJS avec métadonnées de décorateurs, décorateur `Public` et constante `IS_PUBLIC_KEY`.
