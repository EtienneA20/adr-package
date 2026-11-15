---
"@etiennea20/adr-nest": minor
---

Ajoute `ApiExceptionFilter` (toute erreur au format d'erreur d'API RFC 9457, `instance` et `requestId`, erreurs inattendues masquées et journalisées), `RequestLoggingInterceptor` (une ligne de journal par requête), l'identifiant de corrélation (`REQUEST_ID_HEADER`, `requestIdOf`, `RequestId`), `defineConfigurableModule` (module `forRoot` / `forRootAsync` à options validées par schéma, `ModuleOptionsError`) et le type `InferSchemaInput`.
