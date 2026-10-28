<!-- Généré par `pnpm run install:skills` à partir de packages/adr-react/SKILLS.md, ne pas modifier à la main. -->

# SKILLS : @etiennea20/adr-react

## Introduction

Bibliothèque de composants et de hooks React (≥ 18) publiée sur GitHub Packages.

- Point d'entrée principal : `@etiennea20/adr-react` (aucune dépendance hors React).
- Les catégories qui dépendent d'une peerDependency optionnelle ont leur propre sous-chemin :
  `@etiennea20/adr-react/fetch` (axios, @tanstack/react-query) et
  `@etiennea20/adr-react/routing` (react-router).
- Tous les modules sont marqués `"use client"` (compatibles React Server Components).
- Catégories : `content-display`, `form`, `ui`, `crud`, `filters` (point d'entrée principal),
  `fetch` et `routing` (sous-chemins).

## Table des matières

- `content-display` : affichage de contenu (aucun élément pour l'instant)
- `form` : composants et hooks de formulaire (aucun élément pour l'instant)
- [ui](#ui) : interface générique
  - [`VisuallyHidden`](#visuallyhidden)
  - [`IVisuallyHiddenProps`](#ivisuallyhiddenprops)
- `crud` : utilitaires de modèle CRUD (aucun élément pour l'instant)
- `filters` : méthodes de filtre (aucun élément pour l'instant)
- `fetch` (`@etiennea20/adr-react/fetch`) : hooks de fetch, Axios, TanStack Query (aucun
  élément pour l'instant)
- `routing` (`@etiennea20/adr-react/routing`) : utilitaires de routing (aucun élément pour
  l'instant)

## ui

### `VisuallyHidden`

| Champ          | Valeur                                            |
| -------------- | ------------------------------------------------- |
| Catégorie      | `ui`                                              |
| Point d'entrée | `@etiennea20/adr-react`                           |
| Statut         | stable                                            |
| Depuis         | 0.1.0                                             |
| Source         | `src/ui/visually-hidden/visually-hidden.tsx`      |
| Tests          | `src/ui/visually-hidden/visually-hidden.test.tsx` |

**Signature**

```ts
function VisuallyHidden(props: IVisuallyHiddenProps): ReactElement;
```

**Description** : masque visuellement un contenu tout en le laissant accessible aux lecteurs
d'écran (technique « sr-only »). À utiliser pour nommer un bouton qui ne contient qu'une icône
ou ajouter une précision destinée aux technologies d'assistance.

**Paramètres** : `props`, voir [`IVisuallyHiddenProps`](#ivisuallyhiddenprops).

**Retour** : un `<span>` invisible à l'écran contenant `children`.

**Erreurs** : aucune.

**Exemple**

```tsx
import { VisuallyHidden } from "@etiennea20/adr-react";

<button type="button" onClick={onClose}>
  <CloseIcon aria-hidden />
  <VisuallyHidden>Fermer la fenêtre</VisuallyHidden>
</button>;
```

### `IVisuallyHiddenProps`

| Champ          | Valeur                                            |
| -------------- | ------------------------------------------------- |
| Catégorie      | `ui`                                              |
| Point d'entrée | `@etiennea20/adr-react`                           |
| Statut         | stable                                            |
| Depuis         | 0.1.0                                             |
| Source         | `src/ui/visually-hidden/visually-hidden.tsx`      |
| Tests          | `src/ui/visually-hidden/visually-hidden.test.tsx` |

**Signature**

```ts
interface IVisuallyHiddenProps {
  children: ReactNode;
  id?: string;
}
```

**Description** : props de [`VisuallyHidden`](#visuallyhidden).

**Paramètres** (props)

- `children` : contenu lu par les technologies d'assistance mais invisible à l'écran.
- `id` (optionnel) : identifiant HTML, pour référencer le texte depuis `aria-describedby` ou
  `aria-labelledby`.

**Retour** : sans objet (type).

**Erreurs** : aucune.

**Exemple**

```tsx
import type { IVisuallyHiddenProps } from "@etiennea20/adr-react";

const props: IVisuallyHiddenProps = { children: "Fermer la fenêtre", id: "close-label" };
```
