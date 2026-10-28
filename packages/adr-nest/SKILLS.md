---
skill: adr-nest
description: >-
  À utiliser pour développer ou utiliser @etiennea20/adr-nest : utilitaires backend NestJS
  (décorateurs, guards, pipes, interceptors, services), gestion des droits et des routes
  publiques, filtrage avancé des requêtes, export Excel et JSON. Donne l'inventaire des éléments
  publics, leur signature, leurs erreurs et un exemple d'utilisation dans un module NestJS.
---

# SKILLS : @etiennea20/adr-nest

## Introduction

Utilitaires pour applications NestJS (11 ou 12), compilés en CommonJS avec les métadonnées de
décorateurs (`emitDecoratorMetadata`).

- Point d'entrée unique : `@etiennea20/adr-nest`.
- peerDependencies : `@nestjs/common`, `@nestjs/core`, `reflect-metadata`, `rxjs`.
- Catégories : `core` (méthodes avancées NestJS), `rights` (gestion des droits), `filtering`
  (filtrage avancé), `export` (export Excel et JSON).

## Table des matières

- `core` : méthodes avancées NestJS (aucun élément pour l'instant)
- [rights](#rights) : gestion des droits
  - [`Public`](#public)
  - [`IS_PUBLIC_KEY`](#is_public_key)
- `filtering` : filtrage avancé (aucun élément pour l'instant)
- `export` : export Excel et JSON (aucun élément pour l'instant)

## rights

### `Public`

| Champ          | Valeur                             |
| -------------- | ---------------------------------- |
| Catégorie      | `rights`                           |
| Point d'entrée | `@etiennea20/adr-nest`             |
| Statut         | stable                             |
| Depuis         | 0.1.0                              |
| Source         | `src/rights/public/public.ts`      |
| Tests          | `src/rights/public/public.test.ts` |

**Signature**

```ts
function Public(): CustomDecorator<"adr:isPublic">;
```

**Description** : décorateur de méthode ou de classe qui marque une route (ou toutes les routes
d'un contrôleur) comme publique en posant la métadonnée [`IS_PUBLIC_KEY`](#is_public_key).
Ne fait rien seul : un guard d'authentification doit lire la métadonnée.

**Paramètres** : aucun.

**Retour** : un décorateur NestJS (`SetMetadata(IS_PUBLIC_KEY, true)`).

**Erreurs** : aucune.

**Exemple**

```ts
import { Controller, Get } from "@nestjs/common";
import { Public } from "@etiennea20/adr-nest";

@Controller("health")
export class HealthController {
  @Public()
  @Get()
  check() {
    return { status: "ok" };
  }
}
```

### `IS_PUBLIC_KEY`

| Champ          | Valeur                             |
| -------------- | ---------------------------------- |
| Catégorie      | `rights`                           |
| Point d'entrée | `@etiennea20/adr-nest`             |
| Statut         | stable                             |
| Depuis         | 0.1.0                              |
| Source         | `src/rights/public/public.ts`      |
| Tests          | `src/rights/public/public.test.ts` |

**Signature**

```ts
const IS_PUBLIC_KEY: "adr:isPublic";
```

**Description** : clé de métadonnée posée par [`Public`](#public), à lire dans un guard avec le
`Reflector` de NestJS.

**Paramètres** : sans objet (constante).

**Retour** : sans objet (constante).

**Erreurs** : aucune.

**Exemple**

```ts
import { Injectable, type CanActivate, type ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_KEY } from "@etiennea20/adr-nest";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    return isPublic || Boolean(context.switchToHttp().getRequest().user);
  }
}
```
