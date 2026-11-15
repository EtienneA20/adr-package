---
"@etiennea20/adr-nest": minor
---

Ajoute les permissions à refus par défaut : `PermissionsModule` (`forRoot` / `forRootAsync`, guard global, contrôle des routes au démarrage en mode strict), `PermissionsService` (`canOnSome`, `can`, `assertCan`, `scope` combinable avec `andCriteria`), `PermissionsGuard`, les décorateurs `Authenticated`, `Can` et `CurrentSubject`, des règles sérialisables validées par `definePermissions` (rôle → `{ action, resource, where }`, références `$subject.…`), et les erreurs `UnauthenticatedException` (401), `PermissionDeniedException` (403) et `PermissionsConfigError`. `Public` et `IS_PUBLIC_KEY` sont inchangés.
