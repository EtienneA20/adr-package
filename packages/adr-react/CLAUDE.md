# CLAUDE.md : `@etiennea20/adr-react`

Complète le `CLAUDE.md` racine (à lire d'abord), puis lire `SKILLS.md` de ce package.

## Rôle

Composants React, hooks et utilitaires front, classés par catégorie. Démo live de chaque
composant dans `apps/docs` (section adr-react).

## Build et points d'entrée

- tsup : ESM (`.js`) + CJS (`.cjs`) + types (`.d.ts` / `.d.cts`), bannière `"use client"` sur
  chaque fichier, `sideEffects: false`. Les peerDependencies sont `external`.
- Points d'entrée (`exports` de package.json, `entry` de tsup.config.ts) :

| Spécificateur                   | Source                 | Catégories                               |
| ------------------------------- | ---------------------- | ---------------------------------------- |
| `@etiennea20/adr-react`         | `src/index.ts`         | content-display, form, ui, crud, filters |
| `@etiennea20/adr-react/fetch`   | `src/fetch/index.ts`   | fetch (axios, @tanstack/react-query)     |
| `@etiennea20/adr-react/routing` | `src/routing/index.ts` | routing (react-router)                   |

- **Règle des sous-chemins** : une catégorie qui importe une peerDependency **optionnelle** a son
  propre sous-chemin et n'est **jamais** réexportée par `src/index.ts`. Sinon, un projet qui
  n'a pas installé cette dépendance casserait dès l'import du point d'entrée principal. ESLint
  l'impose (`optionalPeers` dans `eslint.config.js`).
- Ajouter un sous-chemin = modifier **ensemble** `exports` (package.json), `entry`
  (tsup.config.ts), `optionalPeers` (eslint.config.js), ce fichier et `SKILLS.md`. Demander
  avant d'en créer un.

## Dépendances

- peerDependencies : `react` et `react-dom` (≥ 18) ; optionnelles : `axios` (≥ 1),
  `@tanstack/react-query` (≥ 5), `react-router` (≥ 7, testé en 8).
- Ne pas ajouter de dépendance directe (`dependencies`) : tout ce qui touche React passe en
  peerDependency. Demander avant tout ajout.

## Catégories

| Dossier                | Contenu                                                              |
| ---------------------- | -------------------------------------------------------------------- |
| `src/content-display/` | Affichage de contenu (listes, tableaux, cartes, états vides…)        |
| `src/form/`            | Champs, hooks et helpers de formulaire                               |
| `src/ui/`              | Interface générique (boutons, accessibilité, mise en page…)          |
| `src/crud/`            | Utilitaires de modèle CRUD (types, hooks de liste/détail sans fetch) |
| `src/filters/`         | Méthodes de filtre (prédicats, tri, recherche) et leurs hooks        |
| `src/fetch/`           | Surcharge de fetch : hooks, Axios, TanStack Query (sous-chemin)      |
| `src/routing/`         | Utilitaires de routing basés sur react-router (sous-chemin)          |

Une catégorie n'est réexportée par son point d'entrée qu'avec son premier élément. Si un élément
de `crud` ou `filters` a besoin d'une peerDependency optionnelle, il va dans la catégorie du
sous-chemin correspondant (ou on crée un sous-chemin, après accord). Si une catégorie dépasse
une quinzaine d'éléments, proposer de la diviser.

## Composants : règles

- Composant = fonction nommée en `PascalCase`, props typées par une interface exportée
  `I<Composant>Props`, **chaque prop documentée** en TSDoc. Retour typé `ReactElement`.
- Hooks : `useXxx`, règles des hooks respectées (ESLint `react-hooks`).
- Accessibilité d'abord : éléments HTML natifs et rôles ARIA corrects (ESLint `jsx-a11y` en
  mode strict). Le nom accessible de chaque contrôle doit être testé.
- Pas de dépendance CSS imposée : styles inline minimaux ou `className` passé par le consommateur.
- Pas d'accès à `window` / `document` au chargement du module (compatibilité SSR) : uniquement
  dans des effets ou des gestionnaires d'évènements.

## Tests

- Vitest + jsdom + Testing Library (`vitest.setup.ts` charge `@testing-library/jest-dom/vitest`
  et démonte les rendus après chaque test).
- Interactions avec `userEvent.setup()` puis `await user.click(...)`, jamais `fireEvent`.
- Requêtes par rôle et nom accessible (`getByRole("button", { name: "…" })`) en priorité.
- Hooks : `renderHook` de `@testing-library/react`. Réseau : mocker axios / `fetch` avec `vi`.

## Pièges connus

- La bannière `"use client"` est ajoutée par tsup : ne pas l'écrire dans les sources.
- `clip` est déprécié dans les types CSS : utiliser `clipPath`.
- `react.configs.flat` de eslint-plugin-react et jsx-a11y imposent ESLint 9 (pas 10).

## Élément de référence

`src/ui/visually-hidden/` : modèle à suivre (props documentées, TSDoc complet, tests de rendu,
d'interaction et d'accessibilité, entrées SKILLS.md du composant et de ses props).
