---
name: adr-misc
description: "À utiliser pour développer ou utiliser @etiennea20/adr-misc : utilitaires TypeScript partagés entre front (navigateur) et back (Node, NestJS) : fonctions de parsing (dates avec dayjs, durées, nombres), utilitaires de base (assertions, garde-fous), énumérations (jours, mois…). Donne l'inventaire des fonctions et énumérations publiques, leur signature, leurs erreurs et un exemple d'utilisation."
metadata:
  generated-by: adr-package/install-skills
  source: packages/adr-misc/SKILLS.md
---

<!-- Généré par `pnpm run install:skills` à partir de packages/adr-misc/SKILLS.md, ne pas modifier à la main. -->

# @etiennea20/adr-misc

Utilitaires sans dépendance d'environnement, utilisables dans le navigateur comme dans Node
(ESM et CJS). Aucune dépendance React ni NestJS.

- Point d'entrée unique : `@etiennea20/adr-misc`.
- `dayjs` est une peerDependency : le projet consommateur l'installe et configure ses plugins
  (`dayjs.extend`) une seule fois ; les fonctions du package utilisent cette même instance.
- Catégories : `core` (utilitaires de base), `parsing` (dates, durées, nombres), `enums`
  (énumérations `as const` préfixées par `E`).

## Catégories

- [core](reference.md#core) : utilitaires de base (assertions, garde-fous)
  - [`invariant`](reference.md#invariant)
- `parsing` : fonctions de parsing (dayjs, temps…) (aucun élément pour l'instant)
- `enums` : énumérations (jours, mois…) (aucun élément pour l'instant)

## Retrouver un élément

- L'inventaire complet est dans [reference.md](reference.md) : une entrée
  `` ### `NomExporté` `` par élément public (signature, paramètres, retour, erreurs, exemple,
  point d'entrée, statut, version d'introduction, fichiers source et test).
- Importer uniquement depuis le « Point d'entrée » indiqué, jamais depuis un chemin interne.
- Les chemins « Source » et « Tests » sont relatifs au package (`packages/adr-misc/`
  dans le monorepo adr-package).
- Pour modifier le package : lire d'abord `packages/adr-misc/CLAUDE.md` et le
  `CLAUDE.md` racine du monorepo.
