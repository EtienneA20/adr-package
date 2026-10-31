# adr-package

Monorepo des packages npm personnels du scope `@etiennea20`, publiés sur **GitHub Packages**.

| Package                                         | Rôle                                                                         |
| ----------------------------------------------- | ---------------------------------------------------------------------------- |
| [`@etiennea20/adr-react`](packages/adr-react)   | Composants et hooks React catégorisés (ESM + CJS, `"use client"`)            |
| [`@etiennea20/adr-nest`](packages/adr-nest)     | Utilitaires NestJS : droits, filtrage, export Excel et JSON (CJS)            |
| [`@etiennea20/adr-misc`](packages/adr-misc)     | Utilitaires partagés front et back : parsing, base, énumérations (ESM + CJS) |
| [`@etiennea20/config`](packages/config) (privé) | Configuration ESLint, Vitest et TSDoc partagée                               |
| [`apps/docs`](apps/docs) (privé)                | Documentation Docusaurus : démos live adr-react, guides et référence API     |

Outillage : pnpm 12 (workspaces + catalog), Turborepo, Changesets, tsup / tsc, Vitest,
ESLint 9 + Prettier, Husky + lint-staged + commitlint, TypeScript 6.

Les règles de développement (conventions, TSDoc, tests, définition de « terminé ») sont dans
[CLAUDE.md](CLAUDE.md), complété par un `CLAUDE.md` par package.

## Prérequis (Windows 11)

- **Node.js 22 LTS ou plus** : `winget install OpenJS.NodeJS.LTS`.
- **pnpm 12.16.1** (version fixée par le champ `packageManager`) :
  `npm install -g pnpm@12.16.1`. Si une autre version est installée, pnpm télécharge
  automatiquement la bonne (`devEngines`).
- **Git for Windows** (fournit le shell utilisé par les hooks Husky, sous PowerShell comme
  sous Git Bash).
- VS Code : accepter les extensions recommandées (`.vscode/extensions.json`) : ESLint,
  Prettier, EditorConfig, Vitest, MDX.

Les fins de ligne sont forcées en LF par `.gitattributes` : aucun réglage `core.autocrlf`
n'est nécessaire.

## Installation

```powershell
git clone https://github.com/EtienneA20/adr-package.git
cd adr-package
pnpm install   # installe aussi les hooks Git (script prepare)
pnpm build
```

## Scripts

| Commande                          | Rôle                                                                       |
| --------------------------------- | -------------------------------------------------------------------------- |
| `pnpm dev`                        | Packages en watch + doc sur http://localhost:3000                          |
| `pnpm build`                      | Build de tous les packages (avec leurs skills embarqués) et de la doc      |
| `pnpm lint`                       | ESLint sur tous les projets et la racine, `--max-warnings=0`               |
| `pnpm format` / `format:check`    | Prettier en écriture / en vérification                                     |
| `pnpm typecheck`                  | `tsc --noEmit` dans chaque projet                                          |
| `pnpm test`                       | Vitest avec couverture (seuil 90 %)                                        |
| `pnpm check:skills`               | Chaque export public a un TSDoc complet et une entrée dans `SKILLS.md`     |
| `pnpm run install:skills`         | Régénère `.claude/skills/` (et les `bin/` des packages) depuis `SKILLS.md` |
| `pnpm run install:skills --check` | Échoue si `.claude/skills/` n'est pas synchronisé (CI)                     |
| `pnpm changeset`                  | Décrit un changement de version                                            |

Écrire `pnpm run install:skills`, et non `pnpm install:skills`, pour ne pas confondre avec
`pnpm install`. Options : `--global` (`~/.claude/skills`), `--target <projet>`,
`--package <nom>`.

## Contribuer

1. Créer une branche depuis `main` (`feat/…`, `fix/…`, `docs/…`, `chore/…`).
2. Développer en suivant [CLAUDE.md](CLAUDE.md) et le `CLAUDE.md` du package.
3. Commits au format **Conventional Commits**, type en anglais et description en français :
   `feat(adr-react): ajoute le composant DataTable`. Le hook `commit-msg` refuse les autres
   formats ; le hook `pre-commit` lance ESLint et Prettier sur les fichiers indexés et
   régénère les skills si un `SKILLS.md` a changé.
4. Ajouter un **changeset** dès qu'un package publié change : `pnpm changeset`.
5. Ouvrir une pull request vers `main`, avec un titre au format Conventional Commits. La CI
   (`ci.yml`) vérifie titre, commits, changeset, format, lint, types, tests, skills et build.
6. Fusionner (squash possible : le titre de la PR devient le message du commit).

## Publication

- Chaque merge dans `main` déclenche `release.yml` : s'il reste des changesets,
  `changesets/action` ouvre ou met à jour la PR **« chore: version des packages »** (versions,
  CHANGELOG).
- Le merge de cette PR relance `release.yml`, qui exécute `pnpm release` (build des packages
  puis `changeset publish`) et publie sur GitHub Packages avec le `GITHUB_TOKEN` du workflow.
- Versionnage indépendant par package. Les packages privés (`config`, `docs`) ne sont jamais
  versionnés ni publiés.
- `docs-image.yml` construit l'image Docker de la doc et la pousse sur
  `ghcr.io/etiennea20/adr-docs` (tags : SHA du commit et `latest`, 5 versions conservées).
  `apps/docs/compose.yaml` l'exécute (`docker compose -f apps/docs/compose.yaml up -d --wait`).
  Le déploiement automatique n'est pas encore défini.

## Utiliser un package dans un autre projet

GitHub Packages exige une authentification, même pour lire.

1. Créer un token GitHub (classic) avec le scope `read:packages` : Settings → Developer
   settings → Personal access tokens.
