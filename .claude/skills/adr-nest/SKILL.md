---
name: adr-nest
description: "À utiliser pour développer ou utiliser @etiennea20/adr-nest : utilitaires backend NestJS (décorateurs, guards, pipes, interceptors, services), gestion des droits et des routes publiques, filtrage avancé des requêtes, export Excel et JSON. Donne l'inventaire des éléments publics, leur signature, leurs erreurs et un exemple d'utilisation dans un module NestJS."
metadata:
  generated-by: adr-package/install-skills
  source: packages/adr-nest/SKILLS.md
---

<!-- Généré par `pnpm run install:skills` à partir de packages/adr-nest/SKILLS.md, ne pas modifier à la main. -->

# @etiennea20/adr-nest

Utilitaires pour applications NestJS (11 ou 12), compilés en CommonJS avec les métadonnées de
décorateurs (`emitDecoratorMetadata`).

- Point d'entrée unique : `@etiennea20/adr-nest`.
- peerDependencies : `@nestjs/common`, `@nestjs/core`, `reflect-metadata`, `rxjs`.
- Catégories : `core` (méthodes avancées NestJS), `rights` (gestion des droits), `filtering`
  (filtrage avancé), `export` (export Excel et JSON).

## Catégories

- `core` : méthodes avancées NestJS (aucun élément pour l'instant)
- [rights](reference.md#rights) : gestion des droits
  - [`Public`](reference.md#public)
  - [`IS_PUBLIC_KEY`](reference.md#is_public_key)
- `filtering` : filtrage avancé (aucun élément pour l'instant)
- `export` : export Excel et JSON (aucun élément pour l'instant)

## Retrouver un élément

- L'inventaire complet est dans [reference.md](reference.md) : une entrée
  `` ### `NomExporté` `` par élément public (signature, paramètres, retour, erreurs, exemple,
  point d'entrée, statut, version d'introduction, fichiers source et test).
- Importer uniquement depuis le « Point d'entrée » indiqué, jamais depuis un chemin interne.
- Les chemins « Source » et « Tests » sont relatifs au package (`packages/adr-nest/`
  dans le monorepo adr-package).
- Pour modifier le package : lire d'abord `packages/adr-nest/CLAUDE.md` et le
  `CLAUDE.md` racine du monorepo.
