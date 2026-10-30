# CLAUDE.md : `@etiennea20/adr-misc`

Complète le `CLAUDE.md` racine (à lire d'abord), puis lire `SKILLS.md` de ce package.

## Rôle

Utilitaires partagés front et back : assertions, gardes et types utilitaires, asynchrone,
tableaux, objets, chaînes, calculs, parsing et formatage français (dates avec dayjs, durées,
nombres), dates (jours fériés, jours ouvrés), énumérations, validation, URL, fichiers, couleurs. Consommé par des applications React et par `@etiennea20/adr-nest` côté
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

| Dossier           | Contenu                                                                    |
| ----------------- | -------------------------------------------------------------------------- |
| `src/core/`       | Assertions (`invariant`, `assertNever`…) et gestion d'erreurs (`Result`)   |
| `src/guards/`     | Gardes de type (`isDefined`, `isPlainObject`…)                             |
| `src/types/`      | Types utilitaires uniquement (`DeepPartial`, `Brand`…)                     |
| `src/function/`   | Fonctions d'ordre supérieur (`once`, `memoize`, `pipe`…)                   |
| `src/async/`      | Promesses et minuteries (`retry`, `debounce`, `withTimeout`…)              |
| `src/array/`      | Tableaux, toujours immuables (`chunk`, `groupBy`, `sortBy`…)               |
| `src/object/`     | Objets, toujours immuables (`pick`, `deepMerge`, `isEqual`…)               |
| `src/string/`     | Chaînes : recherche, troncature, échappement, pluriel français             |
| `src/case/`       | Changement de casse (`toCamelCase`, `toKebabCase`…)                        |
| `src/math/`       | Calculs numériques (`clamp`, `round`, `median`…)                           |
| `src/random/`     | Aléatoire à générateur injectable, UUID                                    |
| `src/parsing/`    | Lecture de saisies : nombres, booléens, dates (dayjs), durées, JSON, CSV   |
| `src/format/`     | Formatage français : nombres, monnaie, dates, durées, tailles, téléphone   |
| `src/date/`       | Calculs de dates (dayjs) : jours fériés, jours ouvrés, semaine ISO, âge    |
| `src/enums/`      | Énumérations `as const` préfixées par `E` + type du même nom (voir racine) |
| `src/validation/` | Prédicats de validation : email, téléphone, SIRET, IBAN, NIR, mot de passe |
| `src/url/`        | Query strings et assemblage d'URL (sans `URL`, absent de la lib ES2022)    |
| `src/file/`       | Noms de fichiers et types MIME (aucune API de système de fichiers)         |
| `src/color/`      | Couleurs hexadécimales, mélange, contraste WCAG                            |

Une catégorie n'est créée (dossier + `index.ts` + réexport dans `src/index.ts`) qu'avec son
premier élément. Si une catégorie dépasse une quinzaine d'éléments, proposer de la diviser.

- **Aucun import entre catégories** (sauf besoin réel, à justifier) : chaque catégorie reste
  autonome et lisible seule.
- Les globales communes au navigateur et à Node mais absentes de la lib ES2022 (minuteries,
  `crypto`) passent par un helper privé typé sur `globalThis` (`src/async/timers/`,
  `src/random/crypto/`), lu à chaque appel pour rester compatible avec `vi.useFakeTimers()`.
- Ce qui dépend de l'heure courante accepte une date de référence ; ce qui est aléatoire
  accepte un générateur `random: () => number` (défaut `Math.random`).

## Tests

- Environnement Vitest `node` (le code doit aussi fonctionner dans le navigateur : ne pas s'en
  servir pour utiliser des API Node).
- Dates : figer le temps (`vi.useFakeTimers()` + `vi.setSystemTime(new Date("2026-01-15T10:00:00Z"))`)
  et préciser le fuseau horaire attendu dans le test.

## Élément de référence

`src/core/invariant/` : modèle à suivre (TSDoc complet, `@throws`, tests nominal / limites /
erreurs, entrée SKILLS.md).