2. Le rendre disponible dans l'environnement, **jamais en dur dans un fichier** :

   ```powershell
   # Session courante
   $env:NPM_TOKEN = "ghp_..."
   # Ou de façon permanente pour l'utilisateur Windows
   [Environment]::SetEnvironmentVariable("NPM_TOKEN", "ghp_...", "User")
   ```

3. Ajouter un `.npmrc` à la racine du projet consommateur (il peut être commité : il ne
   contient que la référence à la variable) :

   ```ini
   @etiennea20:registry=https://npm.pkg.github.com
   //npm.pkg.github.com/:_authToken=${NPM_TOKEN}
   ```

4. Installer : `pnpm add @etiennea20/adr-react` (voir le README de chaque package pour les
   peerDependencies).

En CI GitHub Actions, utiliser `NPM_TOKEN: ${{ secrets.GITHUB_TOKEN }}` avec la permission
`packages: read`, après avoir donné l'accès au dépôt consommateur dans les réglages du package
(Package settings → Manage Actions access).

### Installer les skills Claude Code d'un package

Chaque package publié embarque son skill Claude Code (inventaire de ses éléments publics).
Aucune installation automatique : depuis la racine du projet consommateur,

```powershell
pnpm exec adr-react-skills            # → .claude/skills/adr-react/
pnpm exec adr-nest-skills --global    # → ~/.claude/skills/adr-nest/
```

ou, dans le `package.json` du projet consommateur :

```json
{ "scripts": { "install:skills": "adr-react-skills && adr-misc-skills" } }
```

Relancer la commande après une mise à jour du package. Un dossier de skill existant qui n'a
pas été généré par adr-package n'est jamais écrasé.

## Réglages manuels à faire sur GitHub

### Maintenant (dépôt privé, offre gratuite)

1. **Settings → Actions → General → Workflow permissions** : cocher **« Allow GitHub Actions
   to create and approve pull requests »** (nécessaire à la PR « chore: version des
   packages »). Les permissions par défaut peuvent rester en lecture : chaque workflow
   déclare les siennes.
2. **Settings → General → Pull Requests** : autoriser le **squash merge** avec « Default
   commit message : Pull request title », et cocher **« Automatically delete head branches »**.
3. **Settings → Code security** : activer les **Dependabot alerts** et les **Dependabot
   security updates** (les mises à jour de version sont configurées par
   `.github/dependabot.yml`).
4. Après la **première publication** de chaque package (onglet Packages du profil) :
   vérifier qu'il est lié au dépôt `adr-package` et que le dépôt a l'accès **Write** dans
   « Manage Actions access ».
5. Après le **premier push de l'image** `adr-docs` : dans les réglages du package conteneur,
   donner au dépôt l'accès **Admin** dans « Manage Actions access » (nécessaire au nettoyage
   des anciennes versions par `actions/delete-package-versions`).
6. Aucun secret à créer : tous les workflows utilisent `GITHUB_TOKEN`.

À savoir : une PR créée par `GITHUB_TOKEN` (la PR « chore: version des packages ») ne
déclenche pas les workflows `pull_request`. Elle n'a donc pas de checks CI : c'est attendu,
elle ne contient que des versions et des CHANGELOG.

### Quotas de l'offre gratuite (dépôt privé)

- **≈ 2 000 minutes d'Actions par mois** : la CI tient en un seul job principal, ne relance que
  les projets touchés (`turbo --affected`) et réutilise le cache Turborepo et pnpm ;
  `docs-image.yml` ne tourne que si la doc ou les packages changent.
- **500 Mo de stockage Packages** (partagé avec les artefacts Actions) : aucun artefact n'est
  téléversé et seules les 5 dernières versions de l'image `adr-docs` sont conservées.
- Les runners auto-hébergés ne sont pas utilisés pour le lint, les tests ou le build.

### Le jour où le dépôt passe en public ou en offre payante

La protection de branche n'est pas disponible pour un dépôt privé en offre gratuite. Ensuite :

1. **Settings → Rules → Rulesets** (ou Branches) sur `main` :
   - exiger une pull request avant de fusionner (pas de push direct) ;
   - exiger les checks **« Lint, format, types, tests, skills, build »** et **« Titre de la PR
     (Conventional Commits) »**, et que la branche soit à jour ;
   - interdire les force push et la suppression de `main`.
2. La PR « chore: version des packages » n'ayant pas de checks (voir plus haut), soit
   l'exclure des checks requis via une règle de contournement, soit faire tourner
   `changesets/action` avec un token de GitHub App pour que la CI s'y exécute.

## Passer les packages en public

1. **Dépôt** : Settings → General → Danger Zone → Change visibility → Public.
2. **Packages GitHub** : pour chaque package, Package settings → Change visibility → Public.
   Attention : un package rendu public ne peut plus redevenir privé. Même public, un package
   GitHub Packages exige toujours un token pour être installé.
3. **Licence** : remplacer `"license": "UNLICENSED"` dans chaque `package.json` par la
   licence choisie et ajouter un fichier `LICENSE`.
4. **Migration éventuelle vers npmjs.com** (installation sans token) :
   - créer le compte ou l'organisation npm `etiennea20` (le scope doit correspondre) ;
   - dans `.changeset/config.json`, passer `"access"` à `"public"` ;
   - dans chaque `package.json`, passer `publishConfig.registry` à
     `https://registry.npmjs.org` (et ajouter `"access": "public"`) ;
   - dans `release.yml`, passer `registry-url` à `https://registry.npmjs.org` et utiliser le
     _trusted publishing_ npm (permission `id-token: write`) ou un secret `NPM_TOKEN` ;
   - côté consommateurs, supprimer la ligne `@etiennea20:registry=…` du `.npmrc`.
