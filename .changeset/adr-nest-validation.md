---
"@etiennea20/adr-nest": minor
---

Ajoute la catégorie `common` : format d'erreur d'API RFC 9457 (`IApiError`, `EApiErrorCode`, `API_ERROR_CONTENT_TYPE`, identiques à ceux d'`@etiennea20/adr-misc/contract`), `ApiException`, `ValidationException`, et la validation par schéma Standard Schema (zod 4…) sous NestJS 11 et 12 : `SchemaValidationPipe`, `ValidBody`, `ValidQuery`, et `apiValidationExceptionFactory` pour le pipe natif de NestJS 12. Aucune nouvelle peerDependency.
