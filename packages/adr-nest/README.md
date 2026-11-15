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

Le sous-chemin `@etiennea20/adr-nest/filtering` (requêtes de liste) exige en plus
`@etiennea20/adr-misc` (≥ 0.3) et `zod` (≥ 4), peerDependencies optionnelles :

```sh
pnpm add @etiennea20/adr-misc zod
```

`@etiennea20/adr-nest/prisma` (adaptateur Prisma) n'ajoute aucune dépendance.
`@etiennea20/adr-nest/export` (JSON, NDJSON, CSV) exige `@etiennea20/adr-misc` ;
`@etiennea20/adr-nest/excel` (XLSX) exige en plus `fflate` (≥ 0.8) :

```sh
pnpm add @etiennea20/adr-misc fflate
```

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
