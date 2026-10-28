---
name: adr-react
description: "À utiliser pour développer ou utiliser @etiennea20/adr-react : composants React, hooks et utilitaires front (affichage de contenu, formulaires, interface générique, routing, modèles CRUD, fetch avec Axios et TanStack Query, filtres). Donne l'inventaire des éléments publics, leur signature, leurs props, leur point d'entrée et un exemple d'utilisation."
metadata:
  generated-by: adr-package/install-skills
  source: packages/adr-react/SKILLS.md
---

<!-- Généré par `pnpm run install:skills` à partir de packages/adr-react/SKILLS.md, ne pas modifier à la main. -->

# @etiennea20/adr-react

Bibliothèque de composants et de hooks React (≥ 18) publiée sur GitHub Packages.

- Point d'entrée principal : `@etiennea20/adr-react` (aucune dépendance hors React).
- Les catégories qui dépendent d'une peerDependency optionnelle ont leur propre sous-chemin :
  `@etiennea20/adr-react/fetch` (axios, @tanstack/react-query) et
  `@etiennea20/adr-react/routing` (react-router).
- Tous les modules sont marqués `"use client"` (compatibles React Server Components).
- Catégories : `content-display`, `form`, `ui`, `crud`, `filters` (point d'entrée principal),
  `fetch` et `routing` (sous-chemins).

## Catégories

- `content-display` : affichage de contenu (aucun élément pour l'instant)
- `form` : composants et hooks de formulaire (aucun élément pour l'instant)
- [ui](reference.md#ui) : interface générique
  - [`VisuallyHidden`](reference.md#visuallyhidden)
  - [`IVisuallyHiddenProps`](reference.md#ivisuallyhiddenprops)
- `crud` : utilitaires de modèle CRUD (aucun élément pour l'instant)
- `filters` : méthodes de filtre (aucun élément pour l'instant)
- `fetch` (`@etiennea20/adr-react/fetch`) : hooks de fetch, Axios, TanStack Query (aucun
  élément pour l'instant)
- `routing` (`@etiennea20/adr-react/routing`) : utilitaires de routing (aucun élément pour
  l'instant)

## Retrouver un élément

- L'inventaire complet est dans [reference.md](reference.md) : une entrée
  `` ### `NomExporté` `` par élément public (signature, paramètres, retour, erreurs, exemple,
  point d'entrée, statut, version d'introduction, fichiers source et test).
- Importer uniquement depuis le « Point d'entrée » indiqué, jamais depuis un chemin interne.
- Les chemins « Source » et « Tests » sont relatifs au package (`packages/adr-react/`
  dans le monorepo adr-package).
- Pour modifier le package : lire d'abord `packages/adr-react/CLAUDE.md` et le
  `CLAUDE.md` racine du monorepo.
