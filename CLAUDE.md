# CLAUDE.md : monorepo `adr-package`

Monorepo des packages npm personnels du scope `@etiennea20`, publiés sur GitHub Packages.
Ce fichier est la référence commune. Chaque package (et `apps/docs`) a son propre `CLAUDE.md`
qui **complète** celui-ci sans le répéter.

## Consignes de comportement (à lire en premier)

1. Avant de toucher un package, lire son `CLAUDE.md` **et** son `SKILLS.md`.
2. Suivre les patterns existants (l'élément d'exemple de chaque package sert de modèle) plutôt
   que d'en inventer de nouveaux.
3. Ne **jamais** ajouter de dépendance (dependencies, peerDependencies ou devDependencies) sans
   le demander d'abord.
4. Ne jamais casser l'API publique sans changeset `major`.
5. `.claude/skills/` est généré : ne jamais l'éditer à la main, modifier `SKILLS.md` puis lancer
   `pnpm run install:skills`.
6. En cas de décision ouverte (nommage d'API, nouvelle catégorie, dépendance…), poser la question
   plutôt que trancher.

## Arborescence

```
.
├── .changeset/          # changesets en attente + config (changelog GitHub)
├── .claude/skills/      # skills Claude Code générés depuis packages/*/SKILLS.md (versionnés)
├── .github/             # workflows CI/CD, dependabot, modèle de PR
├── .husky/              # hooks Git (pre-commit : lint-staged, commit-msg : commitlint)
├── apps/
│   └── docs/            # documentation Docusaurus + playground live (privé, jamais publié)
├── packages/
│   ├── adr-react/       # @etiennea20/adr-react : composants et hooks React
│   ├── adr-nest/        # @etiennea20/adr-nest : utilitaires NestJS
│   ├── adr-misc/        # @etiennea20/adr-misc : utilitaires partagés front et back
│   └── config/          # @etiennea20/config : ESLint, Vitest, TSDoc partagés (privé)
├── scripts/             # scripts Node du dépôt (check-skills, install-skills)
├── eslint.config.js     # lint des fichiers de la racine
├── pnpm-workspace.yaml  # workspaces, catalog de versions, allowBuilds
├── tsconfig.base.json   # options TypeScript communes (strictes)
└── turbo.json           # pipeline Turborepo
```

## Commandes

| Commande                       | Rôle                                                                               |
| ------------------------------ | ---------------------------------------------------------------------------------- |
| `pnpm install`                 | Installe les dépendances (et les hooks Husky)                                      |
| `pnpm dev`                     | Mode watch de tous les packages + serveur de la doc                                |
| `pnpm build`                   | Build de tous les packages et de la doc (Turborepo)                                |
| `pnpm lint`                    | ESLint partout, `--max-warnings=0`                                                 |
| `pnpm format` / `format:check` | Prettier en écriture / en vérification                                             |
| `pnpm typecheck`               | `tsc --noEmit` dans chaque projet                                                  |
| `pnpm test`                    | Vitest avec couverture et seuil (90 %)                                             |
| `pnpm check:skills`            | Vérifie que chaque export public a un TSDoc complet et une entrée dans `SKILLS.md` |
| `pnpm run install:skills`      | Régénère `.claude/skills/` depuis les `SKILLS.md` (`--check` en CI)                |
| `pnpm changeset`               | Décrit un changement de version d'un package publié                                |

Toujours écrire `pnpm run install:skills` (et non `pnpm install:skills`) pour éviter toute
confusion avec `pnpm install`. Cibler un package : `pnpm --filter @etiennea20/adr-react test`.

## Langue

- **Identifiants** (variables, fonctions, types, fichiers, packages) : anglais.
- **TSDoc, commentaires, README, CLAUDE.md, SKILLS.md, pages de doc, noms des tests** : français.
- **Messages d'erreur levés par les fonctions des packages** : français.
- **Commits** : type Conventional Commits en anglais, description en français
  (`feat(adr-react): ajoute le composant DataTable`).

## Nommage

| Élément                             | Convention                                            | Exemple                  |
| ----------------------------------- | ----------------------------------------------------- | ------------------------ |
| Fichiers et dossiers                | `kebab-case`                                          | `visually-hidden.tsx`    |
| Composants React, classes, types    | `PascalCase`                                          | `VisuallyHidden`         |
| Interfaces                          | `PascalCase` préfixé par `I`                          | `IUser`, `IButtonProps`  |
| « Enums » (objet `as const` + type) | `PascalCase` préfixé par `E`, clés `UPPER_SNAKE_CASE` | `EWeekDay.MONDAY`        |
| Fonctions, hooks, variables         | `camelCase`                                           | `formatDate`, `useFetch` |
| Constantes primitives               | `UPPER_SNAKE_CASE`                                    | `DEFAULT_TIMEOUT_MS`     |

Le mot-clé `enum` de TypeScript est **interdit** (incompatible avec `erasableSyntaxOnly` et le
type-stripping de Node). Une énumération s'écrit ainsi :

````ts
/**
 * Jours de la semaine, numérotés comme `Date.prototype.getDay()`.
 *
 * @example
 * ```ts
 * EWeekDay.MONDAY; // 1
 * ```
 * @since 0.1.0
 */
export const EWeekDay = {
  SUNDAY: 0,
  MONDAY: 1,
  // ...
} as const;

/** Valeur possible de {@link EWeekDay}. */
export type EWeekDay = (typeof EWeekDay)[keyof typeof EWeekDay];
````

Ces règles sont imposées par ESLint (`@typescript-eslint/naming-convention`,
`check-file/*`, `no-restricted-syntax`).

## Structure d'un package

```
packages/<package>/
├── CLAUDE.md          # règles propres au package
├── SKILLS.md          # inventaire de tous les éléments publics (source de vérité des skills)
├── README.md
├── package.json
├── tsconfig.json
├── tsdoc.json         # étend @etiennea20/config/tsdoc.json (déclare @since)
├── eslint.config.js
├── tsup.config.ts     # (adr-nest : tsconfig.build.json + tsc)
├── vitest.config.ts
├── bin/               # script d'installation des skills pour les projets consommateurs
├── skills/            # généré au build depuis SKILLS.md, ignoré par Git, publié
└── src/
    ├── index.ts       # unique point d'entrée public (réexporte les catégories)
    └── <categorie>/
        ├── index.ts   # réexporte les éléments de la catégorie
        └── <element>/
            ├── <element>.ts(x)       # implémentation
            ├── <element>.test.ts(x)  # tests, à côté du code
            └── index.ts              # réexporte l'élément
```

Règles :

- **Exports nommés uniquement**, aucun `export default` (sauf fichiers de configuration).
- L'API publique passe **uniquement** par les `index.ts`. Ce qui n'est pas réexporté par
  `src/index.ts` (ou par un sous-chemin `exports`) est privé.
- **Aucun import profond** : depuis un élément, on importe un autre élément via l'`index.ts` de
  sa catégorie (`../../ui`) ou de son dossier (`../other-element`), jamais
  `../../ui/button/button`. Imposé par ESLint (`no-restricted-imports`).
- **Aucune dépendance circulaire** (`import-x/no-cycle`).
- Un fichier = une responsabilité. Pas de fichier fourre-tout `utils.ts`.
- Un élément privé partagé par plusieurs éléments d'une catégorie vit dans son propre dossier
  `src/<categorie>/<element-prive>/`, non réexporté par l'`index.ts` de la catégorie, et
  porte le tag `@internal`.

## Documentation du code (obligatoire pour tout élément public)

Chaque fonction, hook, composant, classe, décorateur, type et énumération exporté a un
commentaire **TSDoc en français** avec :

- une description claire de ce que fait l'élément et de **quand** l'utiliser ;
- `@param` pour chaque paramètre (`@param props - …` pour un composant), `@typeParam` pour
  chaque générique ;
- `@returns` pour la valeur de retour ;
- `@throws` pour chaque erreur possible ;
- au moins un `@example` exécutable ;
- `@since` avec la version d'introduction, `@deprecated` le cas échéant ;
- pour les composants React : un commentaire TSDoc sur **chaque prop**.

Modèle de référence :

````ts
/**
 * Formate une date au format français (JJ/MM/AAAA).
 *
 * @param date - Date à formater. Une chaîne ISO 8601 est acceptée.
 * @returns La date formatée, ou une chaîne vide si la date est invalide.
 * @throws {@link RangeError} Si le fuseau horaire fourni n'existe pas.
 * @example
 * ```ts
 * formatDateFr(new Date("2026-10-28")); // "28/10/2026"
 * ```
 * @since 0.1.0
 */
````

Attention : en TSDoc, `@throws {RangeError}` est une erreur de syntaxe ; écrire
`@throws {@link RangeError} …`.

Les éléments privés complexes reçoivent un commentaire qui explique le **pourquoi**, pas le quoi.
Pas de code commenté. Pas de `TODO` sans ticket ou explication.

Contrôles automatiques : ESLint (`jsdoc/*`, `tsdoc/syntax`) exige description, `@param`,
`@returns`, `@throws` (si le corps contient `throw`) et `@example` ; `pnpm check:skills`
vérifie en plus `@since` et l'entrée dans `SKILLS.md` pour chaque export public.

## SKILLS.md et skills Claude Code

Chaque package publié a un `SKILLS.md` : l'inventaire de **tous** ses éléments publics, en
français. C'est la **source de vérité** dont `pnpm run install:skills` dérive
`.claude/skills/<package>/` (`SKILL.md` court + `reference.md`, copie de l'inventaire).

Règles :

- Tout ajout, modification ou suppression d'un élément public met à jour `SKILLS.md` **dans la
  même PR**, puis `pnpm run install:skills`, et `.claude/skills/` est commité (le hook
  pre-commit le fait automatiquement quand un `SKILLS.md` est indexé).
- `.claude/skills/` est généré : ne jamais l'éditer à la main.
- Deux contrôles distincts tournent en CI : `pnpm check:skills` (chaque export a un TSDoc
  complet et une entrée cohérente dans `SKILLS.md`, et inversement) et
  `pnpm run install:skills --check` (`.claude/skills/` est synchronisé avec les `SKILLS.md`).

Format (strict, analysé par les scripts de `scripts/`) :

```md
---
skill: adr-misc # nom du skill : minuscules et tirets
description: >-
  À utiliser pour … (dit QUAND utiliser le skill : nom du package, types d'éléments,
  cas d'usage ; 1024 caractères max)
---

# SKILLS : @etiennea20/adr-misc

## Introduction

Rôle du package, périmètre (court : repris dans SKILL.md, limité à 150 lignes).

## Table des matières

- [core](#core) : utilitaires de base
  - [`invariant`](#invariant)

## core

### `invariant`

| Champ          | Valeur                                 |
| -------------- | -------------------------------------- |
| Catégorie      | `core`                                 |
| Point d'entrée | `@etiennea20/adr-misc`                 |
| Statut         | stable                                 |
| Depuis         | 0.1.0                                  |
| Source         | `src/core/invariant/invariant.ts`      |
| Tests          | `src/core/invariant/invariant.test.ts` |

**Signature**, **Description**, **Paramètres**, **Retour**, **Erreurs**, **Exemple**
(blocs de texte libres sous le tableau).
```

- Une entrée par export public, titrée exactement `` ### `NomExporté` ``.
- « Point d'entrée » : le spécificateur d'import (`@etiennea20/adr-react/fetch` pour un
  sous-chemin).
- « Statut » : `stable`, `expérimental` ou `déprécié` (`déprécié` ⇔ tag `@deprecated`).
- « Depuis » : identique au tag `@since`.
- « Source » et « Tests » : chemins relatifs au package, qui doivent exister.

## Tests (obligatoires pour tout élément public)

- Vitest partout, un fichier `<element>.test.ts(x)` à côté de chaque élément.
- Couvrir : le cas nominal, les cas limites, les cas d'erreur (chaque `@throws` est testé), et
  pour les composants React le rendu, les interactions (`@testing-library/user-event`) et
  l'accessibilité (requêtes par rôle : `getByRole`).
- Noms en français : `describe("<élément>")` puis `it("<comportement attendu>")`.
- Importer explicitement `describe`, `it`, `expect`, `vi` depuis `vitest` (pas de globales).
- Pas de snapshot comme seul test. Pas de test qui dépend de l'heure (`vi.useFakeTimers()` +
  `vi.setSystemTime()`), du réseau (mock) ou de l'ordre d'exécution.
- Seuil de couverture : **90 %** sur lignes, fonctions, branches et instructions (défini dans
  `@etiennea20/config/vitest`, appliqué en local et en CI).
- Un correctif de bug commence par un test qui reproduit le bug.

## Flux Git

1. Créer une branche depuis `main` : `feat/…`, `fix/…`, `docs/…`, `chore/…`.
2. Commits en Conventional Commits (`feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `ci`,
   `build`, `perf`), imposés par commitlint dans le hook `commit-msg`.
3. Ajouter un changeset (`pnpm changeset`) dès qu'un package publié change.
4. Ouvrir une pull request vers `main` ; le titre suit aussi Conventional Commits (fusion en
   squash possible). La CI doit être verte.
5. Le merge dans `main` ouvre ou met à jour la PR « Version Packages » ; son merge publie.

Choix du type de changeset : `patch` pour un correctif, `minor` pour un ajout rétrocompatible,
`major` pour toute rupture de l'API publique (renommage, suppression, changement de signature
ou de comportement documenté).

## Définition de « terminé »

Checklist à suivre avant tout commit de feature :

1. L'élément a un TSDoc français complet (description, params, returns, throws, example, since).
2. Il a des tests (nominal, limites, erreurs) et la couverture reste au-dessus du seuil.
3. Il est exporté via les `index.ts`, ajouté à `SKILLS.md`, et `.claude/skills/` est régénéré
   (`pnpm run install:skills`).
4. La page de documentation correspondante existe dans `apps/docs` (et la démo live pour
   `adr-react`).
5. Un changeset décrit le changement (type patch, minor ou major correct).
6. `pnpm lint`, `pnpm format:check`, `pnpm typecheck`, `pnpm test`, `pnpm check:skills`,
   `pnpm run install:skills --check` et `pnpm build` passent sans avertissement.

## Outillage : points d'attention

- **TypeScript 6 uniquement** (`catalog:` dans `pnpm-workspace.yaml`) : tsup et
  rollup-plugin-dts ne fonctionnent pas avec TypeScript 7. Ne jamais ajouter une autre version.
- **ESLint 9** : `eslint-plugin-react` et `eslint-plugin-jsx-a11y` ne supportent pas ESLint 10.
- Les versions partagées passent par le `catalog` de `pnpm-workspace.yaml`
  (`"vitest": "catalog:"`).
- Scripts de build des dépendances : autorisés un par un dans `allowBuilds`
  (`onlyBuiltDependencies` est ignoré depuis pnpm 11).
- La configuration ESLint partagée est dans `packages/config/eslint.js`
  (`defineAdrConfig({ preset: "library" | "react" | "nest" | "docs" | "node" })`).
