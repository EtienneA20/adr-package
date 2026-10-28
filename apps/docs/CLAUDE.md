# CLAUDE.md : `apps/docs`

Complète le `CLAUDE.md` racine (à lire d'abord).

## Rôle

Application Docusaurus **privée** (jamais publiée sur npm) : documentation des trois packages
dans une seule interface, avec un playground live pour `adr-react`.

| Section   | Dossier       | Contenu                                                                    |
| --------- | ------------- | -------------------------------------------------------------------------- |
| adr-react | `docs/react/` | Une page `.mdx` par composant / hook, rangée par catégorie, avec démo live |
| adr-nest  | `docs/nest/`  | Présentation, `guides/` (cas d'usage, application fictive), `api/` généré  |
| adr-misc  | `docs/misc/`  | Présentation, `guides/` (cas d'usage, application fictive), `api/` généré  |

## Commandes

- `pnpm --filter @etiennea20/docs dev` : serveur de dev (http://localhost:3000). Avec
  `pnpm dev` à la racine, les packages sont recompilés en watch et la doc se recharge.
- `pnpm --filter @etiennea20/docs build` : build statique dans `build/`.

## Règles

- **adr-react** : chaque composant public a sa page `docs/react/<categorie>/<element>.mdx`
  avec au moins une démo en bloc ` ```jsx live ` (pas de TypeScript dans les blocs live), le
  tableau des props et les cas où ne pas l'utiliser. Les exports de `@etiennea20/adr-react`
  et React (hooks compris) sont dans la portée des blocs live via
  `src/theme/ReactLiveScope/index.tsx`. Un composant d'un sous-chemin (`./fetch`,
  `./routing`) doit être ajouté explicitement à cette portée.
- **adr-nest / adr-misc** : un guide par élément ou cas d'usage dans `docs/<section>/guides/`,
  avec un exemple d'utilisation dans une application **fictive** (par convention :
  « Bibliothèque »). La référence API (`docs/<section>/api/`) est **générée** par
  `docusaurus-plugin-typedoc` depuis le TSDoc à chaque `dev` / `build` : ne jamais l'éditer,
  elle est ignorée par Git et Prettier.
- Libellés de la référence API en français (`lang: "fr"` + `locales` dans
  `docusaurus.config.ts` pour les tags non traduits par typedoc).
- `onBrokenLinks: "throw"` : un lien cassé fait échouer le build.

## Pièges connus

- Pas de `"type": "module"` dans `package.json` : Docusaurus 3 échoue alors au build
  (`require.resolveWeak is not a function`). D'où `eslint.config.mjs`.
- `docusaurus.config.ts` est linté via le projet par défaut de typescript-eslint : ne pas
  l'ajouter à `include` dans tsconfig.json.
- Les dossiers de `src/theme/` portent le nom PascalCase du composant surchargé (swizzling).

## Docker

- `Dockerfile` multi-stage, **contexte = racine du dépôt** :
  `docker build -f apps/docs/Dockerfile -t adr-docs .`
- Étapes : `turbo prune --docker` → `pnpm install --frozen-lockfile` (en cache) → build →
  nginx non-root (`nginx-unprivileged`, port 8080), healthcheck sur `/healthz`.
- `tsconfig.base.json` est copié à part : `turbo prune` ne copie que les workspaces.
- L'image est construite et poussée sur GHCR par `.github/workflows/docs-image.yml`. Le
  déploiement n'est pas encore défini.
