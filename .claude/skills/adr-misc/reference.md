<!-- Généré par `pnpm run install:skills` à partir de packages/adr-misc/SKILLS.md, ne pas modifier à la main. -->

# SKILLS : @etiennea20/adr-misc

## Introduction

Utilitaires sans dépendance d'environnement, utilisables dans le navigateur comme dans Node
(ESM et CJS). Aucune dépendance React ni NestJS.

- Point d'entrée unique : `@etiennea20/adr-misc`.
- `dayjs` est une peerDependency : le projet consommateur l'installe et configure ses plugins
  (`dayjs.extend`) une seule fois ; les fonctions du package utilisent cette même instance.
- Catégories : `core` (utilitaires de base), `parsing` (dates, durées, nombres), `enums`
  (énumérations `as const` préfixées par `E`).

## Table des matières

- [core](#core) : utilitaires de base (assertions, garde-fous)
  - [`invariant`](#invariant)
- `parsing` : fonctions de parsing (dayjs, temps…) (aucun élément pour l'instant)
- `enums` : énumérations (jours, mois…) (aucun élément pour l'instant)

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

**Signature**

```ts
function invariant(condition: unknown, message: string): asserts condition;
```

**Description** : vérifie qu'une condition est vraie et lève une erreur sinon. TypeScript
affine ensuite le type de la condition. À utiliser pour garantir une hypothèse interne, pas
pour valider une saisie utilisateur.

**Paramètres**

- `condition` : valeur qui doit être vraie (truthy).
- `message` : message de l'erreur levée, en français.

**Retour** : rien (`asserts condition`).

**Erreurs** : `Error` avec `message` si `condition` est fausse (`false`, `0`, `""`, `null`,
`undefined`, `NaN`).

**Exemple**

```ts
import { invariant } from "@etiennea20/adr-misc";

const user = users.find((candidate) => candidate.id === id);
invariant(user, `Utilisateur ${id} introuvable`);
user.name; // `user` n'est plus `undefined`
```
