---
skill: adr-ui-design
description: >-
  À utiliser pour concevoir, styliser ou relire une interface (application React, page de
  documentation, tableau de bord) selon les conventions d'UI adr : palette à neutres chauds,
  accent corail et une couleur par section (bleu, rouge, vert), mode clair et sombre à deux
  états sans suivi du système, interface épurée sans dégradés, responsive mobile et accessible.
  Donne les tokens CSS (couleurs, rayons, typographie), le thème par section, les règles des
  composants (navbar, barre latérale, boutons, cartes, badges, code, tableaux) et une checklist.
---

# Conventions d'UI adr

Conventions visuelles communes aux interfaces des projets @etiennea20, appliquées par la
documentation du monorepo adr-package (`apps/docs/src/css/custom.css`, implémentation de
référence). À suivre pour toute nouvelle interface, et pour relire une interface existante.

## Principes

1. **Épuré** : aplats de couleur et bordures fines de 1 px. L'information prime sur la décoration.
2. **Interdits** : dégradés (fonds, textes, boutons, logos), halos flous, verre dépoli, ombres
   portées décoratives, effets qui suivent le pointeur, cartes qui se soulèvent au survol,
   animations d'apparition, liseré coloré à gauche des cartes, emoji utilisés comme icônes.
3. **Couleur avec parcimonie** : un seul accent par écran (celui de la section). Les neutres
   portent le reste.
4. **Deux modes, choisis par l'utilisateur** : clair (par défaut) et sombre. Le thème du système
   n'est **jamais** suivi, la bascule n'a que deux états.
5. **Mobile d'abord** : tout écran fonctionne à 360 px de large, sans défilement horizontal de
   la page.
6. **Accessible** : contraste du texte ≥ 4,5:1, cibles tactiles ≥ 44 px, focus visible, liens
   soulignés.

## Tokens

Tous les styles passent par des variables CSS préfixées `--adr-`. Ne jamais écrire une couleur
en dur dans un composant.

### Neutres (communs à toutes les sections)

| Token           | Rôle                                     | Clair     | Sombre    |
| --------------- | ---------------------------------------- | --------- | --------- |
| `--adr-bg`      | Fond de page (blanc beige / brun noir)   | `#faf6f0` | `#171412` |
| `--adr-surface` | Navbar, cartes, champs                   | `#fffdfa` | `#1f1b18` |
| `--adr-muted`   | Pied de page, en-têtes de tableau        | `#f2ece3` | `#28231f` |
| `--adr-border`  | Toutes les bordures et séparateurs       | `#e5ddd1` | `#38312b` |
| `--adr-text`    | Texte principal, titres                  | `#2a241f` | `#eee7de` |
| `--adr-text-2`  | Texte secondaire, liens de menu inactifs | `#6b6158` | `#a99f94` |
| `--adr-code-bg` | Fond des blocs et du code en ligne       | `#f2ece3` | `#221e1b` |

### Palettes d'accent

