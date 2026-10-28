# CLAUDE.md : `@etiennea20/adr-nest`

Complète le `CLAUDE.md` racine (à lire d'abord), puis lire `SKILLS.md` de ce package.

## Rôle

Utilitaires backend NestJS : méthodes avancées, gestion des droits, filtrage avancé, export
Excel et JSON. Pas de React, pas de `"use client"`. Pas de playground : chaque élément est
documenté (guide + exemple) dans la section adr-nest de `apps/docs`, avec la référence API
générée depuis le TSDoc.

## Build : pourquoi `tsc` et pas tsup

- esbuild (utilisé par tsup) **n'émet pas** les métadonnées de décorateurs
  (`design:paramtypes`, `design:type`). Sans elles, l'injection de dépendances de NestJS par type
  de constructeur échoue chez le consommateur. tsup ne les émet qu'en passant par SWC, ce qui
  ajouterait `@swc/core` au build.
- Le build utilise donc `tsc -p tsconfig.build.json` : sortie **CommonJS uniquement**
  (`"type": "commonjs"`, `module: node20`), `.d.ts`, sourcemaps avec sources intégrées. L'ESM
  n'apporte rien à l'écosystème NestJS, qui charge les modules en CommonJS.
- `src/decorator-metadata.test.ts` vérifie que la configuration de build émet bien ces
  métadonnées et produit du CommonJS : ne pas le supprimer.

## TypeScript

- `tsconfig.json` (typecheck + lint, tests compris) active `experimentalDecorators` et
  `emitDecoratorMetadata` : ces options restent **hors** du tsconfig de base.
- `erasableSyntaxOnly` et `verbatimModuleSyntax` sont désactivés ici (propriétés de paramètres
  `constructor(private readonly x: X)` et compilation des `import` en `require`).
- **Piège DI** : un type injecté par constructeur doit être importé **comme valeur**
  (`import { UsersService } from …`), jamais `import type`, sinon la métadonnée vaut `Object`
  et l'injection échoue. typescript-eslint en tient compte (`emitDecoratorMetadata` dans les
  options du parser du préréglage `nest`).
- Fichiers de config en `.mjs` / `.mts` (`eslint.config.mjs`, `vitest.config.mts`) car le
  package est en CommonJS.

## Dépendances

- peerDependencies : `@nestjs/common` et `@nestjs/core` (`^11 || ^12`), `reflect-metadata`
  (`^0.2`), `rxjs` (`^7.8`). Les mêmes en devDependencies pour les tests.
- Toute autre dépendance (par exemple une bibliothèque Excel pour la catégorie `export`) doit
  être demandée avant ajout, avec le choix dependency / peerDependency (optionnelle ?).

## Catégories

| Dossier          | Contenu                                                            |
| ---------------- | ------------------------------------------------------------------ |
| `src/core/`      | Méthodes avancées NestJS : décorateurs, pipes, interceptors, utils |
| `src/rights/`    | Gestion des droits : routes publiques, rôles, permissions, guards  |
| `src/filtering/` | Filtrage avancé : parsing de query, critères, pagination, tri      |
| `src/export/`    | Export Excel et JSON (services, interceptors, formats)             |

Une catégorie n'est réexportée par `src/index.ts` qu'avec son premier élément. Si une catégorie
dépasse une quinzaine d'éléments, proposer de la diviser.

## Conventions NestJS

- Clés de métadonnées préfixées par `adr:` (`IS_PUBLIC_KEY = "adr:isPublic"`) pour éviter les
  collisions avec l'application consommatrice.
- Décorateurs exportés en `PascalCase` (`Public()`), comme ceux de NestJS.
- Un module dynamique exposé suit la convention `forRoot` / `forRootAsync`.
- Les messages d'erreur levés (exceptions HTTP comprises) sont en français.

## Tests

- Vitest + `unplugin-swc` (SWC émet les métadonnées de décorateurs ; esbuild non).
  `vitest.setup.ts` charge `reflect-metadata`.
- Tests d'intégration légers avec `Test.createTestingModule` de `@nestjs/testing` : déclarer
  les contrôleurs et providers d'exemple dans le fichier de test.
- La règle `unbound-method` est désactivée dans les tests (méthodes passées au `Reflector`).

## Plugin ESLint NestJS

`@darraghor/eslint-plugin-nestjs-typed` est maintenu (dernière version : octobre 2026) mais
impose `class-validator` en peerDependency. Il n'est pas installé ; à proposer si le package
expose un jour des DTO validés.

## Élément de référence

`src/rights/public/` : modèle à suivre (décorateur + constante exportés, TSDoc complet, test
d'intégration avec `Test.createTestingModule` et `Reflector`).
