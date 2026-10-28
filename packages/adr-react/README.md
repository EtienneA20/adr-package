# @etiennea20/adr-react

Composants et hooks React catégorisés : affichage de contenu, formulaires, interface générique,
routing, utilitaires de modèle CRUD, fetch (Axios, TanStack Query) et filtres.
ESM + CJS + types, modules marqués `"use client"`.

## Installation

Le package est publié sur GitHub Packages. Dans le projet consommateur, un fichier `.npmrc`
doit déclarer le registre du scope (voir le README du dépôt) :

```ini
@etiennea20:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NPM_TOKEN}
```

Puis :

```sh
pnpm add @etiennea20/adr-react
```

peerDependencies : `react` et `react-dom` (≥ 18). Selon les sous-chemins utilisés :

| Import                          | À installer en plus              |
| ------------------------------- | -------------------------------- |
| `@etiennea20/adr-react`         | rien                             |
| `@etiennea20/adr-react/fetch`   | `axios`, `@tanstack/react-query` |
| `@etiennea20/adr-react/routing` | `react-router` (≥ 7)             |

## Exemple minimal

```tsx
import { VisuallyHidden } from "@etiennea20/adr-react";

export function CloseButton({ onClose }: { onClose: () => void }) {
  return (
    <button type="button" onClick={onClose}>
      <span aria-hidden="true">×</span>
      <VisuallyHidden>Fermer la fenêtre</VisuallyHidden>
    </button>
  );
}
```

## Documentation

- Inventaire complet des éléments publics : [SKILLS.md](./SKILLS.md).
- Démos live et documentation : section « adr-react » de la documentation (`apps/docs` du dépôt).
