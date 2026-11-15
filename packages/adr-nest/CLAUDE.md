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
- peerDependencies **optionnelles** (`peerDependenciesMeta`) : `@etiennea20/adr-misc`
  (`>=0.3.0 <1.0.0`), `zod` (`^4.0.0`) et `fflate` (`^0.8.0`), chacune réservée aux sous-chemins
  qui l'utilisent (ESLint `optionalPeers`, une ou plusieurs zones par peer ; les tests peuvent
  toutes les importer). L'entrée principale n'en importe aucune.
- Export XLSX : writer interne sur fflate (zip en flux), choisi plutôt qu'exceljs (plus de
  version depuis 2023, dépendances obsolètes et vulnérables) ou write-excel-file (tout en
  mémoire). Toute évolution (nouveau type de cellule, style) se teste en décompressant le
  fichier produit.
- Les mêmes en devDependencies, pour les tests (dont le test anti-divergence du format d'erreur).

## Points d'entrée

| Spécificateur                    | Source                   | Peers optionnels                       |
| -------------------------------- | ------------------------ | -------------------------------------- |
| `@etiennea20/adr-nest`           | `src/index.ts`           | aucun                                  |
| `@etiennea20/adr-nest/filtering` | `src/filtering/index.ts` | `@etiennea20/adr-misc`, `zod`          |
| `@etiennea20/adr-nest/prisma`    | `src/prisma/index.ts`    | aucun (n'importe pas `@prisma/client`) |

- Ajouter un sous-chemin = modifier **ensemble** `exports` et `typesVersions` (package.json,
  pour les projets en `moduleResolution: node`), `optionalPeers` (eslint.config.mjs), le
  commentaire `@module` de son `index.ts`, `typedocPlugin("nest", […])` dans
  `apps/docs/docusaurus.config.ts`, ce fichier et `SKILLS.md`. Demander avant d'en créer un.
- Un adaptateur d'ORM produit des objets simples et n'importe pas l'ORM quand c'est possible
  (aucune peerDependency) ; ses tests vérifient les arguments produits, sans base.

## Catégories

| Dossier            | Contenu                                                                  |
| ------------------ | ------------------------------------------------------------------------ |
| `src/common/`      | Erreurs d'API, validation, filtre, journalisation, modules configurables |
| `src/permissions/` | Permissions : refus par défaut, règles sérialisables, guard, module      |
| `src/filtering/`   | Sous-chemin `./filtering` : requête de liste → critères neutres          |
| `src/prisma/`      | Sous-chemin `./prisma` : critères → arguments Prisma (sans import)       |
| `src/export/`      | Sous-chemin `./export` : JSON, NDJSON, CSV, réponse de téléchargement    |
| `src/excel/`       | Sous-chemin `./excel` : XLSX en flux (writer interne sur fflate)         |

Une catégorie n'est réexportée par `src/index.ts` qu'avec son premier élément. Si une catégorie
dépasse une quinzaine d'éléments, proposer de la diviser.

## Conventions NestJS

- Clés de métadonnées préfixées par `adr:` (`IS_PUBLIC_KEY = "adr:isPublic"`) pour éviter les
  collisions avec l'application consommatrice.
- Décorateurs exportés en `PascalCase` (`Public()`), comme ceux de NestJS.
- Un module dynamique exposé suit la convention `forRoot` / `forRootAsync`.
- Les messages d'erreur levés (exceptions HTTP comprises) sont en français.

## Validation et erreurs

- Validation par schéma **Standard Schema** (`IStandardSchema`, copie minimale de la
  spécification) : aucun import de zod dans le code du package. `SchemaValidationPipe`,
  `ValidBody`, `ValidQuery` fonctionnent sous NestJS 11 et 12 ; sous 12,
  `apiValidationExceptionFactory` branche le pipe natif sur le même format.
- `ApiExceptionFilter` (global) traduit toute exception en format d'erreur d'API ; une erreur
  inattendue n'expose jamais son message (500 `INTERNAL_ERROR`, pile journalisée). Ne jamais
  ajouter au corps d'erreur une donnée issue d'une exception non `ApiException` sans la filtrer.
- Journaux et `instance` : chemin sans paramètres d'URL (`requestPath`) ; identifiant de
  corrélation via `requestIdOf` (en-tête `x-request-id` validé, sinon UUID).
- Module réutilisable configuré par l'application : `defineConfigurableModule` (options
  validées par schéma au démarrage), plutôt qu'un `forRoot` écrit à la main.
- Toute erreur exposée au client suit le format d'erreur d'API (`ApiException`, RFC 9457 +
  `code`). `EApiErrorCode`, `IApiError` et `API_ERROR_CONTENT_TYPE` reproduisent ceux
  d'`@etiennea20/adr-misc/contract` : `src/common/api-error/api-error.test.ts` vérifie qu'ils
  restent identiques. Modifier les deux ensemble.

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

`src/permissions/public/` : modèle à suivre (décorateur + constante exportés, TSDoc complet, test
d'intégration avec `Test.createTestingModule` et `Reflector`).

## Permissions

- **Refus par défaut** : `PermissionsGuard` (global via `PermissionsModule`) refuse toute route
  sans `@Public()`, `@Authenticated()` ou `@Can()` ; le mode strict (par défaut) fait échouer
  le démarrage en listant ces routes. Toute nouvelle route d'exemple doit être annotée.
- **Règles = données sérialisables** (`IPermissionsDefinition`) : jamais de fonction dans une
  règle, pour pouvoir les partager avec le front. `where` : égalité ou appartenance, valeurs
  fixes ou références `$subject.<chemin>`. Toute extension du format (opérateurs, nouveaux
  jokers) se décide d'abord : c'est un contrat partagé.
- **Échec fermé** : sujet absent, rôles mal typés, référence absente du sujet → pas de droit.
  Tout nouveau cas d'évaluation est testé dans les deux sens (accordé, refusé).
- `PermissionScope` reste compatible avec `CriteriaNode` (test de types dans
  `permission-scope.test.ts`) sans que l'entrée principale importe le filtrage.
