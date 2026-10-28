# @etiennea20/adr-nest

Utilitaires pour applications NestJS (11 ou 12) : méthodes avancées, gestion des droits,
filtrage avancé, export Excel et JSON. Compilé en CommonJS avec les métadonnées de décorateurs.

## Installation

Le package est publié sur GitHub Packages. Dans le projet consommateur, un fichier `.npmrc`
doit déclarer le registre du scope (voir le README du dépôt) :

```ini
@etiennea20:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NPM_TOKEN}
```

Puis :

```sh
pnpm add @etiennea20/adr-nest
```

peerDependencies (déjà présentes dans une application NestJS) : `@nestjs/common`,
`@nestjs/core`, `reflect-metadata`, `rxjs`.

## Exemple minimal

```ts
import { Controller, Get } from "@nestjs/common";
import { Public } from "@etiennea20/adr-nest";

@Controller("health")
export class HealthController {
  @Public() // lu par votre guard d'authentification via IS_PUBLIC_KEY
  @Get()
  check() {
    return { status: "ok" };
  }
}
```

## Documentation

- Inventaire complet des éléments publics : [SKILLS.md](./SKILLS.md).
- Guides, exemples et référence API : section « adr-nest » de la documentation (`apps/docs`
  du dépôt).
