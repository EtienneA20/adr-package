# CLAUDE.md : `@etiennea20/adr-misc`

Complète le `CLAUDE.md` racine (à lire d'abord), puis lire `SKILLS.md` de ce package.

## Rôle

Utilitaires partagés front et back : parsing (dates avec dayjs, durées, nombres), utilitaires
de base, énumérations. Consommé par des applications React et par `@etiennea20/adr-nest` côté
serveur.

## Contraintes d'environnement

- Doit fonctionner **à l'identique dans le navigateur et dans Node** : aucune API propre à un
  environnement (`window`, `document`, `process`, `Buffer`, `node:*`, `fs`…). Le tsconfig
  n'inclut ni `DOM` ni les types Node : leur utilisation échoue au typecheck.
- **Aucune dépendance React ni NestJS.**
- Fonctions pures autant que possible, sans état global ni effet de bord à l'import
  (`sideEffects: false`).
- Tout ce qui dépend de l'heure courante accepte une date de référence en paramètre (ou
  s'appuie sur `dayjs()`) pour rester testable avec `vi.setSystemTime()`.

## Build

- tsup, `platform: "neutral"`, sorties ESM (`dist/index.js`) + CJS (`dist/index.cjs`) + types
  (`.d.ts` / `.d.cts`). Pas de bannière `"use client"`.
- Point d'entrée unique `@etiennea20/adr-misc` : pas de sous-chemin tant qu'aucune catégorie
  n'a de dépendance propre.

## dayjs

- `dayjs` est une **peerDependency** (`^1.11.0`) et une devDependency pour les tests ; il est
  marqué `external` dans tsup (jamais embarqué).
- Raison : les plugins dayjs (`dayjs.extend(utc)`…) modifient l'instance importée. Si le package
  embarquait sa propre copie, les plugins configurés par le projet consommateur ne
  s'appliqueraient pas à nos fonctions, et inversement.
- Une fonction qui a besoin d'un plugin l'active elle-même (`dayjs.extend` est idempotent) et le
  documente dans son TSDoc (`@remarks`).

## Catégories

| Dossier        | Contenu                                                                    |
| -------------- | -------------------------------------------------------------------------- |
| `src/core/`    | Utilitaires de base : assertions, garde-fous, helpers génériques typés     |
| `src/parsing/` | Parsing et formatage : dates (dayjs), durées, nombres                      |
| `src/enums/`   | Énumérations `as const` préfixées par `E` + type du même nom (voir racine) |

Une catégorie n'est créée (dossier + `index.ts` + réexport dans `src/index.ts`) qu'avec son
premier élément. Si une catégorie dépasse une quinzaine d'éléments, proposer de la diviser.

## Tests

- Environnement Vitest `node` (le code doit aussi fonctionner dans le navigateur : ne pas s'en
  servir pour utiliser des API Node).
- Dates : figer le temps (`vi.useFakeTimers()` + `vi.setSystemTime(new Date("2026-01-15T10:00:00Z"))`)
  et préciser le fuseau horaire attendu dans le test.

## Élément de référence

`src/core/invariant/` : modèle à suivre (TSDoc complet, `@throws`, tests nominal / limites /
erreurs, entrée SKILLS.md).
