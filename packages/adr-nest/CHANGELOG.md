# @etiennea20/adr-nest

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