Chaque palette a cinq rôles : `<p>` (aplat), `<p>-text` (texte et liens, ≥ 4,5:1 sur le fond),
`<p>-hover` (survol d'un aplat), `<p>-soft` (fond teinté) et `<p>-contrast` (texte posé sur
l'aplat).

| Palette | Usage               | Mode   | Aplat     | Texte     | Survol    | Teinté    | Sur l'aplat |
| ------- | ------------------- | ------ | --------- | --------- | --------- | --------- | ----------- |
| `coral` | Accueil, navigation | clair  | `#e8735a` | `#b5452e` | `#ec8670` | `#fbe6de` | `#2a241f`   |
| `coral` |                     | sombre | `#f08b70` | `#f08b70` | `#f39c85` | `#3a2520` | `#171412`   |
| `react` | Section adr-react   | clair  | `#2160c4` | `#2160c4` | `#1c53ab` | `#e3ecfa` | `#fff`      |
| `react` |                     | sombre | `#7aaef5` | `#7aaef5` | `#92bdf7` | `#1d2a3f` | `#171412`   |
| `nest`  | Section adr-nest    | clair  | `#b3242c` | `#b3242c` | `#9c1f26` | `#f9e2e1` | `#fff`      |
| `nest`  |                     | sombre | `#f26d73` | `#f26d73` | `#f5868b` | `#3a1e21` | `#171412`   |
| `misc`  | Section adr-misc    | clair  | `#2b7548` | `#2b7548` | `#24653e` | `#e2f1e6` | `#fff`      |
| `misc`  |                     | sombre | `#6cc48e` | `#6cc48e` | `#85cfa1` | `#1d3326` | `#171412`   |

Points d'attention :

- En clair, le corail pur (`#e8735a`) ne passe pas le contraste en texte : il sert aux aplats
  (avec du texte sombre dessus), `--adr-coral-text` sert au texte.
- Le survol d'un aplat s'éloigne toujours de la couleur de son texte (plus foncé sous du texte
  blanc, plus clair sous du texte sombre) : le contraste ne baisse jamais au survol.
- Corail et rouge restent distincts : le corail tire vers l'orange, le rouge de nest vers le
  carmin. Ne pas les rapprocher.
- Pour une nouvelle section : une teinte nouvelle, déclinée dans les cinq rôles et pour les deux
  modes, avec un contraste du texte vérifié (≥ 4,5:1 sur `--adr-bg` et sur `--adr-*-soft`).

### Forme et typographie

| Token / règle            | Valeur                                                                  |
| ------------------------ | ----------------------------------------------------------------------- |
| `--adr-radius`           | `0.625rem` : cartes, tableaux, blocs de code                            |
| `--adr-radius-sm`        | `0.4rem` : boutons, éléments de menu, pastilles d'icône                 |
| Pilules (badges)         | `999px`                                                                 |
| `--adr-duration`         | `150ms`, transitions de couleur et de bordure uniquement                |
| Police de texte          | `system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial` |
| Police de code           | `ui-monospace, "Cascadia Code", "JetBrains Mono", Menlo, Consolas`      |
| Titre principal          | `clamp(2.2rem, 6vw, 3.5rem)`, graisse 750, `letter-spacing: -0.035em`   |
| Titres de page / section | graisse 700, `letter-spacing` entre `-0.025em` et `-0.015em`            |
| Surtitre                 | `0.8rem`, majuscules, `letter-spacing: 0.08em`, couleur `accent-text`   |

## Mise en place

### Accent courant et thème par section

L'accent courant (`--adr-accent*`) est corail par défaut. La section active est exposée sur
`<html data-adr-section="…">`, qui remappe l'accent vers la palette de la section :

```css
html {
  --adr-accent: var(--adr-coral);
  --adr-accent-text: var(--adr-coral-text);
  --adr-accent-hover: var(--adr-coral-hover);
  --adr-accent-soft: var(--adr-coral-soft);
  --adr-accent-contrast: var(--adr-coral-contrast);
}

html[data-adr-section="react"] {
  --adr-accent: var(--adr-react);
  --adr-accent-text: var(--adr-react-text);
  --adr-accent-hover: var(--adr-react-hover);
  --adr-accent-soft: var(--adr-react-soft);
  --adr-accent-contrast: var(--adr-react-contrast);
}
```

- Les composants n'utilisent que `--adr-accent*` : ils changent de couleur avec la section, sans
  connaître la section.
- Poser l'attribut **au rendu serveur** quand c'est possible (sinon, avant le premier rendu) :
  une page ne doit pas s'afficher en corail puis basculer dans sa couleur.
- Un élément qui représente un autre package que la section courante (carte de l'accueil,
  pastille du menu) utilise directement la palette de ce package (`--adr-react-text`…).

### Mode clair / sombre

- Les tokens clairs sont déclarés sur `:root`, les tokens sombres sur `html[data-theme="dark"]`.
  Les palettes d'accent ont leurs deux versions, l'accent courant suit sans code supplémentaire.
- La bascule n'a que deux états. Valeur par défaut : `light`. Ne jamais lire
  `prefers-color-scheme`.
- Le choix est mémorisé (`localStorage`, protégé par `try`/`catch`) et appliqué **avant** le
  rendu, par un court script en tête de page, pour éviter un flash de la mauvaise couleur.
- Le bouton est une icône (soleil en clair, lune en sombre) dans un `<button>` bordé, avec un
  `aria-label` qui décrit l'action.

```tsx
import { useState, type ReactElement } from "react";

type ColorMode = "light" | "dark";

/** Bascule clair / sombre à deux états, sans suivre le thème du système. */
export function ColorModeToggle(): ReactElement {
  const [mode, setMode] = useState<ColorMode>(() =>
    document.documentElement.dataset.theme === "dark" ? "dark" : "light",
  );
  const next: ColorMode = mode === "dark" ? "light" : "dark";

  const toggle = (): void => {
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Stockage indisponible (navigation privée) : le choix vaut pour la session.
    }
    setMode(next);
  };

  return (
    <button
      type="button"
      className="adr-icon-button"
      onClick={toggle}
      aria-label={next === "dark" ? "Passer en mode sombre" : "Passer en mode clair"}
    >
      {mode === "dark" ? <MoonIcon aria-hidden /> : <SunIcon aria-hidden />}
    </button>
  );
}
```

`SunIcon` et `MoonIcon` sont les icônes SVG en trait du projet. L'exemple lit `document` à
l'initialisation : avec un rendu serveur, partir de `"light"` et synchroniser dans un effet.

## Composants

### Navbar

- Fond `--adr-surface`, hauteur `3.75rem`, et **filet inférieur de 3 px** en `--adr-accent` :
  c'est le repère principal de la section.
- Logo : carré arrondi corail en aplat, lettre en `--adr-coral-contrast`. Pas de dégradé.
- Liens : `--adr-text-2`, graisse 500. Survol : `--adr-text`. Lien actif : `--adr-accent-text`,
  graisse 600, soulignement plein de 2 px en `--adr-accent` sous le texte.
- Un lien vers une section est précédé d'une pastille ronde de `0.45rem` dans la couleur de la
  section (même dans le menu mobile).
- À droite : liens externes en icône, puis la bascule de thème, **toujours visible**, y compris
  sur mobile.

### Barre latérale et menus

- Élément : rayon `--adr-radius-sm`, texte `--adr-text-2`.
- Survol : fond `--adr-muted`. Élément actif : fond `--adr-accent-soft`, texte
  `--adr-accent-text`, graisse 600. Pas de barre verticale colorée.
- Titres de catégorie : `--adr-text`, graisse 600.

### Boutons

| Variante   | Fond                                   | Bordure                                | Texte                   |
| ---------- | -------------------------------------- | -------------------------------------- | ----------------------- |
| Primaire   | `--adr-accent` (survol `accent-hover`) | identique au fond                      | `--adr-accent-contrast` |
| Secondaire | `--adr-surface`                        | `--adr-border` (survol `--adr-text-2`) | `--adr-text`            |
| Icône      | transparent                            | `--adr-border`                         | `--adr-text-2`          |

- Graisse 600, rayon `--adr-radius-sm`, hauteur minimale 44 px pour les actions principales.
- Un seul bouton primaire par zone. Pas de déplacement ni d'ombre au survol : seules la couleur
  et la bordure changent.

### Cartes

- Fond `--adr-surface`, bordure `--adr-border`, rayon `0.875rem`, padding `1.5rem`.
- Survol d'une carte cliquable : la bordure prend l'accent. Rien d'autre (pas de translation,
  pas d'ombre, pas de halo).
- Icône : pastille carrée de `2.5rem`, fond `-soft`, pictogramme en trait (`stroke`) couleur
  `-text`. Toute la carte est un seul lien (`<a>`).

### Badges, code, tableaux, liens

- **Badge** : pilule, fond `--adr-accent-soft`, texte `--adr-accent-text`, `0.8rem`, graisse 600
  (ex. nom du package en tête de page).
- **Code** : fond `--adr-code-bg`, bordure `--adr-border`. Code en ligne : padding
  `0.1rem 0.35rem`, rayon `--adr-radius-sm`.
- **Tableaux** : bordure extérieure et séparateurs de lignes en `--adr-border`, en-tête sur
  `--adr-muted`, pas de rayures. Sur mobile, le tableau défile **dans sa boîte**
  (`overflow-x: auto`), jamais la page.
- **Liens dans le texte** : `--adr-accent-text`, **toujours soulignés** (épaisseur 1 px,
  `text-underline-offset: 0.2em`). La couleur seule ne suffit pas à les distinguer.
- **Sélection** : fond `--adr-accent-soft`. **Focus** : `outline: 2px solid var(--adr-accent-text)`
  avec `outline-offset: 2px`, sur `:focus-visible`.

## Responsive

| Largeur  | Comportement                                                                                                            |
| -------- | ----------------------------------------------------------------------------------------------------------------------- |
| > 996 px | Navbar complète, barre latérale fixe, table des matières à droite                                                       |
| ≤ 996 px | Menu burger : tiroir avec les sections (pastilles) puis le menu de la section ; la bascule de thème reste dans la barre |
| ≤ 600 px | Boutons d'action pleine largeur et empilés, blocs de commande pleine largeur, hero resserré                             |

- Cibles tactiles : 44 × 44 px minimum (burger, bascule, éléments de menu).
- Grilles en `repeat(auto-fit, minmax(16rem, 1fr))` : elles passent sur une colonne sans media
  query.
- Tailles de titre fluides (`clamp`) plutôt que des paliers.

## Accessibilité et mouvement

- Contraste ≥ 4,5:1 pour tout texte, y compris le texte secondaire et les petits libellés ; les
  valeurs du tableau des palettes respectent ce seuil sur `--adr-bg` et sur les fonds teintés.
- Deux couleurs à distinguer diffèrent aussi par la luminosité ou par un repère (texte, pastille,
  soulignement), jamais par la teinte seule.
- Icône seule : `aria-label` sur le bouton, `aria-hidden` sur le SVG.
- Animations : aucune animation d'apparition. Les transitions de couleur (150 ms) sont
  neutralisées par un bloc `@media (prefers-reduced-motion: reduce)`.

## Checklist de relecture

- [ ] Aucune couleur en dur : tout passe par `--adr-*`, et les composants n'utilisent que
      `--adr-accent*` pour l'accent.
- [ ] Les deux modes sont vérifiés ; la bascule a deux états et ignore le système.
- [ ] La page s'affiche directement dans la couleur de sa section (pas de flash corail).
- [ ] Aucun dégradé, halo, ombre décorative, soulèvement au survol ni animation d'apparition.
- [ ] Contraste ≥ 4,5:1 partout, liens soulignés, focus visible.
- [ ] À 360 px : pas de défilement horizontal, cibles ≥ 44 px, bascule visible.
