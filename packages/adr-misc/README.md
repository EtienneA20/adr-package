# @etiennea20/adr-misc

Utilitaires TypeScript partagés entre le front (navigateur) et le back (Node, NestJS) :
parsing (dates avec dayjs, durées, nombres), utilitaires de base et énumérations.
Fonctionne en ESM et en CJS, sans API propre à un environnement.

## Installation

Le package est publié sur GitHub Packages. Dans le projet consommateur, un fichier `.npmrc`
doit déclarer le registre du scope (voir le README du dépôt) :

```ini
@etiennea20:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NPM_TOKEN}
```

Puis :

```sh
pnpm add @etiennea20/adr-misc dayjs
```

`dayjs` (≥ 1.11) est une peerDependency : votre projet en fournit l'instance (et ses plugins).

## Exemple minimal

```ts
import { invariant } from "@etiennea20/adr-misc";

function getUser(id: string) {
  const user = users.find((candidate) => candidate.id === id);
  invariant(user, `Utilisateur ${id} introuvable`);
  return user; // type affiné : plus de `undefined`
}
```

## Documentation

- Inventaire complet des éléments publics : [SKILLS.md](./SKILLS.md).
- Guides et référence API : section « adr-misc » de la documentation (`apps/docs` du dépôt).
