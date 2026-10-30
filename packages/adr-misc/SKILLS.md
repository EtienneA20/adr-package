---
skill: adr-misc
description: >-
  À utiliser pour développer ou utiliser @etiennea20/adr-misc : utilitaires TypeScript partagés
  entre front (navigateur) et back (Node, NestJS) : assertions et gestion d'erreurs, gardes et
  types utilitaires, fonctions asynchrones (retry, debounce, timeout), tableaux, objets, chaînes
  et casse, calculs, aléatoire, parsing (nombres, dates avec dayjs, durées, CSV), formatage
  français, dates (jours fériés, jours ouvrés), énumérations, validation (email, SIRET, IBAN,
  NIR), URL, fichiers et couleurs. Donne l'inventaire des fonctions, types et énumérations
  publics, leur signature, leurs erreurs et un exemple d'utilisation.
---

# SKILLS : @etiennea20/adr-misc

## Introduction

Utilitaires sans dépendance d'environnement, utilisables dans le navigateur comme dans Node
(ESM et CJS). Aucune dépendance React ni NestJS.

- Point d'entrée unique : `@etiennea20/adr-misc`.
- `dayjs` est une peerDependency : le projet consommateur l'installe et configure ses plugins
  (`dayjs.extend`) une seule fois ; les fonctions du package utilisent cette même instance.
- Conventions : fonctions pures et immuables, formats français par défaut (`fr-FR`, `EUR`,
  `DD/MM/YYYY`), date de référence et générateur aléatoire injectables pour les tests.
- Avant d'écrire un helper générique dans un projet consommateur, chercher ici un équivalent.

## Table des matières

- [core](#core) : assertions et gestion d'erreurs (`assertDefined`, `assertNever`, `getErrorMessage`, `invariant`, `Result`, `toError`, `tryCatch`, `tryCatchAsync`)
- [guards](#guards) : gardes de type (`isBoolean`, `isDefined`, `isEmpty`, `isFunction`, `isKeyOf`, `isNil`, `isNonEmptyArray`, `isNonEmptyString`, `isNumber`, `isObject`, `isPlainObject`, `isPromiseLike`, `isString`, `isValidDate`)
- [types](#types) : types utilitaires (`Brand`, `DeepPartial`, `DeepReadonly`, `KeysOfType`, `Maybe`, `MaybePromise`, `Mutable`, `NonEmptyArray`, `Nullable`, `PartialBy`, `Prettify`, `Primitive`, `RequiredBy`, `ValueOf`)
- [function](#function) : fonctions d'ordre supérieur (`identity`, `IMemoizedFunction`, `IMemoizeOptions`, `memoize`, `negate`, `noop`, `once`, `pipe`)
- [async](#async) : promesses, minuteries et concurrence (`createDeferred`, `debounce`, `IDebouncedFunction`, `IDeferred`, `IRetryOptions`, `IThrottledFunction`, `IWaitUntilOptions`, `mapConcurrent`, `retry`, `sleep`, `throttle`, `TimeoutError`, `waitUntil`, `withTimeout`)
- [array](#array) : tableaux (`chunk`, `compact`, `countBy`, `difference`, `groupBy`, `intersection`, `ISortByCriterion`, `keyBy`, `moveItem`, `partition`, `range`, `sortBy`, `SortByCriterion`, `SortByValue`, `toggleItem`, `unique`, `uniqueBy`, `zip`)
- [object](#object) : objets (`deepClone`, `deepMerge`, `DeepMergePatch`, `flattenObject`, `getPath`, `invert`, `IRemoveUndefinedOptions`, `isEqual`, `mapValues`, `ObjectEntry`, `omit`, `omitBy`, `PathValue`, `pick`, `pickBy`, `removeUndefined`, `setPath`, `typedEntries`, `unflattenObject`)
- [string](#string) : chaînes de caractères (`IGetInitialsOptions`, `IHighlightSegment`, `IInterpolateOptions`, `IMaskStringOptions`, `IPluralizeOptions`, `ISlugifyOptions`, `ITruncateOptions`, `InterpolateValues`, `compareStrings`, `countWords`, `escapeHtml`, `escapeRegExp`, `getInitials`, `highlightMatches`, `interpolate`, `maskString`, `matchesSearch`, `normalizeWhitespace`, `pluralize`, `removeAccents`, `slugify`, `truncate`, `unescapeHtml`)
- [case](#case) : changement de casse (`ICapitalizeOptions`, `IToTitleCaseOptions`, `capitalize`, `toCamelCase`, `toConstantCase`, `toKebabCase`, `toPascalCase`, `toSnakeCase`, `toTitleCase`, `uncapitalize`)
- [math](#math) : calculs numériques (`average`, `clamp`, `inRange`, `lerp`, `maxBy`, `median`, `minBy`, `percentage`, `round`, `roundToStep`, `sum`, `sumBy`)
- [random](#random) : aléatoire et identifiants (`createSeededRandom`, `createUuid`, `IRandomStringOptions`, `randomFloat`, `randomInt`, `randomItem`, `randomString`, `sample`, `shuffle`)
- [parsing](#parsing) : lecture de saisies : nombres, booléens, dates, durées, JSON, CSV (`IParseCsvOptions`, `IParseNumberOptions`, `IToCsvOptions`, `parseBoolean`, `parseCsv`, `parseDate`, `parseDuration`, `parseInteger`, `parseNumber`, `safeJsonParse`, `toCsv`)
- [format](#format) : formatage français : nombres, monnaie, dates, durées, tailles (`IFormatBytesOptions`, `IFormatCurrencyOptions`, `IFormatDateOptions`, `IFormatDurationOptions`, `IFormatFullNameOptions`, `IFormatIbanOptions`, `IFormatListOptions`, `IFormatNumberOptions`, `IFormatOrdinalOptions`, `IFormatPercentOptions`, `IFormatPhoneNumberOptions`, `IFormatRelativeTimeOptions`, `IPersonName`, `formatBytes`, `formatCurrency`, `formatDate`, `formatDateTime`, `formatDuration`, `formatFullName`, `formatIban`, `formatList`, `formatNumber`, `formatOrdinal`, `formatPercent`, `formatPhoneNumber`, `formatRelativeTime`)
- [date](#date) : calculs de dates : jours fériés, jours ouvrés, semaines, âge (`addBusinessDays`, `countBusinessDays`, `getAge`, `getDateRange`, `getEasterDate`, `getIsoWeek`, `getPublicHolidaysFr`, `getSchoolYear`, `IDateBetweenOptions`, `IPublicHoliday`, `IPublicHolidayOptions`, `isBusinessDay`, `ISchoolYearOptions`, `isDateBetween`, `isPublicHolidayFr`, `isWeekend`, `toIsoDate`)
- [enums](#enums) : énumérations et helpers associés (`EDurationMs`, `EHttpMethod`, `EHttpStatus`, `EMimeType`, `EMonth`, `ESortDirection`, `EWeekDay`, `getEnumKey`, `getEnumKeys`, `getEnumValues`, `isEnumValue`, `MONTH_LABELS`, `WEEK_DAY_LABELS`)
- [validation](#validation) : validation : email, téléphone, SIRET, IBAN, NIR, mot de passe (`EPasswordCriterion`, `getPasswordStrength`, `IIsUrlOptions`, `IPasswordRules`, `IPasswordStrength`, `isEmail`, `isFrenchVatNumber`, `isHexColor`, `isIban`, `isIpv4`, `isLuhnValid`, `isNir`, `isPhoneNumberFr`, `isPostalCodeFr`, `isSiren`, `isSiret`, `isStrongPassword`, `isUrl`, `isUuid`)
- [url](#url) : URL et query strings (`buildQueryString`, `buildUrl`, `getUrlParts`, `IBuildQueryStringOptions`, `isAbsoluteUrl`, `IUrlParts`, `joinUrl`, `ParsedQueryString`, `parseQueryString`, `QueryParams`, `QueryParamValue`)
- [file](#file) : noms de fichiers et types MIME (`changeFileExtension`, `getFileBaseName`, `getFileExtension`, `getFileName`, `getMimeType`, `ISanitizeFileNameOptions`, `isImageFile`, `sanitizeFileName`)
- [color](#color) : couleurs et contraste (`darkenColor`, `getContrastRatio`, `getLuminance`, `getReadableTextColor`, `hexToRgb`, `IReadableTextColorOptions`, `IRgbColor`, `IStringToColorOptions`, `lightenColor`, `mixColors`, `rgbToHex`, `stringToColor`, `withAlpha`)

## core

### `assertDefined`

| Champ          | Valeur                                           |
| -------------- | ------------------------------------------------ |
| Catégorie      | `core`                                           |
| Point d'entrée | `@etiennea20/adr-misc`                           |
| Statut         | stable                                           |
| Depuis         | 0.2.0                                            |
| Source         | `src/core/assert-defined/assert-defined.ts`      |
| Tests          | `src/core/assert-defined/assert-defined.test.ts` |

**Signature**

```ts
function assertDefined<T>(value: T, message: string): asserts value is NonNullable<T>;
```

**Description** : vérifie qu'une valeur n'est ni `null` ni `undefined` et lève une erreur
sinon ; TypeScript affine ensuite le type en `NonNullable<T>`. À utiliser à la place de
`invariant` quand la valeur peut légitimement être « falsy » (`0`, `""`, `false`, `NaN` sont
acceptés). Réservé aux hypothèses internes, pas à la validation d'une saisie utilisateur.

**Paramètres**

- `value` : valeur qui doit être définie.
- `message` : message de l'erreur levée, en français.

**Retour** : rien (`asserts value is NonNullable<T>`).

**Erreurs** : `Error` avec `message` si `value` vaut `null` ou `undefined`.

**Exemple**

```ts
import { assertDefined } from "@etiennea20/adr-misc";

const lateFee = feesByBookId.get(bookId); // number | undefined
assertDefined(lateFee, `Pénalité du livre ${bookId} introuvable`);
lateFee.toFixed(2); // `lateFee` est un `number`, même s'il vaut 0
```

### `assertNever`

| Champ          | Valeur                                       |
| -------------- | -------------------------------------------- |
| Catégorie      | `core`                                       |
| Point d'entrée | `@etiennea20/adr-misc`                       |
| Statut         | stable                                       |
| Depuis         | 0.2.0                                        |
| Source         | `src/core/assert-never/assert-never.ts`      |
| Tests          | `src/core/assert-never/assert-never.test.ts` |

**Signature**

```ts
function assertNever(value: never, message?: string): never;
```

**Description** : signale un cas qui ne devrait jamais être atteint. À placer dans la branche
`default` d'un `switch` sur une union discriminée : TypeScript refuse de compiler tant qu'un
cas n'est pas traité, et l'erreur protège l'exécution si une valeur inattendue arrive malgré
tout (donnée externe, version d'API différente).

**Paramètres**

- `value` : valeur restante après le traitement de tous les cas (type `never`).
- `message` : message de l'erreur (facultatif). Par défaut : `Valeur inattendue : <valeur>`
  (JSON pour un objet ou une chaîne).

**Retour** : ne renvoie jamais (`never`).

**Erreurs** : `Error`, toujours.

**Exemple**

```ts
import { assertNever } from "@etiennea20/adr-misc";

type LoanStatus = "active" | "returned" | "late";

function getLabel(status: LoanStatus): string {
  switch (status) {
    case "active":
      return "En cours";
    case "returned":
      return "Rendu";
    case "late":
      return "En retard";
    default:
      return assertNever(status);
  }
}
```

### `getErrorMessage`

| Champ          | Valeur                                                 |
| -------------- | ------------------------------------------------------ |
| Catégorie      | `core`                                                 |
| Point d'entrée | `@etiennea20/adr-misc`                                 |
| Statut         | stable                                                 |
| Depuis         | 0.2.0                                                  |
| Source         | `src/core/get-error-message/get-error-message.ts`      |
| Tests          | `src/core/get-error-message/get-error-message.test.ts` |

**Signature**

```ts
function getErrorMessage(value: unknown, fallback?: string): string;
```

**Description** : renvoie un message lisible à partir d'une valeur levée de type inconnu. À
utiliser dans un `catch` pour afficher ou journaliser une erreur sans vérifier son type :
reprend le message d'une `Error`, une chaîne levée telle quelle ou la propriété `message` d'un
objet (réponse d'API, erreur sérialisée).

**Paramètres**

- `value` : valeur interceptée par le `catch`.
- `fallback` : message renvoyé si `value` ne contient aucun message non vide (par défaut
  « Une erreur inconnue est survenue. »).

**Retour** : le message de l'erreur, ou `fallback`.

**Erreurs** : aucune.

**Exemple**

```ts
import { getErrorMessage } from "@etiennea20/adr-misc";

try {
  await borrowBook(bookId);
} catch (error) {
  showToast(getErrorMessage(error, "Impossible d'emprunter ce livre."));
}

getErrorMessage({ message: "Quota atteint" }); // "Quota atteint"
getErrorMessage(42); // "Une erreur inconnue est survenue."
```

### `invariant`

| Champ          | Valeur                                 |
| -------------- | -------------------------------------- |
| Catégorie      | `core`                                 |
| Point d'entrée | `@etiennea20/adr-misc`                 |
| Statut         | stable                                 |
| Depuis         | 0.1.0                                  |
| Source         | `src/core/invariant/invariant.ts`      |
| Tests          | `src/core/invariant/invariant.test.ts` |

**Signature**

```ts
function invariant(condition: unknown, message: string): asserts condition;
```

**Description** : vérifie qu'une condition est vraie et lève une erreur sinon. TypeScript
affine ensuite le type de la condition. À utiliser pour garantir une hypothèse interne, pas
pour valider une saisie utilisateur.

**Paramètres**

- `condition` : valeur qui doit être vraie (truthy).
- `message` : message de l'erreur levée, en français.

**Retour** : rien (`asserts condition`).

**Erreurs** : `Error` avec `message` si `condition` est fausse (`false`, `0`, `""`, `null`,
`undefined`, `NaN`).

**Exemple**

```ts
import { invariant } from "@etiennea20/adr-misc";

const user = users.find((candidate) => candidate.id === id);
invariant(user, `Utilisateur ${id} introuvable`);
user.name; // `user` n'est plus `undefined`
```

### `Result`

| Champ          | Valeur                           |
| -------------- | -------------------------------- |
| Catégorie      | `core`                           |
| Point d'entrée | `@etiennea20/adr-misc`           |
| Statut         | stable                           |
| Depuis         | 0.2.0                            |
| Source         | `src/core/result/result.ts`      |
| Tests          | `src/core/result/result.test.ts` |

**Signature**

```ts
type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E };
```

**Description** : résultat d'une opération qui peut échouer, sous forme d'union discriminée
par `ok`. À utiliser comme valeur de retour quand l'échec fait partie du fonctionnement normal
et doit être traité par l'appelant (plutôt qu'une exception qu'il pourrait oublier
d'intercepter). Tester `result.ok` affine le type. Produit par `tryCatch` et `tryCatchAsync`.
Exporté comme type uniquement (`export type`).

**Exemple**

```ts
import type { Result } from "@etiennea20/adr-misc";

function parseIsbn(input: string): Result<string, string> {
  const isbn = input.replaceAll("-", "");
  return /^\d{13}$/.test(isbn) ? { ok: true, value: isbn } : { ok: false, error: "ISBN invalide" };
}

const result = parseIsbn("978-2-07-036024-5");
if (result.ok) {
  result.value; // string
} else {
  result.error; // string
}
```

### `toError`

| Champ          | Valeur                               |
| -------------- | ------------------------------------ |
| Catégorie      | `core`                               |
| Point d'entrée | `@etiennea20/adr-misc`               |
| Statut         | stable                               |
| Depuis         | 0.2.0                                |
| Source         | `src/core/to-error/to-error.ts`      |
| Tests          | `src/core/to-error/to-error.test.ts` |

**Signature**

```ts
function toError(value: unknown): Error;
```

**Description** : convertit une valeur levée de type inconnu en instance d'`Error`. À utiliser
dans un `catch` quand la suite du code a besoin d'une vraie `Error` (journal, `Result`,
nouvelle levée). Une `Error` est renvoyée telle quelle ; une chaîne ou un objet doté d'un
`message` donnent une `Error` avec ce message ; toute autre valeur donne une `Error` qui la
décrit. La valeur d'origine est conservée dans `cause`.

**Paramètres**

- `value` : valeur interceptée par le `catch`.

**Retour** : la valeur elle-même si c'est une `Error`, sinon une nouvelle `Error`
(`cause` = `value`).

**Erreurs** : aucune.

**Exemple**

```ts
import { toError } from "@etiennea20/adr-misc";

try {
  await syncCatalog();
} catch (caught) {
  const error = toError(caught);
  logger.error(error.message, error.stack);
}

toError(404).message; // "Valeur levée non conforme : 404"
```

### `tryCatch`

| Champ          | Valeur                                 |
| -------------- | -------------------------------------- |
| Catégorie      | `core`                                 |
| Point d'entrée | `@etiennea20/adr-misc`                 |
| Statut         | stable                                 |
| Depuis         | 0.2.0                                  |
| Source         | `src/core/try-catch/try-catch.ts`      |
| Tests          | `src/core/try-catch/try-catch.test.ts` |

**Signature**

```ts
function tryCatch<T>(fn: () => T): Result<T>;
```

**Description** : exécute une fonction synchrone et renvoie son résultat ou son erreur sous
forme de `Result`, sans bloc `try`/`catch`. À utiliser quand l'échec d'une opération
synchrone (parsing JSON, conversion) doit être traité comme une valeur, par exemple pour
garder une variable `const`. L'erreur est normalisée avec `toError`. Pour une opération
asynchrone, utiliser `tryCatchAsync`.

**Paramètres**

- `fn` : fonction à exécuter.

**Retour** : `{ ok: true, value }` si `fn` réussit, `{ ok: false, error }` si elle lève.

**Erreurs** : aucune (l'erreur de `fn` est renvoyée dans le `Result`).

**Exemple**

```ts
import { tryCatch } from "@etiennea20/adr-misc";

const parsed = tryCatch(() => JSON.parse(rawLoan) as ILoan);
if (!parsed.ok) {
  logger.warn(`Emprunt illisible : ${parsed.error.message}`);
  return;
}
parsed.value.bookId;
```

### `tryCatchAsync`

| Champ          | Valeur                                             |
| -------------- | -------------------------------------------------- |
| Catégorie      | `core`                                             |
| Point d'entrée | `@etiennea20/adr-misc`                             |
| Statut         | stable                                             |
| Depuis         | 0.2.0                                              |
| Source         | `src/core/try-catch-async/try-catch-async.ts`      |
| Tests          | `src/core/try-catch-async/try-catch-async.test.ts` |

**Signature**

```ts
function tryCatchAsync<T>(input: Promise<T> | (() => Promise<T>)): Promise<Result<T>>;
```

**Description** : attend une promesse (ou exécute une fonction asynchrone) et renvoie sa
valeur ou son erreur sous forme de `Result`. À utiliser quand l'échec d'une opération
asynchrone (appel d'API, lecture de fichier) doit être traité comme une valeur. Avec une
fonction, une erreur levée de façon synchrone est elle aussi interceptée. L'erreur est
normalisée avec `toError` ; la promesse renvoyée n'est jamais rejetée.

**Paramètres**

- `input` : promesse à attendre, ou fonction qui la crée.

**Retour** : une promesse de `{ ok: true, value }` ou de `{ ok: false, error }`.

**Erreurs** : aucune (la promesse renvoyée n'est jamais rejetée).

**Exemple**

```ts
import { tryCatchAsync } from "@etiennea20/adr-misc";

const result = await tryCatchAsync(() => api.get<IBook[]>("/books"));
if (!result.ok) {
  return { books: [], error: result.error.message };
}
return { books: result.value, error: undefined };
```

## guards

### `isBoolean`

| Champ          | Valeur                                     |
| -------------- | ------------------------------------------ |
| Catégorie      | `guards`                                   |
| Point d'entrée | `@etiennea20/adr-misc`                     |
| Statut         | stable                                     |
| Depuis         | 0.2.0                                      |
| Source         | `src/guards/is-boolean/is-boolean.ts`      |
| Tests          | `src/guards/is-boolean/is-boolean.test.ts` |

**Signature**

```ts
function isBoolean(value: unknown): value is boolean;
```

**Description** : indique si une valeur est un booléen primitif. À utiliser pour affiner une valeur `unknown` (option de configuration, champ JSON) ; les chaînes `"true"` / `"false"` sont exclues.

**Paramètres**

- `value` : valeur à tester.

**Retour** : `true` si `typeof value === "boolean"`.

**Erreurs** : aucune.

**Exemple**

```ts
import { isBoolean } from "@etiennea20/adr-misc";

isBoolean(false); // true
isBoolean("true"); // false
```

### `isDefined`

| Champ          | Valeur                                     |
| -------------- | ------------------------------------------ |
| Catégorie      | `guards`                                   |
| Point d'entrée | `@etiennea20/adr-misc`                     |
| Statut         | stable                                     |
| Depuis         | 0.2.0                                      |
| Source         | `src/guards/is-defined/is-defined.ts`      |
| Tests          | `src/guards/is-defined/is-defined.test.ts` |

**Signature**

```ts
function isDefined<T>(value: T): value is NonNullable<T>;
```

**Description** : indique si une valeur n'est ni `null` ni `undefined`. Idéal pour `items.filter(isDefined)` : TypeScript affine le type des éléments restants, et les valeurs falsy légitimes (`0`, `""`, `false`) sont conservées.

**Paramètres**

- `value` : valeur à tester (type générique `T`).

**Retour** : `true` si `value` n'est ni `null` ni `undefined` (type affiné en `NonNullable<T>`).

**Erreurs** : aucune.

**Exemple**

```ts
import { isDefined } from "@etiennea20/adr-misc";

const dueDates = [new Date(2026, 0, 15), undefined, null];
dueDates.filter(isDefined); // Date[]
isDefined(0); // true
```

### `isEmpty`

| Champ          | Valeur                                 |
| -------------- | -------------------------------------- |
| Catégorie      | `guards`                               |
| Point d'entrée | `@etiennea20/adr-misc`                 |
| Statut         | stable                                 |
| Depuis         | 0.2.0                                  |
| Source         | `src/guards/is-empty/is-empty.ts`      |
| Tests          | `src/guards/is-empty/is-empty.test.ts` |

**Signature**

```ts
function isEmpty(value: unknown): boolean;
```

**Description** : indique si une valeur est vide : `null`, `undefined`, chaîne vide, tableau vide, `Map` ou `Set` vide, objet simple sans clé (`Object.keys`). Une chaîne d'espaces, `0`, `false` et les instances de classes (`Date`…) ne sont jamais vides. À utiliser pour savoir s'il y a quelque chose à afficher ou à traiter.

**Paramètres**

- `value` : valeur à tester.

**Retour** : `true` si `value` est vide (pas d'affinage de type).

**Erreurs** : aucune.

**Exemple**

```ts
import { isEmpty } from "@etiennea20/adr-misc";

isEmpty([]); // true
isEmpty({}); // true
isEmpty(new Map()); // true
isEmpty(" "); // false
isEmpty(0); // false
```

### `isFunction`

| Champ          | Valeur                                       |
| -------------- | -------------------------------------------- |
| Catégorie      | `guards`                                     |
| Point d'entrée | `@etiennea20/adr-misc`                       |
| Statut         | stable                                       |
| Depuis         | 0.2.0                                        |
| Source         | `src/guards/is-function/is-function.ts`      |
| Tests          | `src/guards/is-function/is-function.test.ts` |

**Signature**

```ts
function isFunction(value: unknown): value is (...args: never[]) => unknown;
```

**Description** : indique si une valeur est une fonction (classique, fléchée, asynchrone, classe). À utiliser pour accepter « une valeur ou une fonction qui la calcule ». Sur une union, le type exact de la fonction est conservé ; sur `unknown`, elle peut être appelée sans argument.

**Paramètres**

- `value` : valeur à tester.

**Retour** : `true` si `typeof value === "function"`.

**Erreurs** : aucune.

**Exemple**

```ts
import { isFunction } from "@etiennea20/adr-misc";

type Label = string | (() => string);
const resolveLabel = (label: Label): string => (isFunction(label) ? label() : label);
```

### `isKeyOf`

| Champ          | Valeur                                   |
| -------------- | ---------------------------------------- |
| Catégorie      | `guards`                                 |
| Point d'entrée | `@etiennea20/adr-misc`                   |
| Statut         | stable                                   |
| Depuis         | 0.2.0                                    |
| Source         | `src/guards/is-key-of/is-key-of.ts`      |
| Tests          | `src/guards/is-key-of/is-key-of.test.ts` |

**Signature**

```ts
function isKeyOf<T extends object>(object: T, key: PropertyKey): key is keyof T;
```

**Description** : indique si une clé est une propriété **propre** d'un objet (`Object.hasOwn`) et affine son type en `keyof T`. À utiliser pour indexer un objet avec une clé venue de l'extérieur ; les propriétés héritées (`toString`, `__proto__`…) sont refusées.

**Paramètres**

- `object` : objet dans lequel chercher la clé.
- `key` : clé à tester.

**Retour** : `true` si `object` possède en propre la propriété `key`.

**Erreurs** : aucune.

**Exemple**

```ts
import { isKeyOf } from "@etiennea20/adr-misc";

const LABELS = { borrowed: "Emprunté", available: "Disponible" };
if (isKeyOf(LABELS, status)) {
  LABELS[status]; // string
}
isKeyOf(LABELS, "toString"); // false
```

### `isNil`

| Champ          | Valeur                             |
| -------------- | ---------------------------------- |
| Catégorie      | `guards`                           |
| Point d'entrée | `@etiennea20/adr-misc`             |
| Statut         | stable                             |
| Depuis         | 0.2.0                              |
| Source         | `src/guards/is-nil/is-nil.ts`      |
| Tests          | `src/guards/is-nil/is-nil.test.ts` |

**Signature**

```ts
function isNil(value: unknown): value is null | undefined;
```

**Description** : indique si une valeur est `null` ou `undefined`. Inverse de `isDefined`.

**Paramètres**

- `value` : valeur à tester.

**Retour** : `true` si `value` vaut `null` ou `undefined`.

**Erreurs** : aucune.

**Exemple**

```ts
import { isNil } from "@etiennea20/adr-misc";

isNil(null); // true
isNil(0); // false
```

### `isNonEmptyArray`

| Champ          | Valeur                                                     |
| -------------- | ---------------------------------------------------------- |
| Catégorie      | `guards`                                                   |
| Point d'entrée | `@etiennea20/adr-misc`                                     |
| Statut         | stable                                                     |
| Depuis         | 0.2.0                                                      |
| Source         | `src/guards/is-non-empty-array/is-non-empty-array.ts`      |
| Tests          | `src/guards/is-non-empty-array/is-non-empty-array.test.ts` |

**Signature**

```ts
function isNonEmptyArray<T>(value: readonly T[]): value is readonly [T, ...T[]];
```

**Description** : indique si un tableau contient au moins un élément. Avec `noUncheckedIndexedAccess`, `items[0]` est ensuite de type `T` (et non `T | undefined`).

**Paramètres**

- `value` : tableau à tester.

**Retour** : `true` si `value.length > 0`.

**Erreurs** : aucune.

**Exemple**

```ts
import { isNonEmptyArray } from "@etiennea20/adr-misc";

if (isNonEmptyArray(loans)) {
  loans[0].bookId; // `loans[0]` est de type `Loan`
}
```

### `isNonEmptyString`

| Champ          | Valeur                                                       |
| -------------- | ------------------------------------------------------------ |
| Catégorie      | `guards`                                                     |
| Point d'entrée | `@etiennea20/adr-misc`                                       |
| Statut         | stable                                                       |
| Depuis         | 0.2.0                                                        |
| Source         | `src/guards/is-non-empty-string/is-non-empty-string.ts`      |
| Tests          | `src/guards/is-non-empty-string/is-non-empty-string.test.ts` |

**Signature**

```ts
function isNonEmptyString(value: unknown): value is string;
```

**Description** : indique si une valeur est une chaîne non vide après `trim()`. À utiliser pour valider un champ texte obligatoire.

**Paramètres**

- `value` : valeur à tester.

**Retour** : `true` si `value` est une chaîne contenant au moins un caractère autre qu'un espace.

**Erreurs** : aucune.

**Exemple**

```ts
import { isNonEmptyString } from "@etiennea20/adr-misc";

isNonEmptyString("Dune"); // true
isNonEmptyString("   "); // false
```

### `isNumber`

| Champ          | Valeur                                   |
| -------------- | ---------------------------------------- |
| Catégorie      | `guards`                                 |
| Point d'entrée | `@etiennea20/adr-misc`                   |
| Statut         | stable                                   |
| Depuis         | 0.2.0                                    |
| Source         | `src/guards/is-number/is-number.ts`      |
| Tests          | `src/guards/is-number/is-number.test.ts` |

**Signature**

```ts
function isNumber(value: unknown): value is number;
```

**Description** : indique si une valeur est de type `number` et différente de `NaN`. `Infinity` est accepté (utiliser `Number.isFinite` pour l'exclure) ; `bigint` et chaînes numériques sont exclus.

**Paramètres**

- `value` : valeur à tester.

**Retour** : `true` si `value` est un nombre autre que `NaN`.

**Erreurs** : aucune.

**Exemple**

```ts
import { isNumber } from "@etiennea20/adr-misc";

isNumber(3.5); // true
isNumber(Number("abc")); // false (NaN)
isNumber("3"); // false
```

### `isObject`

| Champ          | Valeur                                   |
| -------------- | ---------------------------------------- |
| Catégorie      | `guards`                                 |
| Point d'entrée | `@etiennea20/adr-misc`                   |
| Statut         | stable                                   |
| Depuis         | 0.2.0                                    |
| Source         | `src/guards/is-object/is-object.ts`      |
| Tests          | `src/guards/is-object/is-object.test.ts` |

**Signature**

```ts
function isObject(value: unknown): value is Record<PropertyKey, unknown>;
```

**Description** : indique si une valeur est un objet non `null` et non tableau (instances de classes comprises, fonctions exclues). À utiliser avant de lire les propriétés d'une valeur `unknown` ; préférer `isPlainObject` pour les seuls objets littéraux.

**Paramètres**

- `value` : valeur à tester.

**Retour** : `true` si `value` est un objet, ni `null` ni tableau.

**Erreurs** : aucune.

**Exemple**

```ts
import { isObject } from "@etiennea20/adr-misc";

isObject({ title: "Dune" }); // true
isObject(new Date()); // true
isObject(["Dune"]); // false
```

### `isPlainObject`

| Champ          | Valeur                                               |
| -------------- | ---------------------------------------------------- |
| Catégorie      | `guards`                                             |
| Point d'entrée | `@etiennea20/adr-misc`                               |
| Statut         | stable                                               |
| Depuis         | 0.2.0                                                |
| Source         | `src/guards/is-plain-object/is-plain-object.ts`      |
| Tests          | `src/guards/is-plain-object/is-plain-object.test.ts` |

**Signature**

```ts
function isPlainObject(value: unknown): value is Record<PropertyKey, unknown>;
```

**Description** : indique si une valeur est un objet simple (littéral, `new Object()`, `Object.create(null)`). Exclut tableaux et instances de classes. Le test porte sur la chaîne de prototypes : fonctionne aussi entre contextes d'exécution (iframe, `vm`). À utiliser avant de parcourir ou fusionner les clés d'un objet.

**Paramètres**

- `value` : valeur à tester.

**Retour** : `true` si le prototype de `value` est `Object.prototype` ou `null`.

**Erreurs** : aucune.

**Exemple**

```ts
import { isPlainObject } from "@etiennea20/adr-misc";

isPlainObject({ title: "Dune" }); // true
isPlainObject(new Date()); // false
```

### `isPromiseLike`

| Champ          | Valeur                                               |
| -------------- | ---------------------------------------------------- |
| Catégorie      | `guards`                                             |
| Point d'entrée | `@etiennea20/adr-misc`                               |
| Statut         | stable                                               |
| Depuis         | 0.2.0                                                |
| Source         | `src/guards/is-promise-like/is-promise-like.ts`      |
| Tests          | `src/guards/is-promise-like/is-promise-like.test.ts` |

**Signature**

```ts
function isPromiseLike<T>(value: T | PromiseLike<T>): value is PromiseLike<T>;
```

**Description** : indique si une valeur est « thenable » (objet ou fonction avec une méthode `then`). À utiliser quand un rappel peut être synchrone ou asynchrone (voir `MaybePromise`).

**Paramètres**

- `value` : valeur à tester, éventuellement de type `T | PromiseLike<T>`.

**Retour** : `true` si `value` possède une méthode `then`.

**Erreurs** : aucune.

**Exemple**

```ts
import { isPromiseLike } from "@etiennea20/adr-misc";

const result = loadBooks(); // Book[] | Promise<Book[]>
const books = isPromiseLike(result) ? await result : result;
```

### `isString`

| Champ          | Valeur                                   |
| -------------- | ---------------------------------------- |
| Catégorie      | `guards`                                 |
| Point d'entrée | `@etiennea20/adr-misc`                   |
| Statut         | stable                                   |
| Depuis         | 0.2.0                                    |
| Source         | `src/guards/is-string/is-string.ts`      |
| Tests          | `src/guards/is-string/is-string.test.ts` |

**Signature**

```ts
function isString(value: unknown): value is string;
```

**Description** : indique si une valeur est une chaîne primitive (les objets `String` sont exclus).

**Paramètres**

- `value` : valeur à tester.

**Retour** : `true` si `typeof value === "string"`.

**Erreurs** : aucune.

**Exemple**

```ts
import { isString } from "@etiennea20/adr-misc";

isString("Dune"); // true
isString(42); // false
```

### `isValidDate`

| Champ          | Valeur                                           |
| -------------- | ------------------------------------------------ |
| Catégorie      | `guards`                                         |
| Point d'entrée | `@etiennea20/adr-misc`                           |
| Statut         | stable                                           |
| Depuis         | 0.2.0                                            |
| Source         | `src/guards/is-valid-date/is-valid-date.ts`      |
| Tests          | `src/guards/is-valid-date/is-valid-date.test.ts` |

**Signature**

```ts
function isValidDate(value: unknown): value is Date;
```

**Description** : indique si une valeur est une instance de `Date` valide (`getTime()` différent de `NaN`). À utiliser après une conversion pour écarter les `Invalid Date` ; les chaînes et horodatages sont exclus.

**Paramètres**

- `value` : valeur à tester.

**Retour** : `true` si `value` est une `Date` valide.

**Erreurs** : aucune.

**Exemple**

```ts
import { isValidDate } from "@etiennea20/adr-misc";

isValidDate(new Date(2026, 0, 15)); // true
isValidDate(new Date("pas une date")); // false
```

## types

### `Brand`

| Champ          | Valeur                          |
| -------------- | ------------------------------- |
| Catégorie      | `types`                         |
| Point d'entrée | `@etiennea20/adr-misc`          |
| Statut         | stable                          |
| Depuis         | 0.2.0                           |
| Source         | `src/types/brand/brand.ts`      |
| Tests          | `src/types/brand/brand.test.ts` |

**Signature**

```ts
type Brand<T, B extends string> = T & { readonly __brand: B };
```

**Description** : type nominal : rend un type `T` incompatible avec un autre de même structure grâce à la marque `B`. À utiliser pour ne pas confondre des identifiants ou valeurs de même type primitif. La marque n'existe qu'à la compilation ; la valeur se crée par une conversion explicite (`as BookId`), idéalement dans une fonction de validation.

**Exemple**

```ts
import type { Brand } from "@etiennea20/adr-misc";

type BookId = Brand<string, "BookId">;
type MemberId = Brand<string, "MemberId">;

const toBookId = (value: string): BookId => value as BookId;
findBook(toBookId("b-42")); // OK
findBook(memberId); // erreur de compilation
```

### `DeepPartial`

| Champ          | Valeur                                        |
| -------------- | --------------------------------------------- |
| Catégorie      | `types`                                       |
| Point d'entrée | `@etiennea20/adr-misc`                        |
| Statut         | stable                                        |
| Depuis         | 0.2.0                                         |
| Source         | `src/types/deep-partial/deep-partial.ts`      |
| Tests          | `src/types/deep-partial/deep-partial.test.ts` |

**Signature**

```ts
type DeepPartial<T> = T extends
  | Primitive
  | Date
  | RegExp
  | ((...args: never[]) => unknown)
  | ReadonlyMap<unknown, unknown>
  | ReadonlySet<unknown>
  | PromiseLike<unknown>
  ? T
  : T extends readonly unknown[]
    ? { [K in keyof T]: DeepPartial<T[K]> }
    : { [K in keyof T]?: DeepPartial<T[K]> };
```

**Description** : rend facultatives toutes les propriétés, récursivement. Les éléments des tableaux deviennent partiels sans devenir facultatifs ; primitives, fonctions, `Date`, `RegExp`, `Map`, `Set` et promesses sont conservés. À utiliser pour un patch partiel d'un objet imbriqué (configuration, données de test).

**Exemple**

```ts
import type { DeepPartial } from "@etiennea20/adr-misc";

const override: DeepPartial<ILibrarySettings> = { loans: { maxDays: 28 } };
```

### `DeepReadonly`

| Champ          | Valeur                                          |
| -------------- | ----------------------------------------------- |
| Catégorie      | `types`                                         |
| Point d'entrée | `@etiennea20/adr-misc`                          |
| Statut         | stable                                          |
| Depuis         | 0.2.0                                           |
| Source         | `src/types/deep-readonly/deep-readonly.ts`      |
| Tests          | `src/types/deep-readonly/deep-readonly.test.ts` |

**Signature**

```ts
type DeepReadonly<T> = T extends
  Primitive | Date | RegExp | ((...args: never[]) => unknown) | PromiseLike<unknown>
  ? T
  : T extends ReadonlyMap<infer K, infer V>
    ? ReadonlyMap<DeepReadonly<K>, DeepReadonly<V>>
    : T extends ReadonlySet<infer V>
      ? ReadonlySet<DeepReadonly<V>>
      : { readonly [K in keyof T]: DeepReadonly<T[K]> };
```

**Description** : rend tout un type en lecture seule, récursivement (tableaux en `readonly T[]`, `Map` en `ReadonlyMap`, `Set` en `ReadonlySet`). Purement statique : combiner avec `Object.freeze` pour une garantie à l'exécution. À utiliser pour exposer un état ou une configuration non modifiable.

**Exemple**

```ts
import type { DeepReadonly } from "@etiennea20/adr-misc";

declare const catalog: DeepReadonly<ICatalog>;
catalog.genres.push("Polar"); // erreur de compilation
```

### `KeysOfType`

| Champ          | Valeur                                        |
| -------------- | --------------------------------------------- |
| Catégorie      | `types`                                       |
| Point d'entrée | `@etiennea20/adr-misc`                        |
| Statut         | stable                                        |
| Depuis         | 0.2.0                                         |
| Source         | `src/types/keys-of-type/keys-of-type.ts`      |
| Tests          | `src/types/keys-of-type/keys-of-type.test.ts` |

**Signature**

```ts
type KeysOfType<T, V> = {
  [K in keyof T]-?: T[K] extends V ? K : never;
}[keyof T];
```

**Description** : union des clés de `T` dont la valeur est assignable à `V`. Une propriété facultative n'est retenue que si `V` accepte `undefined`. À utiliser pour restreindre un paramètre (colonne de tri numérique, champ de date…).

**Exemple**

```ts
import type { KeysOfType } from "@etiennea20/adr-misc";

type NumericField = KeysOfType<IBook, number>; // "pages" | "copies"
```

### `Maybe`

| Champ          | Valeur                          |
| -------------- | ------------------------------- |
| Catégorie      | `types`                         |
| Point d'entrée | `@etiennea20/adr-misc`          |
| Statut         | stable                          |
| Depuis         | 0.2.0                           |
| Source         | `src/types/maybe/maybe.ts`      |
| Tests          | `src/types/maybe/maybe.test.ts` |

**Signature**

```ts
type Maybe<T> = T | null | undefined;
```

**Description** : ajoute `null` et `undefined` à un type. À utiliser pour une valeur qui peut être absente de plusieurs façons ; se teste avec `isNil` / `isDefined`.

**Exemple**

```ts
import type { Maybe } from "@etiennea20/adr-misc";

function formatAuthor(author: Maybe<string>): string {
  return author ?? "Auteur inconnu";
}
```

### `MaybePromise`

| Champ          | Valeur                                          |
| -------------- | ----------------------------------------------- |
| Catégorie      | `types`                                         |
| Point d'entrée | `@etiennea20/adr-misc`                          |
| Statut         | stable                                          |
| Depuis         | 0.2.0                                           |
| Source         | `src/types/maybe-promise/maybe-promise.ts`      |
| Tests          | `src/types/maybe-promise/maybe-promise.test.ts` |

**Signature**

```ts
type MaybePromise<T> = T | PromiseLike<T>;
```

**Description** : valeur disponible immédiatement ou de façon asynchrone. À utiliser pour le type de retour d'un rappel synchrone ou asynchrone (`await` fonctionne dans les deux cas, ou tester avec `isPromiseLike`).

**Exemple**

```ts
import type { MaybePromise } from "@etiennea20/adr-misc";

type LoanValidator = (loan: ILoan) => MaybePromise<boolean>;
```

### `Mutable`

| Champ          | Valeur                              |
| -------------- | ----------------------------------- |
| Catégorie      | `types`                             |
| Point d'entrée | `@etiennea20/adr-misc`              |
| Statut         | stable                              |
| Depuis         | 0.2.0                               |
| Source         | `src/types/mutable/mutable.ts`      |
| Tests          | `src/types/mutable/mutable.test.ts` |

**Signature**

```ts
type Mutable<T> = { -readonly [K in keyof T]: T[K] };
```

**Description** : retire `readonly` des propriétés (un seul niveau) ; inverse de `Readonly`. Fonctionne aussi sur les tableaux et tuples en lecture seule. À utiliser ponctuellement pour construire une valeur étape par étape.

**Exemple**

```ts
import type { Mutable } from "@etiennea20/adr-misc";

type Titles = Mutable<readonly string[]>; // string[]
```

### `NonEmptyArray`

| Champ          | Valeur                                              |
| -------------- | --------------------------------------------------- |
| Catégorie      | `types`                                             |
| Point d'entrée | `@etiennea20/adr-misc`                              |
| Statut         | stable                                              |
| Depuis         | 0.2.0                                               |
| Source         | `src/types/non-empty-array/non-empty-array.ts`      |
| Tests          | `src/types/non-empty-array/non-empty-array.test.ts` |

**Signature**

```ts
type NonEmptyArray<T> = [T, ...T[]];
```

**Description** : tableau d'au moins un élément : l'appel avec `[]` est refusé à la compilation et `items[0]` est de type `T`. Version lecture seule : `Readonly<NonEmptyArray<T>>`.

**Exemple**

```ts
import type { NonEmptyArray } from "@etiennea20/adr-misc";

function notifyMembers(emails: NonEmptyArray<string>): void {
  const [first] = emails; // string
}
notifyMembers([]); // erreur de compilation
```

### `Nullable`

| Champ          | Valeur                                |
| -------------- | ------------------------------------- |
| Catégorie      | `types`                               |
| Point d'entrée | `@etiennea20/adr-misc`                |
| Statut         | stable                                |
| Depuis         | 0.2.0                                 |
| Source         | `src/types/nullable/nullable.ts`      |
| Tests          | `src/types/nullable/nullable.test.ts` |

**Signature**

```ts
type Nullable<T> = T | null;
```

**Description** : ajoute `null` à un type. À utiliser pour une valeur explicitement vide (colonne SQL nullable) quand `undefined` n'est pas possible ; sinon utiliser `Maybe`.

**Exemple**

```ts
import type { Nullable } from "@etiennea20/adr-misc";

interface IBook {
  returnedAt: Nullable<Date>; // Date | null
}
```

### `PartialBy`

| Champ          | Valeur                                    |
| -------------- | ----------------------------------------- |
| Catégorie      | `types`                                   |
| Point d'entrée | `@etiennea20/adr-misc`                    |
| Statut         | stable                                    |
| Depuis         | 0.2.0                                     |
| Source         | `src/types/partial-by/partial-by.ts`      |
| Tests          | `src/types/partial-by/partial-by.test.ts` |

**Signature**

```ts
type PartialBy<T, K extends keyof T> = Prettify<Omit<T, K> & Partial<Pick<T, K>>>;
```

**Description** : rend facultatives les clés `K` de `T`, les autres restant inchangées. À utiliser pour le type d'entrée d'une fonction de création (champs avec valeur par défaut). Ne se distribue pas sur une union.

**Exemple**

```ts
import type { PartialBy } from "@etiennea20/adr-misc";

type LoanInput = PartialBy<ILoan, "id" | "borrowedAt">;
```

### `Prettify`

| Champ          | Valeur                                |
| -------------- | ------------------------------------- |
| Catégorie      | `types`                               |
| Point d'entrée | `@etiennea20/adr-misc`                |
| Statut         | stable                                |
| Depuis         | 0.2.0                                 |
| Source         | `src/types/prettify/prettify.ts`      |
| Tests          | `src/types/prettify/prettify.test.ts` |

**Signature**

```ts
type Prettify<T> = { [K in keyof T]: T[K] };
```

**Description** : aplatit un type objet composé (intersections, `Omit`…) en un seul type littéral équivalent, pour un affichage lisible au survol. Conserve `readonly` et `?` ; un seul niveau.

**Exemple**

```ts
import type { Prettify } from "@etiennea20/adr-misc";

type BookDraft = Prettify<Omit<IBook, "id"> & { isDraft: true }>;
```

### `Primitive`

| Champ          | Valeur                                  |
| -------------- | --------------------------------------- |
| Catégorie      | `types`                                 |
| Point d'entrée | `@etiennea20/adr-misc`                  |
| Statut         | stable                                  |
| Depuis         | 0.2.0                                   |
| Source         | `src/types/primitive/primitive.ts`      |
| Tests          | `src/types/primitive/primitive.test.ts` |

**Signature**

```ts
type Primitive = string | number | bigint | boolean | symbol | null | undefined;
```

**Description** : union des types primitifs JavaScript. À utiliser pour accepter une valeur scalaire ou comme condition d'arrêt dans un type récursif.

**Exemple**

```ts
import type { Primitive } from "@etiennea20/adr-misc";

type FilterValue = Primitive | Date;
```

### `RequiredBy`

| Champ          | Valeur                                      |
| -------------- | ------------------------------------------- |
| Catégorie      | `types`                                     |
| Point d'entrée | `@etiennea20/adr-misc`                      |
| Statut         | stable                                      |
| Depuis         | 0.2.0                                       |
| Source         | `src/types/required-by/required-by.ts`      |
| Tests          | `src/types/required-by/required-by.test.ts` |

**Signature**

```ts
type RequiredBy<T, K extends keyof T> = Prettify<Omit<T, K> & Required<Pick<T, K>>>;
```

**Description** : rend obligatoires les clés `K` de `T` (et retire `undefined` de leur type), les autres restant inchangées. À utiliser après une étape qui garantit la présence de champs facultatifs. Ne se distribue pas sur une union.

**Exemple**

```ts
import type { RequiredBy } from "@etiennea20/adr-misc";

type ContactableMember = RequiredBy<IMember, "email">;
```

### `ValueOf`

| Champ          | Valeur                                |
| -------------- | ------------------------------------- |
| Catégorie      | `types`                               |
| Point d'entrée | `@etiennea20/adr-misc`                |
| Statut         | stable                                |
| Depuis         | 0.2.0                                 |
| Source         | `src/types/value-of/value-of.ts`      |
| Tests          | `src/types/value-of/value-of.test.ts` |

**Signature**

```ts
type ValueOf<T> = T extends readonly unknown[] ? T[number] : T[keyof T];
```

**Description** : union des types des valeurs d'un objet (pendant de `keyof`), ou des éléments d'un tableau ou d'un tuple. À utiliser pour dériver le type des valeurs d'un objet `as const` (énumération `E…`, table de libellés).

**Exemple**

```ts
import type { ValueOf } from "@etiennea20/adr-misc";

const LOAN_STATUS = { BORROWED: "borrowed", RETURNED: "returned" } as const;
type LoanStatus = ValueOf<typeof LOAN_STATUS>; // "borrowed" | "returned"
```

## function

### `identity`

| Champ          | Valeur                                   |
| -------------- | ---------------------------------------- |
| Catégorie      | `function`                               |
| Point d'entrée | `@etiennea20/adr-misc`                   |
| Statut         | stable                                   |
| Depuis         | 0.2.0                                    |
| Source         | `src/function/identity/identity.ts`      |
| Tests          | `src/function/identity/identity.test.ts` |

**Signature**

```ts
function identity<T>(value: T): T;
```

**Description** : renvoie la valeur reçue, sans la modifier. À utiliser comme fonction par
défaut là où une transformation est attendue (option `format`, `map`), ou pour rendre
explicite qu'aucune transformation n'est appliquée.

**Paramètres**

- `value` : valeur à renvoyer.

**Retour** : `value`, inchangée (même référence pour un objet).

**Erreurs** : aucune.

**Exemple**

```ts
import { identity } from "@etiennea20/adr-misc";

function listTitles(books: IBook[], format: (title: string) => string = identity): string[] {
  return books.map((book) => format(book.title));
}
```

### `IMemoizedFunction`

| Champ          | Valeur                                 |
| -------------- | -------------------------------------- |
| Catégorie      | `function`                             |
| Point d'entrée | `@etiennea20/adr-misc`                 |
| Statut         | stable                                 |
| Depuis         | 0.2.0                                  |
| Source         | `src/function/memoize/memoize.ts`      |
| Tests          | `src/function/memoize/memoize.test.ts` |

**Signature**

```ts
interface IMemoizedFunction<TArgs extends unknown[], TResult> {
  (...args: TArgs): TResult;
  readonly clear: () => void;
}
```

**Description** : fonction renvoyée par `memoize` : même signature que la fonction d'origine,
plus `clear()` qui vide le cache (les appels suivants exécutent à nouveau la fonction).

**Exemple**

```ts
import { memoize, type IMemoizedFunction } from "@etiennea20/adr-misc";

const getAuthor: IMemoizedFunction<[string], IAuthor> = memoize(findAuthor);
getAuthor("a1");
getAuthor.clear();
```

### `IMemoizeOptions`

| Champ          | Valeur                                 |
| -------------- | -------------------------------------- |
| Catégorie      | `function`                             |
| Point d'entrée | `@etiennea20/adr-misc`                 |
| Statut         | stable                                 |
| Depuis         | 0.2.0                                  |
| Source         | `src/function/memoize/memoize.ts`      |
| Tests          | `src/function/memoize/memoize.test.ts` |

**Signature**

```ts
interface IMemoizeOptions<TArgs extends unknown[]> {
  resolveKey?: (...args: TArgs) => unknown;
  maxSize?: number;
}
```

**Description** : options de `memoize`.

- `resolveKey` : calcule la clé de cache à partir des arguments (comparaison `SameValueZero`
  comme une `Map` : deux objets distincts sont deux clés différentes). Par défaut : le premier
  argument.
- `maxSize` : nombre maximal d'entrées ; au-delà, l'entrée utilisée le moins récemment est
  supprimée (LRU). Entier supérieur ou égal à 1, `Infinity` par défaut.

**Exemple**

```ts
import type { IMemoizeOptions } from "@etiennea20/adr-misc";

const options: IMemoizeOptions<[string, number]> = {
  resolveKey: (isbn, page) => `${isbn}:${page}`,
  maxSize: 100,
};
```

### `memoize`

| Champ          | Valeur                                 |
| -------------- | -------------------------------------- |
| Catégorie      | `function`                             |
| Point d'entrée | `@etiennea20/adr-misc`                 |
| Statut         | stable                                 |
| Depuis         | 0.2.0                                  |
| Source         | `src/function/memoize/memoize.ts`      |
| Tests          | `src/function/memoize/memoize.test.ts` |

**Signature**

```ts
function memoize<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => TResult,
  options?: IMemoizeOptions<TArgs>,
): IMemoizedFunction<TArgs, TResult>;
```

**Description** : crée une version de `fn` qui met ses résultats en cache selon ses
arguments. À utiliser pour une fonction **pure** et coûteuse appelée souvent avec les mêmes
arguments. Par défaut, la clé est le premier argument : fournir `resolveKey` dès que la
fonction reçoit plusieurs arguments ou un objet. Les erreurs levées ne sont pas mises en
cache ; pour une fonction asynchrone, c'est la promesse (même rejetée) qui est mise en cache.

**Paramètres**

- `fn` : fonction à mémoïser.
- `options` : `resolveKey` (calcul de la clé) et `maxSize` (taille maximale, LRU).

**Retour** : la fonction mémoïsée, dotée d'une méthode `clear()`.

**Erreurs** : `RangeError` si `maxSize` n'est pas un entier supérieur ou égal à 1.

**Exemple**

```ts
import { memoize } from "@etiennea20/adr-misc";

const countLoans = memoize(
  (memberId: string, year: number) =>
    loans.filter((loan) => loan.memberId === memberId && loan.year === year).length,
  { resolveKey: (memberId, year) => `${memberId}:${year}`, maxSize: 500 },
);

countLoans("m1", 2026); // calculé
countLoans("m1", 2026); // lu dans le cache
```

### `negate`

| Champ          | Valeur                               |
| -------------- | ------------------------------------ |
| Catégorie      | `function`                           |
| Point d'entrée | `@etiennea20/adr-misc`               |
| Statut         | stable                               |
| Depuis         | 0.2.0                                |
| Source         | `src/function/negate/negate.ts`      |
| Tests          | `src/function/negate/negate.test.ts` |

**Signature**

```ts
function negate<TArgs extends unknown[]>(
  predicate: (...args: TArgs) => boolean,
): (...args: TArgs) => boolean;
```

**Description** : crée un prédicat qui renvoie l'inverse de `predicate`. À utiliser pour
réutiliser un prédicat existant dans un `filter`, `some` ou `every` sans fonction fléchée.
Attention : une garde de type (`value is X`) devient un simple prédicat booléen.

**Paramètres**

- `predicate` : prédicat à inverser.

**Retour** : un prédicat de même signature qui renvoie `!predicate(...args)`.

**Erreurs** : aucune.

**Exemple**

```ts
import { negate } from "@etiennea20/adr-misc";

const isReturned = (loan: ILoan): boolean => loan.returnedAt !== undefined;
const ongoingLoans = loans.filter(negate(isReturned));
```

### `noop`

| Champ          | Valeur                           |
| -------------- | -------------------------------- |
| Catégorie      | `function`                       |
| Point d'entrée | `@etiennea20/adr-misc`           |
| Statut         | stable                           |
| Depuis         | 0.2.0                            |
| Source         | `src/function/noop/noop.ts`      |
| Tests          | `src/function/noop/noop.test.ts` |

**Signature**

```ts
function noop(): void;
```

**Description** : fonction qui ne fait rien et renvoie `undefined`. À utiliser comme valeur
par défaut d'un rappel facultatif (`onChange = noop`), pour éviter un test `if (callback)` à
chaque appel, ou pour ignorer volontairement le rejet d'une promesse (`promise.catch(noop)`).

**Retour** : `undefined`.

**Erreurs** : aucune.

**Exemple**

```ts
import { noop } from "@etiennea20/adr-misc";

function notifyLate(loans: ILoan[], onNotified: (loan: ILoan) => void = noop): void {
  for (const loan of loans) {
    sendReminder(loan);
    onNotified(loan);
  }
}
```

### `once`

| Champ          | Valeur                           |
| -------------- | -------------------------------- |
| Catégorie      | `function`                       |
| Point d'entrée | `@etiennea20/adr-misc`           |
| Statut         | stable                           |
| Depuis         | 0.2.0                            |
| Source         | `src/function/once/once.ts`      |
| Tests          | `src/function/once/once.test.ts` |

**Signature**

```ts
function once<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => TResult,
): (...args: TArgs) => TResult;
```

**Description** : crée une fonction qui n'exécute `fn` qu'au premier appel et renvoie ensuite
le résultat mémorisé. À utiliser pour une initialisation paresseuse (connexion, configuration)
ou une action à n'exécuter qu'une fois. Les arguments des appels suivants sont ignorés. Si
`fn` lève, rien n'est mémorisé : l'appel suivant réessaie.

**Paramètres**

- `fn` : fonction à n'exécuter qu'une fois.

**Retour** : une fonction de même signature qui renvoie le résultat du premier appel réussi.

**Erreurs** : aucune (une erreur de `fn` est propagée telle quelle).

**Exemple**

```ts
import { once } from "@etiennea20/adr-misc";

const loadCatalog = once(() => fetchCatalog());

await loadCatalog(); // appelle fetchCatalog
await loadCatalog(); // renvoie la même promesse, sans nouvel appel
```

### `pipe`

| Champ          | Valeur                           |
| -------------- | -------------------------------- |
| Catégorie      | `function`                       |
| Point d'entrée | `@etiennea20/adr-misc`           |
| Statut         | stable                           |
| Depuis         | 0.2.0                            |
| Source         | `src/function/pipe/pipe.ts`      |
| Tests          | `src/function/pipe/pipe.test.ts` |

**Signature**

```ts
function pipe<A extends unknown[], B>(ab: (...args: A) => B): (...args: A) => B;
function pipe<A extends unknown[], B, C>(
  ab: (...args: A) => B,
  bc: (value: B) => C,
): (...args: A) => C;
// … surcharges jusqu'à six fonctions (ab, bc, cd, de, ef, fg)
```

**Description** : compose des fonctions de gauche à droite : la fonction renvoyée appelle
`ab` avec ses arguments, puis passe chaque résultat à la fonction suivante. À utiliser pour
décrire une transformation comme une suite d'étapes lisibles dans l'ordre d'exécution, plutôt
que des appels imbriqués. Types vérifiés d'une étape à l'autre, de 1 à 6 fonctions ; la
première peut recevoir plusieurs arguments, les suivantes un seul.

**Paramètres**

- `ab` : première fonction, appelée avec les arguments de la fonction composée.
- `bc`, `cd`, `de`, `ef`, `fg` : fonctions suivantes (facultatives), chacune appelée avec le
  résultat de la précédente.

**Retour** : une fonction qui reçoit les arguments de `ab` et renvoie le résultat de la
dernière fonction.

**Erreurs** : aucune (une erreur d'une étape est propagée telle quelle).

**Exemple**

```ts
import { pipe } from "@etiennea20/adr-misc";

const toSlug = pipe(
  (title: string) => title.trim().toLowerCase(),
  (title) => title.normalize("NFD").replace(/\p{Diacritic}/gu, ""),
  (title) => title.replace(/[^a-z0-9]+/g, "-"),
);

toSlug("  Les Misérables "); // "les-miserables"
```

## async

### `createDeferred`

| Champ          | Valeur                                              |
| -------------- | --------------------------------------------------- |
| Catégorie      | `async`                                             |
| Point d'entrée | `@etiennea20/adr-misc`                              |
| Statut         | stable                                              |
| Depuis         | 0.2.0                                               |
| Source         | `src/async/create-deferred/create-deferred.ts`      |
| Tests          | `src/async/create-deferred/create-deferred.test.ts` |

**Signature**

```ts
function createDeferred<T>(): IDeferred<T>;
```

**Description** : crée une promesse avec ses fonctions `resolve` et `reject` exposées. À
utiliser quand la promesse est réglée par un code distinct de celui qui la crée : réponse
d'une fenêtre de confirmation, événement d'un autre composant, file d'attente,
synchronisation dans un test. Pour envelopper une API à rappel, préférer `new Promise`.

**Retour** : un objet `{ promise, resolve, reject }`.

**Erreurs** : aucune.

**Exemple**

```ts
import { createDeferred } from "@etiennea20/adr-misc";

function askConfirmation(message: string): Promise<boolean> {
  const deferred = createDeferred<boolean>();
  openDialog({
    message,
    onConfirm: () => deferred.resolve(true),
    onCancel: () => deferred.resolve(false),
  });
  return deferred.promise;
}
```

### `debounce`

| Champ          | Valeur                                |
| -------------- | ------------------------------------- |
| Catégorie      | `async`                               |
| Point d'entrée | `@etiennea20/adr-misc`                |
| Statut         | stable                                |
| Depuis         | 0.2.0                                 |
| Source         | `src/async/debounce/debounce.ts`      |
| Tests          | `src/async/debounce/debounce.test.ts` |

**Signature**

```ts
function debounce<TArgs extends unknown[]>(
  fn: (...args: TArgs) => unknown,
  waitMs: number,
): IDebouncedFunction<TArgs>;
```

**Description** : crée une version de `fn` exécutée seulement après `waitMs` millisecondes
sans nouvel appel. À utiliser pour réagir une seule fois à la fin d'une rafale d'événements
(recherche pendant la saisie, enregistrement automatique). Seul le dernier appel est exécuté,
avec ses arguments. Appeler `cancel()` au démontage d'un composant, ou `flush()` pour ne pas
perdre un appel en attente.

**Paramètres**

- `fn` : fonction à exécuter ; son résultat est ignoré.
- `waitMs` : durée d'inactivité en millisecondes avant l'exécution.

**Retour** : la fonction retardée, dotée de `cancel()` et `flush()`.

**Erreurs** : `RangeError` si `waitMs` est négatif, infini ou `NaN`.

**Exemple**

```ts
import { debounce } from "@etiennea20/adr-misc";

const searchBooks = debounce((query: string) => {
  void loadResults(query);
}, 300);

searchBooks("ger");
searchBooks("germinal"); // seul cet appel est exécuté, 300 ms plus tard
```

### `IDebouncedFunction`

| Champ          | Valeur                                |
| -------------- | ------------------------------------- |
| Catégorie      | `async`                               |
| Point d'entrée | `@etiennea20/adr-misc`                |
| Statut         | stable                                |
| Depuis         | 0.2.0                                 |
| Source         | `src/async/debounce/debounce.ts`      |
| Tests          | `src/async/debounce/debounce.test.ts` |

**Signature**

```ts
interface IDebouncedFunction<TArgs extends unknown[]> {
  (...args: TArgs): void;
  readonly cancel: () => void;
  readonly flush: () => void;
}
```

**Description** : fonction renvoyée par `debounce`. `cancel()` annule l'appel en attente ;
`flush()` l'exécute immédiatement avec les derniers arguments (sans effet s'il n'y en a pas).

**Exemple**

```ts
import { debounce, type IDebouncedFunction } from "@etiennea20/adr-misc";

const save: IDebouncedFunction<[string]> = debounce(saveNote, 500);
save("Brouillon");
save.flush(); // enregistre tout de suite
```

### `IDeferred`

| Champ          | Valeur                                              |
| -------------- | --------------------------------------------------- |
| Catégorie      | `async`                                             |
| Point d'entrée | `@etiennea20/adr-misc`                              |
| Statut         | stable                                              |
| Depuis         | 0.2.0                                               |
| Source         | `src/async/create-deferred/create-deferred.ts`      |
| Tests          | `src/async/create-deferred/create-deferred.test.ts` |

**Signature**

```ts
interface IDeferred<T> {
  readonly promise: Promise<T>;
  readonly resolve: (value: T | PromiseLike<T>) => void;
  readonly reject: (reason?: unknown) => void;
}
```

**Description** : promesse pilotée de l'extérieur, renvoyée par `createDeferred`. `resolve`
et `reject` sont sans effet si la promesse est déjà réglée.

**Exemple**

```ts
import { createDeferred, type IDeferred } from "@etiennea20/adr-misc";

const confirmation: IDeferred<boolean> = createDeferred<boolean>();
confirmation.resolve(true);
await confirmation.promise; // true
```

### `IRetryOptions`

| Champ          | Valeur                          |
| -------------- | ------------------------------- |
| Catégorie      | `async`                         |
| Point d'entrée | `@etiennea20/adr-misc`          |
| Statut         | stable                          |
| Depuis         | 0.2.0                           |
| Source         | `src/async/retry/retry.ts`      |
| Tests          | `src/async/retry/retry.test.ts` |

**Signature**

```ts
interface IRetryOptions {
  attempts?: number;
  delayMs?: number;
  factor?: number;
  maxDelayMs?: number;
  shouldRetry?: (error: unknown, attempt: number) => boolean;
  onRetry?: (error: unknown, attempt: number, delayMs: number) => void;
}
```

**Description** : options de `retry`.

- `attempts` : nombre total de tentatives, première comprise (entier ≥ 1, défaut `3`).
- `delayMs` : délai avant la deuxième tentative (défaut `100`).
- `factor` : multiplicateur du délai à chaque tentative (nombre fini ≥ 1, défaut `2` ; `1`
  donne un délai constant).
- `maxDelayMs` : plafond du délai (défaut `Infinity`).
- `shouldRetry` : renvoie `false` pour relever l'erreur immédiatement (défaut : toujours
  `true`) ; `attempt` est le numéro de la tentative échouée.
- `onRetry` : appelé avant chaque attente (journalisation, métriques).

**Exemple**

```ts
import type { IRetryOptions } from "@etiennea20/adr-misc";

const options: IRetryOptions = {
  attempts: 5,
  delayMs: 500,
  maxDelayMs: 5000,
  shouldRetry: (error) => !(error instanceof TypeError),
};
```

### `IThrottledFunction`

| Champ          | Valeur                                |
| -------------- | ------------------------------------- |
| Catégorie      | `async`                               |
| Point d'entrée | `@etiennea20/adr-misc`                |
| Statut         | stable                                |
| Depuis         | 0.2.0                                 |
| Source         | `src/async/throttle/throttle.ts`      |
| Tests          | `src/async/throttle/throttle.test.ts` |

**Signature**

```ts
interface IThrottledFunction<TArgs extends unknown[]> {
  (...args: TArgs): void;
  readonly cancel: () => void;
}
```

**Description** : fonction renvoyée par `throttle`. `cancel()` annule l'appel différé en
attente et termine la fenêtre en cours.

**Exemple**

```ts
import { throttle, type IThrottledFunction } from "@etiennea20/adr-misc";

const track: IThrottledFunction<[number]> = throttle(sendScrollPosition, 1000);
track(120);
track.cancel();
```

### `IWaitUntilOptions`

| Champ          | Valeur                                    |
| -------------- | ----------------------------------------- |
| Catégorie      | `async`                                   |
| Point d'entrée | `@etiennea20/adr-misc`                    |
| Statut         | stable                                    |
| Depuis         | 0.2.0                                     |
| Source         | `src/async/wait-until/wait-until.ts`      |
| Tests          | `src/async/wait-until/wait-until.test.ts` |

**Signature**

```ts
interface IWaitUntilOptions {
  timeoutMs?: number;
  intervalMs?: number;
  message?: string;
}
```

**Description** : options de `waitUntil`.

- `timeoutMs` : durée maximale d'attente en millisecondes (défaut `5000`).
- `intervalMs` : intervalle entre deux vérifications (défaut `50`).
- `message` : message de la `TimeoutError` (défaut : « La condition n'a pas été remplie en
  `timeoutMs` ms. »).

**Exemple**

```ts
import type { IWaitUntilOptions } from "@etiennea20/adr-misc";

const options: IWaitUntilOptions = {
  timeoutMs: 10_000,
  intervalMs: 500,
  message: "L'import du catalogue n'est pas terminé.",
};
```

### `mapConcurrent`

| Champ          | Valeur                                            |
| -------------- | ------------------------------------------------- |
| Catégorie      | `async`                                           |
| Point d'entrée | `@etiennea20/adr-misc`                            |
| Statut         | stable                                            |
| Depuis         | 0.2.0                                             |
| Source         | `src/async/map-concurrent/map-concurrent.ts`      |
| Tests          | `src/async/map-concurrent/map-concurrent.test.ts` |

**Signature**

```ts
function mapConcurrent<T, R>(
  items: readonly T[],
  mapper: (item: T, index: number) => R | Promise<R>,
  concurrency: number,
): Promise<R[]>;
```

**Description** : applique une fonction asynchrone à chaque élément avec au plus
`concurrency` appels simultanés, et renvoie les résultats dans l'ordre des éléments. À
utiliser à la place de `Promise.all(items.map(mapper))` quand tout lancer d'un coup
surchargerait un serveur ou dépasserait une limite de débit. Comme `Promise.all`, rejetée à
la première erreur : aucun nouvel appel n'est lancé, ceux en cours ne sont pas interrompus.

**Paramètres**

- `items` : éléments à traiter (non modifié).
- `mapper` : fonction appliquée à chaque élément, avec son index.
- `concurrency` : nombre maximal d'appels simultanés (entier ≥ 1).

**Retour** : une promesse du tableau des résultats, dans l'ordre de `items`.

**Erreurs** : promesse rejetée avec une `RangeError` si `concurrency` n'est pas un entier ≥ 1,
ou avec la première erreur levée par `mapper`.

**Exemple**

```ts
import { mapConcurrent } from "@etiennea20/adr-misc";

const covers = await mapConcurrent(
  books,
  (book) => api.get<Blob>(`/books/${book.id}/cover`),
  4, // 4 téléchargements au plus en parallèle
);
```

### `retry`

| Champ          | Valeur                          |
| -------------- | ------------------------------- |
| Catégorie      | `async`                         |
| Point d'entrée | `@etiennea20/adr-misc`          |
| Statut         | stable                          |
| Depuis         | 0.2.0                           |
| Source         | `src/async/retry/retry.ts`      |
| Tests          | `src/async/retry/retry.test.ts` |

**Signature**

```ts
function retry<T>(fn: (attempt: number) => Promise<T>, options?: IRetryOptions): Promise<T>;
```

**Description** : exécute une fonction asynchrone et la relance en cas d'échec, avec un délai
croissant (backoff exponentiel). À utiliser pour une opération qui peut échouer de façon
passagère (réseau instable, service surchargé, verrou en base). Le délai avant la tentative
`n + 1` vaut `delayMs × factor^(n − 1)`, plafonné à `maxDelayMs`. Limiter les relances aux
erreurs passagères avec `shouldRetry`.

**Paramètres**

- `fn` : opération à exécuter ; reçoit le numéro de la tentative (à partir de 1).
- `options` : voir `IRetryOptions`.

**Retour** : une promesse de la valeur produite par la première tentative réussie.

**Erreurs** : promesse rejetée avec la dernière erreur de `fn` (tentatives épuisées ou
`shouldRetry` à `false`), ou avec une `RangeError` si `attempts`, `factor`, `delayMs` ou
`maxDelayMs` est hors limites.

**Exemple**

```ts
import { retry } from "@etiennea20/adr-misc";

const books = await retry(() => api.get<IBook[]>("/books"), {
  attempts: 4,
  delayMs: 500,
  shouldRetry: (error) => isNetworkError(error),
  onRetry: (error, attempt, delayMs) => {
    logger.warn(`Tentative ${attempt} échouée, nouvel essai dans ${delayMs} ms`);
  },
});
```

### `sleep`

| Champ          | Valeur                          |
| -------------- | ------------------------------- |
| Catégorie      | `async`                         |
| Point d'entrée | `@etiennea20/adr-misc`          |
| Statut         | stable                          |
| Depuis         | 0.2.0                           |
| Source         | `src/async/sleep/sleep.ts`      |
| Tests          | `src/async/sleep/sleep.test.ts` |

**Signature**

```ts
function sleep(ms: number): Promise<void>;
```

**Description** : renvoie une promesse résolue après `ms` millisecondes. À utiliser pour
introduire une pause dans une fonction asynchrone (attente entre deux appels, limitation de
débit). Ne bloque pas le fil d'exécution ; compatible avec `vi.useFakeTimers()`.

**Paramètres**

- `ms` : durée de la pause en millisecondes (nombre fini, positif ou nul).

**Retour** : une promesse résolue sans valeur à l'issue du délai.

**Erreurs** : promesse rejetée avec une `RangeError` si `ms` est négatif, infini ou `NaN`.

**Exemple**

```ts
import { sleep } from "@etiennea20/adr-misc";

for (const member of lateMembers) {
  await sendReminder(member);
  await sleep(200); // ne pas saturer le serveur de messagerie
}
```

### `throttle`

| Champ          | Valeur                                |
| -------------- | ------------------------------------- |
| Catégorie      | `async`                               |
| Point d'entrée | `@etiennea20/adr-misc`                |
| Statut         | stable                                |
| Depuis         | 0.2.0                                 |
| Source         | `src/async/throttle/throttle.ts`      |
| Tests          | `src/async/throttle/throttle.test.ts` |

**Signature**

```ts
function throttle<TArgs extends unknown[]>(
  fn: (...args: TArgs) => unknown,
  waitMs: number,
): IThrottledFunction<TArgs>;
```

**Description** : crée une version de `fn` exécutée au plus une fois toutes les `waitMs`
millisecondes. À utiliser pour limiter la fréquence d'une action déclenchée en continu
(défilement, suivi de progression) tout en restant réactif : le premier appel est exécuté
immédiatement, les suivants pendant la fenêtre sont regroupés et le dernier est exécuté à la
fin de la fenêtre.

**Paramètres**

- `fn` : fonction à exécuter ; son résultat est ignoré.
- `waitMs` : intervalle minimal en millisecondes entre deux exécutions.

**Retour** : la fonction limitée, dotée de `cancel()`.

**Erreurs** : `RangeError` si `waitMs` est négatif, infini ou `NaN`.

**Exemple**

```ts
import { throttle } from "@etiennea20/adr-misc";

const reportProgress = throttle((percent: number) => {
  void api.post("/imports/progress", { percent });
}, 1000);
```

### `TimeoutError`

| Champ          | Valeur                                          |
| -------------- | ----------------------------------------------- |
| Catégorie      | `async`                                         |
| Point d'entrée | `@etiennea20/adr-misc`                          |
| Statut         | stable                                          |
| Depuis         | 0.2.0                                           |
| Source         | `src/async/timeout-error/timeout-error.ts`      |
| Tests          | `src/async/timeout-error/timeout-error.test.ts` |

**Signature**

```ts
class TimeoutError extends Error {
  readonly name: "TimeoutError";
  constructor(message?: string);
}
```

**Description** : erreur levée quand une opération dépasse son délai (par `withTimeout` et
`waitUntil`). À tester avec `instanceof` pour distinguer un dépassement de délai des autres
erreurs. Message par défaut : « Le délai d'attente est dépassé. »

**Exemple**

```ts
import { TimeoutError, withTimeout } from "@etiennea20/adr-misc";

try {
  await withTimeout(fetchCatalog(), 5000);
} catch (error) {
  if (error instanceof TimeoutError) {
    showToast("Le catalogue met trop de temps à répondre.");
  }
}
```

### `waitUntil`

| Champ          | Valeur                                    |
| -------------- | ----------------------------------------- |
| Catégorie      | `async`                                   |
| Point d'entrée | `@etiennea20/adr-misc`                    |
| Statut         | stable                                    |
| Depuis         | 0.2.0                                     |
| Source         | `src/async/wait-until/wait-until.ts`      |
| Tests          | `src/async/wait-until/wait-until.test.ts` |

**Signature**

```ts
function waitUntil(
  predicate: () => boolean | Promise<boolean>,
  options?: IWaitUntilOptions,
): Promise<void>;
```

**Description** : vérifie une condition à intervalle régulier jusqu'à ce qu'elle soit vraie,
ou jusqu'à l'expiration du délai. À utiliser pour attendre un état qui ne fournit ni promesse
ni événement (sondage d'une API, ressource disponible, test d'intégration). La condition peut
être synchrone ou asynchrone ; elle est vérifiée immédiatement puis toutes les `intervalMs`.
Une erreur levée par la condition interrompt l'attente.

**Paramètres**

- `predicate` : condition à attendre ; renvoie `true` (ou une promesse de `true`).
- `options` : voir `IWaitUntilOptions`.

**Retour** : une promesse résolue dès que la condition est vraie.

**Erreurs** : promesse rejetée avec une `TimeoutError` si le délai expire, ou une
`RangeError` si `timeoutMs` ou `intervalMs` est négatif, infini ou `NaN`.

**Exemple**

```ts
import { waitUntil } from "@etiennea20/adr-misc";

await api.post("/catalog/imports", file);
await waitUntil(async () => (await api.get<IImportStatus>("/catalog/imports/last")).done, {
  timeoutMs: 60_000,
  intervalMs: 2000,
});
```

### `withTimeout`

| Champ          | Valeur                                        |
| -------------- | --------------------------------------------- |
| Catégorie      | `async`                                       |
| Point d'entrée | `@etiennea20/adr-misc`                        |
| Statut         | stable                                        |
| Depuis         | 0.2.0                                         |
| Source         | `src/async/with-timeout/with-timeout.ts`      |
| Tests          | `src/async/with-timeout/with-timeout.test.ts` |

**Signature**

```ts
function withTimeout<T>(promise: Promise<T>, ms: number, message?: string): Promise<T>;
```

**Description** : attend une promesse en limitant la durée d'attente. À utiliser pour ne pas
rester bloqué sur une opération qui peut ne jamais aboutir (appel réseau, service lent).
Attention : l'opération d'origine n'est pas annulée, seule l'attente l'est (utiliser un
`AbortController` pour l'annuler réellement).

**Paramètres**

- `promise` : promesse à attendre.
- `ms` : délai maximal en millisecondes (nombre fini, positif ou nul).
- `message` : message de la `TimeoutError` (défaut : « Délai d'attente de `ms` ms dépassé. »).

**Retour** : une promesse réglée comme `promise` si elle se règle à temps.

**Erreurs** : promesse rejetée avec une `TimeoutError` si le délai expire, ou une
`RangeError` si `ms` est négatif, infini ou `NaN`.

**Exemple**

```ts
import { withTimeout } from "@etiennea20/adr-misc";

const books = await withTimeout(
  api.get<IBook[]>("/books"),
  5000,
  "Le catalogue met trop de temps à répondre.",
);
```

## array

### `chunk`

| Champ          | Valeur                          |
| -------------- | ------------------------------- |
| Catégorie      | `array`                         |
| Point d'entrée | `@etiennea20/adr-misc`          |
| Statut         | stable                          |
| Depuis         | 0.2.0                           |
| Source         | `src/array/chunk/chunk.ts`      |
| Tests          | `src/array/chunk/chunk.test.ts` |

**Signature**

```ts
function chunk<T>(items: readonly T[], size: number): T[][];
```

**Description** : découpe un tableau en paquets de taille fixe ; le dernier paquet peut être plus court. À utiliser pour paginer une liste côté client, afficher une grille ligne par ligne ou envoyer des requêtes par lots. Le tableau d'origine n'est pas modifié.

**Paramètres**

- `items` : tableau à découper.
- `size` : nombre d'éléments par paquet (entier supérieur ou égal à 1).

**Retour** : un nouveau tableau de paquets (vide si `items` est vide).

**Erreurs** : `RangeError` si `size` n'est pas un entier supérieur ou égal à 1.

**Exemple**

```ts
import { chunk } from "@etiennea20/adr-misc";

chunk([1, 2, 3, 4, 5], 2); // [[1, 2], [3, 4], [5]]
```

### `compact`

| Champ          | Valeur                              |
| -------------- | ----------------------------------- |
| Catégorie      | `array`                             |
| Point d'entrée | `@etiennea20/adr-misc`              |
| Statut         | stable                              |
| Depuis         | 0.2.0                               |
| Source         | `src/array/compact/compact.ts`      |
| Tests          | `src/array/compact/compact.test.ts` |

**Signature**

```ts
function compact<T>(items: readonly T[]): Exclude<T, null | undefined | false | 0 | 0n | "">[];
```

**Description** : retire d'un tableau les valeurs « falsy » : `null`, `undefined`, `false`, `0`, `0n`, `""` et `NaN`. À utiliser pour nettoyer une liste construite conditionnellement (classes CSS, filtres optionnels, résultats de `map` qui renvoient `undefined`…). Le type des éléments est affiné. Attention : `0` et `""` sont aussi retirés ; pour ne retirer que `null` et `undefined`, filtrer avec une garde dédiée. Le tableau d'origine n'est pas modifié.

**Paramètres**

- `items` : tableau à nettoyer.

**Retour** : un nouveau tableau sans les valeurs falsy.

**Erreurs** : aucune.

**Exemple**

```ts
import { compact } from "@etiennea20/adr-misc";

compact(["roman", null, "", undefined, "policier"]); // ["roman", "policier"]
compact([0, 1, false, 2, Number.NaN]); // [1, 2]
```

### `countBy`

| Champ          | Valeur                                |
| -------------- | ------------------------------------- |
| Catégorie      | `array`                               |
| Point d'entrée | `@etiennea20/adr-misc`                |
| Statut         | stable                                |
| Depuis         | 0.2.0                                 |
| Source         | `src/array/count-by/count-by.ts`      |
| Tests          | `src/array/count-by/count-by.test.ts` |

**Signature**

```ts
function countBy<T, K extends PropertyKey>(
  items: readonly T[],
  getKey: (item: T, index: number) => K,
): Partial<Record<K, number>>;
```

**Description** : compte les éléments d'un tableau par clé calculée. À utiliser pour produire des statistiques simples (nombre de livres par genre, d'emprunts par statut…). Seules les clés rencontrées sont présentes dans le résultat, d'où le type `Partial`. Les clés sont stockées comme propriétés propres : une clé `"__proto__"` ne modifie pas le prototype du résultat.

**Paramètres**

- `items` : tableau à analyser.
- `getKey` : calcule la clé d'un élément (reçoit aussi son index).

**Retour** : un objet qui associe chaque clé rencontrée à son nombre d'occurrences.

**Erreurs** : aucune.

**Exemple**

```ts
import { countBy } from "@etiennea20/adr-misc";

countBy(books, (book) => book.genre); // { roman: 2, essai: 1 }
```

### `difference`

| Champ          | Valeur                                    |
| -------------- | ----------------------------------------- |
| Catégorie      | `array`                                   |
| Point d'entrée | `@etiennea20/adr-misc`                    |
| Statut         | stable                                    |
| Depuis         | 0.2.0                                     |
| Source         | `src/array/difference/difference.ts`      |
| Tests          | `src/array/difference/difference.test.ts` |

**Signature**

```ts
function difference<T>(
  items: readonly T[],
  excluded: readonly T[],
  getKey: (item: T) => unknown = (item) => item,
): T[];
```

**Description** : renvoie les éléments du premier tableau absents du second. À utiliser pour retirer d'une liste les éléments déjà traités (livres déjà empruntés, identifiants déjà sélectionnés…). L'ordre et les doublons du premier tableau sont conservés. Les éléments sont comparés avec `SameValueZero` (comme `Set`), ou par la clé renvoyée par `getKey` pour comparer des objets par identifiant. Aucun tableau n'est modifié.

**Paramètres**

- `items` : tableau de départ.
- `excluded` : éléments à retirer.
- `getKey` : calcule la clé de comparaison d'un élément. Par défaut, l'élément lui-même.

**Retour** : un nouveau tableau avec les éléments de `items` absents de `excluded`.

**Erreurs** : aucune.

**Exemple**

```ts
import { difference } from "@etiennea20/adr-misc";

difference([1, 2, 3, 4], [2, 4]); // [1, 3]
difference(books, borrowedBooks, (book) => book.id); // livres disponibles
```

### `groupBy`

| Champ          | Valeur                                |
| -------------- | ------------------------------------- |
| Catégorie      | `array`                               |
| Point d'entrée | `@etiennea20/adr-misc`                |
| Statut         | stable                                |
| Depuis         | 0.2.0                                 |
| Source         | `src/array/group-by/group-by.ts`      |
| Tests          | `src/array/group-by/group-by.test.ts` |

**Signature**

```ts
function groupBy<T, K extends PropertyKey>(
  items: readonly T[],
  getKey: (item: T, index: number) => K,
): Partial<Record<K, T[]>>;
```

**Description** : regroupe les éléments d'un tableau par clé calculée. À utiliser pour afficher une liste par sections (livres par genre, emprunts par adhérent…). Équivalent de `Object.groupBy`, absent d'ES2022. Seules les clés rencontrées sont présentes, d'où le type `Partial`. L'ordre des éléments est conservé dans chaque groupe. Les clés sont stockées comme propriétés propres : une clé `"__proto__"` ne modifie pas le prototype.

**Paramètres**

- `items` : tableau à regrouper.
- `getKey` : calcule la clé de groupe d'un élément (reçoit aussi son index).

**Retour** : un objet qui associe chaque clé rencontrée au tableau de ses éléments.

**Erreurs** : aucune.

**Exemple**

```ts
import { groupBy } from "@etiennea20/adr-misc";

groupBy(books, (book) => book.genre);
// { roman: [germinal, nana], essai: [deuxiemeSexe] }
```

### `intersection`

| Champ          | Valeur                                        |
| -------------- | --------------------------------------------- |
| Catégorie      | `array`                                       |
| Point d'entrée | `@etiennea20/adr-misc`                        |
| Statut         | stable                                        |
| Depuis         | 0.2.0                                         |
| Source         | `src/array/intersection/intersection.ts`      |
| Tests          | `src/array/intersection/intersection.test.ts` |

**Signature**

```ts
function intersection<T>(
  items: readonly T[],
  others: readonly T[],
  getKey: (item: T) => unknown = (item) => item,
): T[];
```

**Description** : renvoie les éléments du premier tableau également présents dans le second, sans doublon. À utiliser pour trouver les éléments communs à deux listes (livres réservés et disponibles, droits communs à deux rôles…). L'ordre suit le premier tableau. Les éléments sont comparés avec `SameValueZero` (comme `Set`), ou par la clé renvoyée par `getKey` pour comparer des objets par identifiant ; l'élément conservé est celui du premier tableau. Aucun tableau n'est modifié.

**Paramètres**

- `items` : tableau de référence (ordre et éléments renvoyés).
- `others` : tableau avec lequel chercher les éléments communs.
- `getKey` : calcule la clé de comparaison d'un élément. Par défaut, l'élément lui-même.

**Retour** : un nouveau tableau des éléments communs, sans doublon.

**Erreurs** : aucune.

**Exemple**

```ts
import { intersection } from "@etiennea20/adr-misc";

intersection([1, 2, 2, 3], [2, 3, 4]); // [2, 3]
intersection(reservedBooks, availableBooks, (book) => book.id);
```

### `ISortByCriterion`

| Champ          | Valeur                              |
| -------------- | ----------------------------------- |
| Catégorie      | `array`                             |
| Point d'entrée | `@etiennea20/adr-misc`              |
| Statut         | stable                              |
| Depuis         | 0.2.0                               |
| Source         | `src/array/sort-by/sort-by.ts`      |
| Tests          | `src/array/sort-by/sort-by.test.ts` |

**Signature**

```ts
interface ISortByCriterion<T> {
  /** Extrait d'un élément la valeur à comparer. */
  by: (item: T) => SortByValue;
  /**
   * Sens du tri : croissant (`"asc"`) ou décroissant (`"desc"`).
   *
   * @defaultValue `"asc"`
   */
  direction?: "asc" | "desc";
}
```

**Description** : critère de tri détaillé de `sortBy` : valeur à comparer et sens du tri.

**Exemple**

```ts
import type { ISortByCriterion } from "@etiennea20/adr-misc";

const byNewest: ISortByCriterion<IBook> = {
  by: (book) => book.publishedAt,
  direction: "desc",
};
```

### `keyBy`

| Champ          | Valeur                            |
| -------------- | --------------------------------- |
| Catégorie      | `array`                           |
| Point d'entrée | `@etiennea20/adr-misc`            |
| Statut         | stable                            |
| Depuis         | 0.2.0                             |
| Source         | `src/array/key-by/key-by.ts`      |
| Tests          | `src/array/key-by/key-by.test.ts` |

**Signature**

```ts
function keyBy<T, K extends PropertyKey>(
  items: readonly T[],
  getKey: (item: T, index: number) => K,
): Partial<Record<K, T>>;
```

**Description** : indexe les éléments d'un tableau par clé calculée. À utiliser pour accéder rapidement à un élément par identifiant (`booksById[id]`) au lieu de chercher dans le tableau à chaque fois. Si plusieurs éléments ont la même clé, le dernier l'emporte. Seules les clés rencontrées sont présentes, d'où le type `Partial`. Les clés sont stockées comme propriétés propres : une clé `"__proto__"` ne modifie pas le prototype.

**Paramètres**

- `items` : tableau à indexer.
- `getKey` : calcule la clé d'un élément (reçoit aussi son index).

**Retour** : un objet qui associe chaque clé au dernier élément qui la porte.

**Erreurs** : aucune.

**Exemple**

```ts
import { keyBy } from "@etiennea20/adr-misc";

const booksById = keyBy(books, (book) => book.id);
booksById["b-42"]?.title; // "Germinal"
```

### `moveItem`

| Champ          | Valeur                                  |
| -------------- | --------------------------------------- |
| Catégorie      | `array`                                 |
| Point d'entrée | `@etiennea20/adr-misc`                  |
| Statut         | stable                                  |
| Depuis         | 0.2.0                                   |
| Source         | `src/array/move-item/move-item.ts`      |
| Tests          | `src/array/move-item/move-item.test.ts` |

**Signature**

```ts
function moveItem<T>(items: readonly T[], fromIndex: number, toIndex: number): T[];
```

**Description** : déplace un élément d'une position à une autre et renvoie le nouveau tableau. À utiliser pour réordonner une liste après un glisser-déposer (ordre de lecture, priorité des réservations…). Les autres éléments se décalent pour combler la place libérée. Le tableau d'origine n'est pas modifié.

**Paramètres**

- `items` : tableau à réordonner.
- `fromIndex` : position actuelle de l'élément (entier de `0` à `items.length - 1`).
- `toIndex` : position finale de l'élément (entier de `0` à `items.length - 1`).

**Retour** : un nouveau tableau avec l'élément déplacé.

**Erreurs** : `RangeError` si `fromIndex` ou `toIndex` n'est pas un entier compris entre `0` et `items.length - 1` (donc toujours pour un tableau vide).

**Exemple**

```ts
import { moveItem } from "@etiennea20/adr-misc";

moveItem(["a", "b", "c", "d"], 0, 2); // ["b", "c", "a", "d"]
moveItem(["a", "b", "c", "d"], 3, 1); // ["a", "d", "b", "c"]
```

### `partition`

| Champ          | Valeur                                  |
| -------------- | --------------------------------------- |
| Catégorie      | `array`                                 |
| Point d'entrée | `@etiennea20/adr-misc`                  |
| Statut         | stable                                  |
| Depuis         | 0.2.0                                   |
| Source         | `src/array/partition/partition.ts`      |
| Tests          | `src/array/partition/partition.test.ts` |

**Signature**

```ts
function partition<T, S extends T>(
  items: readonly T[],
  predicate: (item: T, index: number) => item is S,
): [S[], Exclude<T, S>[]];
function partition<T>(
  items: readonly T[],
  predicate: (item: T, index: number) => boolean,
): [T[], T[]];
```

**Description** : sépare un tableau en deux : les éléments qui vérifient le prédicat, puis les autres. À utiliser à la place de deux `filter` opposés (emprunts en cours / rendus, adhérents actifs / inactifs…). Avec un prédicat de type (`item is S`), les deux tableaux sont typés précisément. L'ordre est conservé et le tableau d'origine n'est pas modifié.

**Paramètres**

- `items` : tableau à séparer.
- `predicate` : prédicat appelé avec l'élément et son index.

**Retour** : un tuple `[pass, fail]` : éléments qui vérifient le prédicat, puis les autres.

**Erreurs** : aucune.

**Exemple**

```ts
import { partition } from "@etiennea20/adr-misc";

const [returned, ongoing] = partition(loans, (loan) => loan.returnedAt !== undefined);
const [labels, counts] = partition(["a", 1, "b", 2], (value) => typeof value === "string");

const [adults, minors] = partition(members, (member) => member.age >= 18);
```

### `range`

| Champ          | Valeur                          |
| -------------- | ------------------------------- |
| Catégorie      | `array`                         |
| Point d'entrée | `@etiennea20/adr-misc`          |
| Statut         | stable                          |
| Depuis         | 0.2.0                           |
| Source         | `src/array/range/range.ts`      |
| Tests          | `src/array/range/range.test.ts` |

**Signature**

```ts
function range(start: number, end: number, step = 1): number[];
```

**Description** : génère une suite de nombres de `start` (inclus) à `end` (exclu), avec un pas donné, comme `range` en Python. À utiliser pour construire des listes de nombres (années d'un sélecteur, numéros de page, créneaux…). Un pas négatif produit une suite décroissante ; si le pas ne va pas de `start` vers `end`, le résultat est vide (`range(5, 0)` renvoie `[]`, comme en Python). Chaque valeur est calculée par `start + index * step` pour limiter l'accumulation d'erreurs d'arrondi.

**Paramètres**

- `start` : première valeur (incluse).
- `end` : borne de fin (exclue).
- `step` : écart entre deux valeurs, positif ou négatif, non nul.

**Retour** : un nouveau tableau de nombres, éventuellement vide.

**Erreurs** : `RangeError` si `step` vaut `0`, ou si `start`, `end` ou `step` n'est pas un nombre fini.

**Exemple**

```ts
import { range } from "@etiennea20/adr-misc";

range(0, 5); // [0, 1, 2, 3, 4]
range(2020, 2030, 5); // [2020, 2025]
range(5, 0, -2); // [5, 3, 1]
```

### `sortBy`

| Champ          | Valeur                              |
| -------------- | ----------------------------------- |
| Catégorie      | `array`                             |
| Point d'entrée | `@etiennea20/adr-misc`              |
| Statut         | stable                              |
| Depuis         | 0.2.0                               |
| Source         | `src/array/sort-by/sort-by.ts`      |
| Tests          | `src/array/sort-by/sort-by.test.ts` |

**Signature**

```ts
function sortBy<T>(
  items: readonly T[],
  ...criteria: [SortByCriterion<T>, ...SortByCriterion<T>[]]
): T[];
```

**Description** : trie un tableau selon un ou plusieurs critères et renvoie un nouveau tableau. À utiliser pour trier des listes d'objets (livres par auteur puis par titre, emprunts par date de retour…). Le tri est stable : à égalité sur tous les critères, l'ordre d'origine est conservé. Chaque critère est une fonction (tri croissant) ou un objet `{ by, direction: "asc" | "desc" }` ; le critère suivant départage les égalités du précédent. Les chaînes sont comparées dans l'ordre alphabétique français (accents compris), et `null`, `undefined` et `NaN` sont toujours placés en dernier. Chaque critère n'est évalué qu'une fois par élément. Le tableau d'origine n'est pas modifié.

**Paramètres**

- `items` : tableau à trier.
- `criteria` : un ou plusieurs critères de tri, par ordre de priorité.

**Retour** : un nouveau tableau trié.

**Erreurs** : aucune.

**Exemple**

```ts
import { sortBy } from "@etiennea20/adr-misc";

sortBy(books, (book) => book.author, {
  by: (book) => book.year,
  direction: "desc",
});
sortBy(["Émile", "eva", "Zoé"], (name) => name); // ["Émile", "eva", "Zoé"]
```

### `SortByCriterion`

| Champ          | Valeur                              |
| -------------- | ----------------------------------- |
| Catégorie      | `array`                             |
| Point d'entrée | `@etiennea20/adr-misc`              |
| Statut         | stable                              |
| Depuis         | 0.2.0                               |
| Source         | `src/array/sort-by/sort-by.ts`      |
| Tests          | `src/array/sort-by/sort-by.test.ts` |

**Signature**

```ts
type SortByCriterion<T> = ((item: T) => SortByValue) | ISortByCriterion<T>;
```

**Description** : critère de tri accepté par `sortBy` : une fonction (tri croissant) ou un objet `ISortByCriterion` qui précise le sens.

**Exemple**

```ts
import type { SortByCriterion } from "@etiennea20/adr-misc";

const criteria: SortByCriterion<IBook>[] = [
  (book) => book.author,
  { by: (book) => book.year, direction: "desc" },
];
```

### `SortByValue`

| Champ          | Valeur                              |
| -------------- | ----------------------------------- |
| Catégorie      | `array`                             |
| Point d'entrée | `@etiennea20/adr-misc`              |
| Statut         | stable                              |
| Depuis         | 0.2.0                               |
| Source         | `src/array/sort-by/sort-by.ts`      |
| Tests          | `src/array/sort-by/sort-by.test.ts` |

**Signature**

```ts
type SortByValue = string | number | bigint | boolean | Date | null | undefined;
```

**Description** : valeur de tri renvoyée par un critère de `sortBy`. Les nombres, `bigint`, booléens (`false` avant `true`) et dates sont comparés numériquement, les chaînes avec l'ordre alphabétique français (`Intl.Collator("fr")`). `null`, `undefined`, `NaN` et les dates invalides sont toujours placés en dernier.

**Exemple**

```ts
import type { SortByValue } from "@etiennea20/adr-misc";

const getDueDate = (loan: ILoan): SortByValue => loan.dueDate ?? null;
```

### `toggleItem`

| Champ          | Valeur                                      |
| -------------- | ------------------------------------------- |
| Catégorie      | `array`                                     |
| Point d'entrée | `@etiennea20/adr-misc`                      |
| Statut         | stable                                      |
| Depuis         | 0.2.0                                       |
| Source         | `src/array/toggle-item/toggle-item.ts`      |
| Tests          | `src/array/toggle-item/toggle-item.test.ts` |

**Signature**

```ts
function toggleItem<T>(
  items: readonly T[],
  item: T,
  getKey: (item: T) => unknown = (value) => value,
): T[];
```

**Description** : ajoute un élément à un tableau s'il en est absent, ou le retire s'il est présent. À utiliser pour gérer une sélection multiple (cases à cocher, filtres actifs, livres sélectionnés…). L'élément ajouté est placé à la fin ; s'il est présent, toutes ses occurrences sont retirées. Les éléments sont comparés avec `SameValueZero`, ou par la clé renvoyée par `getKey` pour comparer des objets par identifiant. Le tableau d'origine n'est pas modifié.

**Paramètres**

- `items` : tableau de départ (la sélection courante).
- `item` : élément à ajouter ou retirer.
- `getKey` : calcule la clé de comparaison d'un élément. Par défaut, l'élément lui-même.

**Retour** : un nouveau tableau avec l'élément ajouté ou retiré.

**Erreurs** : aucune.

**Exemple**

```ts
import { toggleItem } from "@etiennea20/adr-misc";

toggleItem(["roman", "essai"], "essai"); // ["roman"]
toggleItem(["roman"], "bd"); // ["roman", "bd"]
toggleItem(selectedBooks, book, (candidate) => candidate.id);
```

### `unique`

| Champ          | Valeur                            |
| -------------- | --------------------------------- |
| Catégorie      | `array`                           |
| Point d'entrée | `@etiennea20/adr-misc`            |
| Statut         | stable                            |
| Depuis         | 0.2.0                             |
| Source         | `src/array/unique/unique.ts`      |
| Tests          | `src/array/unique/unique.test.ts` |

**Signature**

```ts
function unique<T>(items: readonly T[]): T[];
```

**Description** : retire les doublons d'un tableau en conservant la première occurrence de chaque valeur. À utiliser pour dédoublonner des valeurs simples (identifiants, genres, tags…). Les valeurs sont comparées avec `SameValueZero` (comme `Set`) : deux objets distincts de même contenu sont conservés ; pour comparer des objets par identifiant, utiliser `uniqueBy`. Le tableau d'origine n'est pas modifié.

**Paramètres**

- `items` : tableau à dédoublonner.

**Retour** : un nouveau tableau sans doublon, dans l'ordre des premières occurrences.

**Erreurs** : aucune.

**Exemple**

```ts
import { unique } from "@etiennea20/adr-misc";

unique(["roman", "essai", "roman"]); // ["roman", "essai"]
```

### `uniqueBy`

| Champ          | Valeur                                  |
| -------------- | --------------------------------------- |
| Catégorie      | `array`                                 |
| Point d'entrée | `@etiennea20/adr-misc`                  |
| Statut         | stable                                  |
| Depuis         | 0.2.0                                   |
| Source         | `src/array/unique-by/unique-by.ts`      |
| Tests          | `src/array/unique-by/unique-by.test.ts` |

**Signature**

```ts
function uniqueBy<T>(items: readonly T[], getKey: (item: T, index: number) => unknown): T[];
```

**Description** : retire les doublons d'un tableau selon une clé calculée, en conservant le premier élément de chaque clé. À utiliser pour dédoublonner des objets (livres par ISBN, adhérents par e-mail…). Les clés sont comparées avec `SameValueZero` (comme `Set`). Le tableau d'origine n'est pas modifié.

**Paramètres**

- `items` : tableau à dédoublonner.
- `getKey` : calcule la clé d'un élément (reçoit aussi son index).

**Retour** : un nouveau tableau sans doublon de clé, dans l'ordre des premières occurrences.

**Erreurs** : aucune.

**Exemple**

```ts
import { uniqueBy } from "@etiennea20/adr-misc";

uniqueBy(books, (book) => book.isbn);
uniqueBy(members, (member) => member.email.toLowerCase());
```

### `zip`

| Champ          | Valeur                      |
| -------------- | --------------------------- |
| Catégorie      | `array`                     |
| Point d'entrée | `@etiennea20/adr-misc`      |
| Statut         | stable                      |
| Depuis         | 0.2.0                       |
| Source         | `src/array/zip/zip.ts`      |
| Tests          | `src/array/zip/zip.test.ts` |

**Signature**

```ts
function zip<A, B>(first: readonly A[], second: readonly B[]): [A, B][];
```

**Description** : associe deux tableaux élément par élément en paires `[a, b]`. À utiliser pour parcourir deux listes parallèles (libellés et valeurs, en-têtes et cellules d'une ligne CSV…). Comme en Python, le résultat s'arrête au tableau le plus court : aucune paire ne contient de `undefined` ajouté. Aucun tableau n'est modifié.

**Paramètres**

- `first` : premier tableau.
- `second` : second tableau.

**Retour** : un nouveau tableau de paires, de la longueur du tableau le plus court.

**Erreurs** : aucune.

**Exemple**

```ts
import { zip } from "@etiennea20/adr-misc";

zip(["Titre", "Auteur"], ["Germinal", "Zola"]); // [["Titre", "Germinal"], ["Auteur", "Zola"]]
zip([1, 2, 3], ["a"]); // [[1, "a"]]
```

## object

### `deepClone`

| Champ          | Valeur                                     |
| -------------- | ------------------------------------------ |
| Catégorie      | `object`                                   |
| Point d'entrée | `@etiennea20/adr-misc`                     |
| Statut         | stable                                     |
| Depuis         | 0.2.0                                      |
| Source         | `src/object/deep-clone/deep-clone.ts`      |
| Tests          | `src/object/deep-clone/deep-clone.test.ts` |

**Signature**

```ts
function deepClone<T>(value: T): T;
```

**Description** : crée une copie profonde d'une valeur. À utiliser pour obtenir une copie indépendante d'un état ou d'un objet de configuration avant de le modifier (brouillon de formulaire, annulation…). Copie les objets simples, tableaux, `Date`, `RegExp`, `Map` (clés et valeurs) et `Set`, et préserve les références circulaires et partagées. Les autres objets (instances de classe, fonctions, erreurs…) sont repris par référence. Seules les propriétés propres, énumérables et à clé chaîne des objets simples sont copiées. Alternative portable à `structuredClone`, absent de la lib ES2022.

**Paramètres**

- `value` : valeur à copier (non modifiée).

**Retour** : une copie profonde de même type.

**Erreurs** : aucune.

**Exemple**

```ts
import { deepClone } from "@etiennea20/adr-misc";

const draft = deepClone(member);
draft.address.city = "Lyon"; // member.address.city est inchangé
```

### `deepMerge`

| Champ          | Valeur                                     |
| -------------- | ------------------------------------------ |
| Catégorie      | `object`                                   |
| Point d'entrée | `@etiennea20/adr-misc`                     |
| Statut         | stable                                     |
| Depuis         | 0.2.0                                      |
| Source         | `src/object/deep-merge/deep-merge.ts`      |
| Tests          | `src/object/deep-merge/deep-merge.test.ts` |

**Signature**

```ts
function deepMerge<T extends object>(target: T, ...sources: NoInfer<DeepMergePatch<T>>[]): T;
```

**Description** : fusionne récursivement une ou plusieurs sources dans une copie de l'objet cible. À utiliser pour appliquer des réglages partiels à une configuration par défaut (options d'un composant, paramètres d'une bibliothèque…). Les objets simples sont fusionnés récursivement ; toute autre valeur (tableau, date, `Map`, instance de classe…) remplace la valeur cible. Les valeurs `undefined` des sources sont ignorées ; les sources sont appliquées dans l'ordre, la dernière l'emporte. Aucun argument n'est modifié : les objets simples (de la cible comme des sources) sont recopiés, les autres valeurs sont reprises par référence. Les clés `__proto__`, `constructor` et `prototype` des sources sont ignorées (protection contre la pollution de prototype, par exemple avec des données issues de `JSON.parse`).

**Paramètres**

- `target` : objet de départ, par exemple la configuration par défaut.
- `sources` : valeurs partielles à appliquer dans l'ordre.

**Retour** : un nouvel objet fusionné, du type de la cible.

**Erreurs** : aucune.

**Exemple**

```ts
import { deepMerge } from "@etiennea20/adr-misc";

const settings = deepMerge(
  { loans: { maxDays: 14, maxBooks: 5 }, theme: "clair" },
  { loans: { maxDays: 21 } },
);
// { loans: { maxDays: 21, maxBooks: 5 }, theme: "clair" }
```

### `DeepMergePatch`

| Champ          | Valeur                                     |
| -------------- | ------------------------------------------ |
| Catégorie      | `object`                                   |
| Point d'entrée | `@etiennea20/adr-misc`                     |
| Statut         | stable                                     |
| Depuis         | 0.2.0                                      |
| Source         | `src/object/deep-merge/deep-merge.ts`      |
| Tests          | `src/object/deep-merge/deep-merge.test.ts` |

**Signature**

```ts
type DeepMergePatch<T> = T extends
  | readonly unknown[]
  | Date
  | RegExp
  | ReadonlyMap<unknown, unknown>
  | ReadonlySet<unknown>
  | ((...args: never[]) => unknown)
  ? T
  : T extends object
    ? { [K in keyof T]?: DeepMergePatch<T[K]> }
    : T;
```

**Description** : valeur partielle acceptée par `deepMerge` pour un type `T` : les objets simples sont partiels à tous les niveaux, tandis que les tableaux, dates, `Map`, `Set`, expressions régulières et fonctions doivent être fournis en entier (ils remplacent la valeur existante).

**Exemple**

```ts
import type { DeepMergePatch } from "@etiennea20/adr-misc";

const patch: DeepMergePatch<ISettings> = { loans: { maxDays: 21 } };
```

### `flattenObject`

| Champ          | Valeur                                             |
| -------------- | -------------------------------------------------- |
| Catégorie      | `object`                                           |
| Point d'entrée | `@etiennea20/adr-misc`                             |
| Statut         | stable                                             |
| Depuis         | 0.2.0                                              |
| Source         | `src/object/flatten-object/flatten-object.ts`      |
| Tests          | `src/object/flatten-object/flatten-object.test.ts` |

**Signature**

```ts
function flattenObject(object: object, separator = "."): Record<string, unknown>;
```

**Description** : aplatit un objet imbriqué en un objet à un seul niveau dont les clés sont des chemins. À utiliser pour transmettre un objet imbriqué à un format plat (export CSV, query string, champs de formulaire nommés `author.name`, comparaison clé par clé…). Les objets simples et les tableaux sont parcourus (index comme segments : `items.0.title`) ; les autres valeurs (dates, `Map`, instances de classe…) et les conteneurs vides sont gardés tels quels. Inverse : `unflattenObject`. L'objet ne doit pas contenir de référence circulaire. L'objet d'origine n'est pas modifié.

**Paramètres**

- `object` : objet (ou tableau) à aplatir.
- `separator` : séparateur des segments de chemin.

**Retour** : un nouvel objet à un seul niveau, `{ chemin: valeur }`.

**Erreurs** : aucune.

**Exemple**

```ts
import { flattenObject } from "@etiennea20/adr-misc";

flattenObject({ title: "Germinal", author: { name: "Zola" }, tags: ["roman"] });
// { title: "Germinal", "author.name": "Zola", "tags.0": "roman" }
```

### `getPath`

| Champ          | Valeur                                 |
| -------------- | -------------------------------------- |
| Catégorie      | `object`                               |
| Point d'entrée | `@etiennea20/adr-misc`                 |
| Statut         | stable                                 |
| Depuis         | 0.2.0                                  |
| Source         | `src/object/get-path/get-path.ts`      |
| Tests          | `src/object/get-path/get-path.test.ts` |

**Signature**

```ts
function getPath<T, P extends string>(object: T, path: P): PathValue<T, P>;
function getPath<T, P extends string, D>(
  object: T,
  path: P,
  defaultValue: D,
): Exclude<PathValue<T, P>, undefined> | D;
```

**Description** : lit une valeur imbriquée à partir d'un chemin pointé, sans erreur si un parent manque. À utiliser pour lire une propriété profonde dont le chemin est connu sous forme de chaîne (colonne d'un tableau générique, champ de formulaire, règle de tri configurable…). Les index de tableau s'écrivent comme des clés (`"items.0.title"`). Si un parent est `null`, `undefined` ou n'est pas un objet, ou si la valeur finale est `undefined`, la valeur par défaut est renvoyée. Le type de retour est déduit du chemin quand il est littéral. Une clé qui contient elle-même un point ne peut pas être atteinte.

**Paramètres**

- `object` : objet à parcourir.
- `path` : chemin pointé, par exemple `"author.address.city"`.
- `defaultValue` : valeur renvoyée si le chemin n'aboutit pas ou mène à `undefined`.

**Retour** : la valeur trouvée, ou `undefined`.

**Erreurs** : aucune.

**Exemple**

```ts
import { getPath } from "@etiennea20/adr-misc";

getPath(book, "author.address.city"); // "Paris" (type string | undefined si author est optionnel)
getPath(loan, "items.0.title"); // titre du premier livre de l'emprunt

getPath(book, "author.address.city", "Ville inconnue"); // string
```

### `invert`

| Champ          | Valeur                             |
| -------------- | ---------------------------------- |
| Catégorie      | `object`                           |
| Point d'entrée | `@etiennea20/adr-misc`             |
| Statut         | stable                             |
| Depuis         | 0.2.0                              |
| Source         | `src/object/invert/invert.ts`      |
| Tests          | `src/object/invert/invert.test.ts` |

**Signature**

```ts
function invert<T extends Record<keyof T, PropertyKey>>(
  object: T,
): {
  -readonly [K in keyof T as K extends symbol ? never : T[K]]: `${K & (string | number)}`;
};
```

**Description** : crée un nouvel objet dont les clés et les valeurs sont inversées. À utiliser pour retrouver une clé à partir de sa valeur (nom d'une énumération `as const` à partir de son code, libellé à partir d'un identifiant…). Avec un objet `as const`, le type du résultat est exact. Si plusieurs clés ont la même valeur, la dernière l'emporte. Les valeurs numériques deviennent des clés chaînes, et les clés numériques des valeurs chaînes. L'objet d'origine n'est pas modifié.

**Paramètres**

- `object` : objet à inverser.

**Retour** : un nouvel objet `{ [valeur]: clé }`.

**Erreurs** : aucune.

**Exemple**

```ts
import { invert } from "@etiennea20/adr-misc";

const ELoanStatus = { ONGOING: "ongoing", RETURNED: "returned" } as const;
invert(ELoanStatus); // { ongoing: "ONGOING", returned: "RETURNED" }
```

### `IRemoveUndefinedOptions`

| Champ          | Valeur                                                 |
| -------------- | ------------------------------------------------------ |
| Catégorie      | `object`                                               |
| Point d'entrée | `@etiennea20/adr-misc`                                 |
| Statut         | stable                                                 |
| Depuis         | 0.2.0                                                  |
| Source         | `src/object/remove-undefined/remove-undefined.ts`      |
| Tests          | `src/object/remove-undefined/remove-undefined.test.ts` |

**Signature**

```ts
interface IRemoveUndefinedOptions {
  /**
   * Nettoie aussi les objets simples imbriqués, y compris ceux contenus dans des tableaux.
   *
   * @defaultValue `false`
   */
  deep?: boolean;
}
```

**Description** : options de `removeUndefined`.

**Exemple**

```ts
import type { IRemoveUndefinedOptions } from "@etiennea20/adr-misc";

const options: IRemoveUndefinedOptions = { deep: true };
```

### `isEqual`

| Champ          | Valeur                                 |
| -------------- | -------------------------------------- |
| Catégorie      | `object`                               |
| Point d'entrée | `@etiennea20/adr-misc`                 |
| Statut         | stable                                 |
| Depuis         | 0.2.0                                  |
| Source         | `src/object/is-equal/is-equal.ts`      |
| Tests          | `src/object/is-equal/is-equal.test.ts` |

**Signature**

```ts
function isEqual(left: unknown, right: unknown): boolean;
```

**Description** : indique si deux valeurs sont égales en profondeur. À utiliser pour détecter une modification (formulaire modifié, état inchangé avant un appel réseau, comparaison de filtres…). Gère les primitives (`NaN` égal à `NaN`, `0` égal à `-0`), `Date` (même instant), `RegExp` (même motif et mêmes options), tableaux, objets simples (propriétés propres, énumérables et à clé chaîne, ordre indifférent), `Map` (clés comparées par identité) et `Set`, ainsi que les références circulaires. Deux objets de prototypes différents ne sont jamais égaux ; deux fonctions ne sont égales que si c'est la même.

**Paramètres**

- `left` : première valeur.
- `right` : seconde valeur.

**Retour** : `true` si les deux valeurs sont égales en profondeur.

**Erreurs** : aucune.

**Exemple**

```ts
import { isEqual } from "@etiennea20/adr-misc";

isEqual(
  { genres: ["roman"], since: new Date(2026, 0, 1) },
  { since: new Date(2026, 0, 1), genres: ["roman"] },
); // true
isEqual([1, 2], [2, 1]); // false
```

### `mapValues`

| Champ          | Valeur                                     |
| -------------- | ------------------------------------------ |
| Catégorie      | `object`                                   |
| Point d'entrée | `@etiennea20/adr-misc`                     |
| Statut         | stable                                     |
| Depuis         | 0.2.0                                      |
| Source         | `src/object/map-values/map-values.ts`      |
| Tests          | `src/object/map-values/map-values.test.ts` |

**Signature**

```ts
function mapValues<T extends object, R>(
  object: T,
  mapper: (value: T[keyof T & string], key: keyof T & string) => R,
): { [K in keyof T]: R };
```

**Description** : crée un nouvel objet avec les mêmes clés et des valeurs transformées. À utiliser pour convertir toutes les valeurs d'un objet (compteurs en pourcentages, dates en chaînes, libellés traduits…). Seules les propriétés propres, énumérables et à clé chaîne sont parcourues. L'objet d'origine n'est pas modifié.

**Paramètres**

- `object` : objet source.
- `mapper` : reçoit la valeur et la clé ; renvoie la nouvelle valeur.

**Retour** : un nouvel objet aux mêmes clés, dont chaque valeur est de type `R`.

**Erreurs** : aucune.

**Exemple**

```ts
import { mapValues } from "@etiennea20/adr-misc";

mapValues({ roman: 12, essai: 3 }, (count) => `${count} livre(s)`);
// { roman: "12 livre(s)", essai: "3 livre(s)" }
```

### `ObjectEntry`

| Champ          | Valeur                                           |
| -------------- | ------------------------------------------------ |
| Catégorie      | `object`                                         |
| Point d'entrée | `@etiennea20/adr-misc`                           |
| Statut         | stable                                           |
| Depuis         | 0.2.0                                            |
| Source         | `src/object/typed-entries/typed-entries.ts`      |
| Tests          | `src/object/typed-entries/typed-entries.test.ts` |

**Signature**

```ts
type ObjectEntry<T> = { [K in keyof T & string]-?: [K, T[K]] }[keyof T & string];
```

**Description** : paire `[clé, valeur]` d'un objet, typée précisément : chaque clé (chaîne) est associée au type de sa propre valeur.

**Exemple**

```ts
import type { ObjectEntry } from "@etiennea20/adr-misc";

type BookEntry = ObjectEntry<{ title: string; year: number }>;
// ["title", string] | ["year", number]
```

### `omit`

| Champ          | Valeur                         |
| -------------- | ------------------------------ |
| Catégorie      | `object`                       |
| Point d'entrée | `@etiennea20/adr-misc`         |
| Statut         | stable                         |
| Depuis         | 0.2.0                          |
| Source         | `src/object/omit/omit.ts`      |
| Tests          | `src/object/omit/omit.test.ts` |

**Signature**

```ts
function omit<T extends object, K extends keyof T>(object: T, keys: readonly K[]): Omit<T, K>;
```

**Description** : crée un nouvel objet sans les clés indiquées. À utiliser pour retirer des champs avant un envoi ou un affichage (mot de passe, champs techniques…). Seules les propriétés propres, énumérables et à clé chaîne sont copiées (comme `Object.entries`), par référence (copie superficielle). L'objet d'origine n'est pas modifié.

**Paramètres**

- `object` : objet source.
- `keys` : clés à retirer.

**Retour** : un nouvel objet de type `Omit<T, K>`.

**Erreurs** : aucune.

**Exemple**

```ts
import { omit } from "@etiennea20/adr-misc";

omit({ id: 1, email: "a@b.fr", password: "secret" }, ["password"]); // { id: 1, email: "a@b.fr" }
```

### `omitBy`

| Champ          | Valeur                               |
| -------------- | ------------------------------------ |
| Catégorie      | `object`                             |
| Point d'entrée | `@etiennea20/adr-misc`               |
| Statut         | stable                               |
| Depuis         | 0.2.0                                |
| Source         | `src/object/omit-by/omit-by.ts`      |
| Tests          | `src/object/omit-by/omit-by.test.ts` |

**Signature**

```ts
function omitBy<T extends object>(
  object: T,
  predicate: (value: T[keyof T & string], key: keyof T & string) => boolean,
): Partial<T>;
```

**Description** : crée un nouvel objet sans les propriétés qui vérifient un prédicat (inverse de `pickBy`). À utiliser pour retirer des propriétés selon leur valeur (valeurs vides, `null`, compteurs à zéro…). Seules les propriétés propres, énumérables et à clé chaîne sont parcourues. Les valeurs sont copiées par référence et l'objet d'origine n'est pas modifié.

**Paramètres**

- `object` : objet source.
- `predicate` : reçoit la valeur et la clé ; renvoie `true` pour retirer la propriété.

**Retour** : un nouvel objet partiel sans les propriétés retirées.

**Erreurs** : aucune.

**Exemple**

```ts
import { omitBy } from "@etiennea20/adr-misc";

omitBy({ title: "Germinal", author: null, year: 1885 }, (value) => value === null);
// { title: "Germinal", year: 1885 }
```

### `PathValue`

| Champ          | Valeur                                 |
| -------------- | -------------------------------------- |
| Catégorie      | `object`                               |
| Point d'entrée | `@etiennea20/adr-misc`                 |
| Statut         | stable                                 |
| Depuis         | 0.2.0                                  |
| Source         | `src/object/get-path/get-path.ts`      |
| Tests          | `src/object/get-path/get-path.test.ts` |

**Signature**

```ts
type PathValue<T, P extends string> = unknown extends T
  ? unknown
  : string extends P
    ? unknown
    : P extends `${infer Head}.${infer Rest}`
      ? PathValue<PathSegmentValue<T, Head>, Rest>
      : PathSegmentValue<T, P>;
```

**Description** : type de la valeur atteinte par un chemin pointé (`"author.address.city"`, `"items.0.title"`) dans un type `T`, utilisé par `getPath` et `setPath`. Un segment manquant ou un parent optionnel ajoute `undefined`. Si le chemin n'est pas une chaîne littérale, ou si `T` est `unknown`, le type vaut `unknown`.

**Exemple**

```ts
import type { PathValue } from "@etiennea20/adr-misc";

type City = PathValue<{ author?: { city: string } }, "author.city">; // string | undefined
```

### `pick`

| Champ          | Valeur                         |
| -------------- | ------------------------------ |
| Catégorie      | `object`                       |
| Point d'entrée | `@etiennea20/adr-misc`         |
| Statut         | stable                         |
| Depuis         | 0.2.0                          |
| Source         | `src/object/pick/pick.ts`      |
| Tests          | `src/object/pick/pick.test.ts` |

**Signature**

```ts
function pick<T extends object, K extends keyof T>(object: T, keys: readonly K[]): Pick<T, K>;
```

**Description** : crée un nouvel objet avec seulement les clés demandées. À utiliser pour extraire d'un objet les champs utiles (charge utile d'une requête, colonnes affichées…). Une clé absente de l'objet est absente du résultat (pas de `undefined` ajouté). Les valeurs sont copiées par référence (copie superficielle) et l'objet d'origine n'est pas modifié.

**Paramètres**

- `object` : objet source.
- `keys` : clés à conserver.

**Retour** : un nouvel objet de type `Pick<T, K>`.

**Erreurs** : aucune.

**Exemple**

```ts
import { pick } from "@etiennea20/adr-misc";

pick({ id: 1, title: "Germinal", stock: 3 }, ["id", "title"]); // { id: 1, title: "Germinal" }
```

### `pickBy`

| Champ          | Valeur                               |
| -------------- | ------------------------------------ |
| Catégorie      | `object`                             |
| Point d'entrée | `@etiennea20/adr-misc`               |
| Statut         | stable                               |
| Depuis         | 0.2.0                                |
| Source         | `src/object/pick-by/pick-by.ts`      |
| Tests          | `src/object/pick-by/pick-by.test.ts` |

**Signature**

```ts
function pickBy<T extends object>(
  object: T,
  predicate: (value: T[keyof T & string], key: keyof T & string) => boolean,
): Partial<T>;
```

**Description** : crée un nouvel objet avec seulement les propriétés qui vérifient un prédicat. À utiliser quand les clés à garder dépendent des valeurs (filtres renseignés, compteurs non nuls…). Seules les propriétés propres, énumérables et à clé chaîne sont parcourues. Les valeurs sont copiées par référence et l'objet d'origine n'est pas modifié.

**Paramètres**

- `object` : objet source.
- `predicate` : reçoit la valeur et la clé ; renvoie `true` pour conserver la propriété.

**Retour** : un nouvel objet partiel avec les propriétés retenues.

**Erreurs** : aucune.

**Exemple**

```ts
import { pickBy } from "@etiennea20/adr-misc";

pickBy({ title: "Germinal", author: "", year: 1885 }, (value) => value !== "");
// { title: "Germinal", year: 1885 }
```

### `removeUndefined`

| Champ          | Valeur                                                 |
| -------------- | ------------------------------------------------------ |
| Catégorie      | `object`                                               |
| Point d'entrée | `@etiennea20/adr-misc`                                 |
| Statut         | stable                                                 |
| Depuis         | 0.2.0                                                  |
| Source         | `src/object/remove-undefined/remove-undefined.ts`      |
| Tests          | `src/object/remove-undefined/remove-undefined.test.ts` |

**Signature**

```ts
function removeUndefined<T extends object>(object: T, options: IRemoveUndefinedOptions = {}): T;
```

**Description** : crée une copie d'un objet sans ses propriétés de valeur `undefined`. À utiliser avant d'envoyer un objet à une API ou de le sérialiser quand une clé présente avec `undefined` n'a pas le même sens qu'une clé absente (filtres optionnels, `PATCH` partiel, comparaison avec `isEqual`…). Les valeurs `null` sont conservées. Avec `deep: true`, les objets simples imbriqués (y compris dans des tableaux) sont aussi nettoyés ; les éléments `undefined` des tableaux sont conservés. Les objets non simples (dates, instances de classe…) sont repris tels quels. L'objet d'origine n'est pas modifié.

**Paramètres**

- `object` : objet (ou tableau) à nettoyer.
- `options` : options du nettoyage.

**Retour** : une copie de l'objet sans les clés `undefined`, du même type.

**Erreurs** : aucune.

**Exemple**

```ts
import { removeUndefined } from "@etiennea20/adr-misc";

removeUndefined({ title: "Germinal", author: undefined, year: null }); // { title: "Germinal", year: null }
removeUndefined({ filters: { genre: undefined, available: true } }, { deep: true });
// { filters: { available: true } }
```

### `setPath`

| Champ          | Valeur                                 |
| -------------- | -------------------------------------- |
| Catégorie      | `object`                               |
| Point d'entrée | `@etiennea20/adr-misc`                 |
| Statut         | stable                                 |
| Depuis         | 0.2.0                                  |
| Source         | `src/object/set-path/set-path.ts`      |
| Tests          | `src/object/set-path/set-path.test.ts` |

**Signature**

```ts
function setPath<T extends object, P extends string>(object: T, path: P, value: PathValue<T, P>): T;
```

**Description** : renvoie une copie d'un objet avec une valeur écrite à un chemin pointé, sans modifier l'original. À utiliser pour mettre à jour une propriété profonde de façon immuable (état React, reducer, formulaire imbriqué…). Seuls les objets et tableaux situés sur le chemin sont recopiés ; le reste est partagé avec l'original. Les conteneurs manquants (ou non objets) sont créés : un tableau si le segment suivant est un index (`"items.0.title"`), un objet sinon. Les objets recopiés perdent leur prototype (copie par décomposition `{ ...objet }`) : réserver cette fonction aux objets simples et tableaux. La valeur doit avoir le type attendu au bout du chemin quand celui-ci est littéral.

**Paramètres**

- `object` : objet d'origine (non modifié).
- `path` : chemin pointé, par exemple `"author.address.city"`.
- `value` : valeur à écrire.

**Retour** : une nouvelle version de l'objet avec la valeur écrite.

**Erreurs** : `Error` si un segment du chemin vaut `__proto__`, `constructor` ou `prototype` (protection contre la pollution de prototype).

**Exemple**

```ts
import { setPath } from "@etiennea20/adr-misc";

const updated = setPath(member, "address.city", "Lyon");
updated.address.city; // "Lyon"
member.address.city; // inchangé
setPath({}, "loans.0.bookId", "b-42"); // { loans: [{ bookId: "b-42" }] }
```

### `typedEntries`

| Champ          | Valeur                                           |
| -------------- | ------------------------------------------------ |
| Catégorie      | `object`                                         |
| Point d'entrée | `@etiennea20/adr-misc`                           |
| Statut         | stable                                           |
| Depuis         | 0.2.0                                            |
| Source         | `src/object/typed-entries/typed-entries.ts`      |
| Tests          | `src/object/typed-entries/typed-entries.test.ts` |

**Signature**

```ts
function typedEntries<T extends object>(object: T): ObjectEntry<T>[];
```

**Description** : renvoie les paires `[clé, valeur]` propres et énumérables d'un objet, typées précisément. À utiliser à la place d'`Object.entries`, qui type les clés en `string` et les valeurs en `any` : ici, chaque clé est un littéral de `keyof T` associé au type de sa valeur. Attention : TypeScript ne garantit pas qu'un objet n'a pas d'autres propriétés que celles de son type ; réserver cette fonction aux objets dont on maîtrise la forme. Les clés symboles sont ignorées.

**Paramètres**

- `object` : objet à parcourir.

**Retour** : un nouveau tableau de paires `[clé, valeur]`.

**Erreurs** : aucune.

**Exemple**

```ts
import { typedEntries } from "@etiennea20/adr-misc";

for (const [key, value] of typedEntries({ title: "Germinal", year: 1885 })) {
  // key : "title" | "year"
}
```

### `unflattenObject`

| Champ          | Valeur                                                 |
| -------------- | ------------------------------------------------------ |
| Catégorie      | `object`                                               |
| Point d'entrée | `@etiennea20/adr-misc`                                 |
| Statut         | stable                                                 |
| Depuis         | 0.2.0                                                  |
| Source         | `src/object/unflatten-object/unflatten-object.ts`      |
| Tests          | `src/object/unflatten-object/unflatten-object.test.ts` |

**Signature**

```ts
function unflattenObject(
  flat: Readonly<Record<string, unknown>>,
  separator = ".",
): Record<string, unknown>;
```

**Description** : reconstruit un objet imbriqué à partir d'un objet à un seul niveau dont les clés sont des chemins (inverse de `flattenObject`). À utiliser pour relire un format plat (champs de formulaire nommés `author.name`, colonnes CSV, query string…). Un segment numérique crée un tableau (`items.0.title`), les autres un objet ; la racine est toujours un objet. Les entrées sont appliquées dans l'ordre : une valeur simple écrite à un chemin parent est remplacée par un conteneur si un chemin plus long suit. Les entrées dont un segment vaut `__proto__`, `constructor` ou `prototype` sont ignorées (protection contre la pollution de prototype). L'objet d'origine n'est pas modifié.

**Paramètres**

- `flat` : objet plat `{ chemin: valeur }`.
- `separator` : séparateur des segments de chemin.

**Retour** : un nouvel objet imbriqué.

**Erreurs** : aucune.

**Exemple**

```ts
import { unflattenObject } from "@etiennea20/adr-misc";

unflattenObject({
  title: "Germinal",
  "author.name": "Zola",
  "tags.0": "roman",
});
// { title: "Germinal", author: { name: "Zola" }, tags: ["roman"] }
```

## string

### `IGetInitialsOptions`

| Champ          | Valeur                                         |
| -------------- | ---------------------------------------------- |
| Catégorie      | `string`                                       |
| Point d'entrée | `@etiennea20/adr-misc`                         |
| Statut         | stable                                         |
| Depuis         | 0.2.0                                          |
| Source         | `src/string/get-initials/get-initials.ts`      |
| Tests          | `src/string/get-initials/get-initials.test.ts` |

**Signature**

```ts
interface IGetInitialsOptions {
  maxLetters?: number;
  splitHyphens?: boolean;
}
```

**Description** : options de `getInitials`. `maxLetters` (défaut : aucune limite, entier ≥ 1) limite le nombre d'initiales en gardant les premières et la dernière (initiale du nom de famille) ; avec 1, seule la première est gardée. `splitHyphens` (défaut `true`) compte chaque partie d'un nom composé (« Jean-Pierre » → « JP ») ; à `false`, un nom composé ne donne qu'une initiale.

**Exemple**

```ts
import { getInitials, type IGetInitialsOptions } from "@etiennea20/adr-misc";

const options: IGetInitialsOptions = { maxLetters: 2 };
getInitials("Jean-Pierre Dupont", options); // "JD"
```

### `IHighlightSegment`

| Champ          | Valeur                                                   |
| -------------- | -------------------------------------------------------- |
| Catégorie      | `string`                                                 |
| Point d'entrée | `@etiennea20/adr-misc`                                   |
| Statut         | stable                                                   |
| Depuis         | 0.2.0                                                    |
| Source         | `src/string/highlight-matches/highlight-matches.ts`      |
| Tests          | `src/string/highlight-matches/highlight-matches.test.ts` |

**Signature**

```ts
interface IHighlightSegment {
  text: string;
  match: boolean;
}
```

**Description** : segment de texte renvoyé par `highlightMatches`. `text` est un morceau du texte d'origine, tel quel (casse et accents conservés) ; `match` vaut `true` si le morceau correspond à un mot de la recherche et doit être surligné.

**Exemple**

```ts
import type { IHighlightSegment } from "@etiennea20/adr-misc";

const segment: IHighlightSegment = { text: "Hugo", match: true };
```

### `IInterpolateOptions`

| Champ          | Valeur                                       |
| -------------- | -------------------------------------------- |
| Catégorie      | `string`                                     |
| Point d'entrée | `@etiennea20/adr-misc`                       |
| Statut         | stable                                       |
| Depuis         | 0.2.0                                        |
| Source         | `src/string/interpolate/interpolate.ts`      |
| Tests          | `src/string/interpolate/interpolate.test.ts` |

**Signature**

```ts
interface IInterpolateOptions {
  missing?: "keep" | "empty" | "throw";
}
```

**Description** : options de `interpolate`. `missing` (défaut `"keep"`) règle le traitement d'une clé absente de `values` (ou valant `null` ou `undefined`) : `"keep"` laisse le marqueur `{cle}` tel quel, `"empty"` le remplace par une chaîne vide, `"throw"` lève une erreur.

**Exemple**

```ts
import { interpolate, type IInterpolateOptions } from "@etiennea20/adr-misc";

const options: IInterpolateOptions = { missing: "empty" };
interpolate("Bonjour {prenom} {nom}", { nom: "Dupont" }, options); // "Bonjour  Dupont"
```

### `IMaskStringOptions`

| Champ          | Valeur                                       |
| -------------- | -------------------------------------------- |
| Catégorie      | `string`                                     |
| Point d'entrée | `@etiennea20/adr-misc`                       |
| Statut         | stable                                       |
| Depuis         | 0.2.0                                        |
| Source         | `src/string/mask-string/mask-string.ts`      |
| Tests          | `src/string/mask-string/mask-string.test.ts` |

**Signature**

```ts
interface IMaskStringOptions {
  visibleStart?: number;
  visibleEnd?: number;
  maskChar?: string;
  preserve?: string;
}
```

**Description** : options de `maskString`. `visibleStart` (défaut `0`) et `visibleEnd` (défaut `4`) : nombre de caractères laissés visibles au début et à la fin (entiers positifs ou nuls) ; `maskChar` (défaut `"*"`) : caractère qui remplace chaque caractère masqué ; `preserve` (défaut `""`) : caractères jamais masqués pour garder la forme de la valeur (espaces d'un IBAN, `@` et `.` d'un e-mail), qui comptent tout de même dans `visibleStart` et `visibleEnd`.

**Exemple**

```ts
import { maskString, type IMaskStringOptions } from "@etiennea20/adr-misc";

const options: IMaskStringOptions = {
  visibleStart: 4,
  visibleEnd: 3,
  preserve: " ",
};
maskString("FR76 3000 6000 0112 3456 7890 189", options);
// "FR76 **** **** **** **** **** 189"
```

### `IPluralizeOptions`

| Champ          | Valeur                                   |
| -------------- | ---------------------------------------- |
| Catégorie      | `string`                                 |
| Point d'entrée | `@etiennea20/adr-misc`                   |
| Statut         | stable                                   |
| Depuis         | 0.2.0                                    |
| Source         | `src/string/pluralize/pluralize.ts`      |
| Tests          | `src/string/pluralize/pluralize.test.ts` |

**Signature**

```ts
interface IPluralizeOptions {
  plural?: string;
  includeCount?: boolean;
  locale?: string;
}
```

**Description** : options de `pluralize`. `plural` : forme plurielle, pour les pluriels irréguliers et les expressions (défaut : pluriel régulier déduit du singulier) ; `includeCount` (défaut `false`) : fait précéder le mot du nombre formaté, suivi d'une espace insécable (U+00A0) ; `locale` (défaut `"fr-FR"`) : locale de `Intl.NumberFormat` pour ce nombre.

**Exemple**

```ts
import { pluralize, type IPluralizeOptions } from "@etiennea20/adr-misc";

const options: IPluralizeOptions = { plural: "chevaux", includeCount: true };
pluralize(3, "cheval", options); // "3 chevaux" (espace insécable)
```

### `ISlugifyOptions`

| Champ          | Valeur                               |
| -------------- | ------------------------------------ |
| Catégorie      | `string`                             |
| Point d'entrée | `@etiennea20/adr-misc`               |
| Statut         | stable                               |
| Depuis         | 0.2.0                                |
| Source         | `src/string/slugify/slugify.ts`      |
| Tests          | `src/string/slugify/slugify.test.ts` |

**Signature**

```ts
interface ISlugifyOptions {
  separator?: string;
  lowercase?: boolean;
}
```

**Description** : options de `slugify`. `separator` (défaut `"-"`) : séparateur placé entre les mots ; `lowercase` (défaut `true`) : met le résultat en minuscules.

**Exemple**

```ts
import { slugify, type ISlugifyOptions } from "@etiennea20/adr-misc";

const options: ISlugifyOptions = { separator: "_" };
slugify("Le Petit Prince", options); // "le_petit_prince"
```

### `ITruncateOptions`

| Champ          | Valeur                                 |
| -------------- | -------------------------------------- |
| Catégorie      | `string`                               |
| Point d'entrée | `@etiennea20/adr-misc`                 |
| Statut         | stable                                 |
| Depuis         | 0.2.0                                  |
| Source         | `src/string/truncate/truncate.ts`      |
| Tests          | `src/string/truncate/truncate.test.ts` |

**Signature**

```ts
interface ITruncateOptions {
  suffix?: string;
  wordBoundary?: boolean;
}
```

**Description** : options de `truncate`. `suffix` (défaut `"…"`, un seul caractère) : texte ajouté à la fin d'un texte tronqué, compté dans `maxLength` ; `wordBoundary` (défaut `false`) : coupe à la fin du dernier mot complet plutôt qu'au milieu d'un mot (sauf si le premier mot dépasse à lui seul la longueur disponible).

**Exemple**

```ts
import { truncate, type ITruncateOptions } from "@etiennea20/adr-misc";

const options: ITruncateOptions = { wordBoundary: true, suffix: " [...]" };
truncate("Vingt mille lieues sous les mers", 20, options); // "Vingt mille [...]"
```

### `InterpolateValues`

| Champ          | Valeur                                       |
| -------------- | -------------------------------------------- |
| Catégorie      | `string`                                     |
| Point d'entrée | `@etiennea20/adr-misc`                       |
| Statut         | stable                                       |
| Depuis         | 0.2.0                                        |
| Source         | `src/string/interpolate/interpolate.ts`      |
| Tests          | `src/string/interpolate/interpolate.test.ts` |

**Signature**

```ts
type InterpolateValues = Readonly<
  Record<string, string | number | bigint | boolean | null | undefined>
>;
```

**Description** : valeurs acceptées par `interpolate`, indexées par clé et converties avec `String()`. `null` et `undefined` sont traités comme des clés absentes (option `missing`).

**Exemple**

```ts
import type { InterpolateValues } from "@etiennea20/adr-misc";

const values: InterpolateValues = {
  titre: "Le Horla",
  exemplaires: 3,
  disponible: true,
};
```

### `compareStrings`

| Champ          | Valeur                                               |
| -------------- | ---------------------------------------------------- |
| Catégorie      | `string`                                             |
| Point d'entrée | `@etiennea20/adr-misc`                               |
| Statut         | stable                                               |
| Depuis         | 0.2.0                                                |
| Source         | `src/string/compare-strings/compare-strings.ts`      |
| Tests          | `src/string/compare-strings/compare-strings.test.ts` |

**Signature**

```ts
function compareStrings(a: string, b: string, locale?: string): number;
```

**Description** : compare deux textes dans l'ordre alphabétique français, sans tenir compte de la casse ni des accents, avec un ordre naturel des nombres (`Intl.Collator`, `sensitivity: "base"`, `numeric: true`). À utiliser comme fonction de comparaison de `sort` / `toSorted` pour trier des titres, des noms ou des libellés comme un humain l'attend : « école » est rangé avec « Ecole », avant « Étude » ; « Tome 2 » vient avant « Tome 10 ». Deux textes qui ne diffèrent que par la casse ou les accents sont égaux : le tri, stable, conserve leur ordre d'origine.

**Paramètres**

- `a` : premier texte.
- `b` : second texte.
- `locale` : locale de l'ordre alphabétique, code BCP 47 (défaut `"fr-FR"`).

**Retour** : un nombre négatif si `a` vient avant `b`, positif s'il vient après, `0` s'ils sont équivalents.

**Erreurs** : `RangeError` (levée par `Intl.Collator`) si `locale` n'est pas un code de locale valide.

**Exemple**

```ts
import { compareStrings } from "@etiennea20/adr-misc";

["Tome 10", "tome 2", "Étude", "école"].sort(compareStrings);
// ["école", "Étude", "tome 2", "Tome 10"]
compareStrings("Élève", "eleve"); // 0
```

### `countWords`

| Champ          | Valeur                                       |
| -------------- | -------------------------------------------- |
| Catégorie      | `string`                                     |
| Point d'entrée | `@etiennea20/adr-misc`                       |
| Statut         | stable                                       |
| Depuis         | 0.2.0                                        |
| Source         | `src/string/count-words/count-words.ts`      |
| Tests          | `src/string/count-words/count-words.test.ts` |

**Signature**

```ts
function countWords(text: string): number;
```

**Description** : compte les mots d'un texte. À utiliser pour afficher la longueur d'un résumé ou d'un commentaire, ou pour limiter une saisie en nombre de mots. Un mot est une suite de caractères sans espace contenant au moins une lettre ou un chiffre : la ponctuation isolée (« — », « : ») n'est pas comptée, un mot composé ou élidé (« Jean-Pierre », « l’école ») compte pour un. Toutes les espaces séparent les mots, insécables comprises.

**Paramètres**

- `text` : texte à analyser.

**Retour** : le nombre de mots (`0` pour un texte vide ou blanc).

**Erreurs** : aucune.

**Exemple**

```ts
import { countWords } from "@etiennea20/adr-misc";

countWords("Le Petit Prince"); // 3
countWords("« Bonjour », dit-il — l’air las."); // 4
```

### `escapeHtml`

| Champ          | Valeur                                       |
| -------------- | -------------------------------------------- |
| Catégorie      | `string`                                     |
| Point d'entrée | `@etiennea20/adr-misc`                       |
| Statut         | stable                                       |
| Depuis         | 0.2.0                                        |
| Source         | `src/string/escape-html/escape-html.ts`      |
| Tests          | `src/string/escape-html/escape-html.test.ts` |

**Signature**

```ts
function escapeHtml(value: string): string;
```

**Description** : échappe les caractères spéciaux HTML (`&`, `<`, `>`, `"`, `'`) d'un texte. À utiliser avant d'insérer un texte non maîtrisé (saisie utilisateur, donnée d'API) dans du HTML construit à la main : gabarit d'e-mail, export HTML, `innerHTML`. Prévient l'injection de code (XSS) dans le contenu d'un élément et dans un attribut entre guillemets. Inutile avec React (le JSX échappe déjà le texte) ; ne suffit pas pour une URL (`href`) ni pour du code JavaScript ou CSS.

**Paramètres**

- `value` : texte à échapper.

**Retour** : le texte avec les caractères spéciaux remplacés par des entités HTML (`&amp;`, `&lt;`, `&gt;`, `&quot;`, `&#39;`).

**Erreurs** : aucune.

**Exemple**

```ts
import { escapeHtml } from "@etiennea20/adr-misc";

escapeHtml(`<script>alert("pirate")</script>`);
// "&lt;script&gt;alert(&quot;pirate&quot;)&lt;/script&gt;"
escapeHtml("Tom & Jerry"); // "Tom &amp; Jerry"
```

### `escapeRegExp`

| Champ          | Valeur                                             |
| -------------- | -------------------------------------------------- |
| Catégorie      | `string`                                           |
| Point d'entrée | `@etiennea20/adr-misc`                             |
| Statut         | stable                                             |
| Depuis         | 0.2.0                                              |
| Source         | `src/string/escape-reg-exp/escape-reg-exp.ts`      |
| Tests          | `src/string/escape-reg-exp/escape-reg-exp.test.ts` |

**Signature**

```ts
function escapeRegExp(value: string): string;
```

**Description** : échappe les caractères spéciaux des expressions régulières (`. * + ? ^ $ { } ( ) | [ ] \`). À utiliser avant d'insérer un texte non maîtrisé (saisie de recherche, nom de fichier) dans une `RegExp` construite dynamiquement : le texte est recherché littéralement et ne peut pas provoquer d'erreur de syntaxe. Valide avec ou sans l'option `u` ; les tirets ne sont pas échappés, donc ne pas insérer le résultat dans une classe de caractères (`[...]`).

**Paramètres**

- `value` : texte à échapper.

**Retour** : le texte avec chaque caractère spécial précédé d'une barre oblique inverse.

**Erreurs** : aucune.

**Exemple**

```ts
import { escapeRegExp } from "@etiennea20/adr-misc";

const pattern = new RegExp(escapeRegExp("Tome 2 (poche)"), "i");
pattern.test("tome 2 (poche)"); // true
escapeRegExp("1+1=2?"); // "1\\+1=2\\?"
```

### `getInitials`

| Champ          | Valeur                                         |
| -------------- | ---------------------------------------------- |
| Catégorie      | `string`                                       |
| Point d'entrée | `@etiennea20/adr-misc`                         |
| Statut         | stable                                         |
| Depuis         | 0.2.0                                          |
| Source         | `src/string/get-initials/get-initials.ts`      |
| Tests          | `src/string/get-initials/get-initials.test.ts` |

**Signature**

```ts
function getInitials(fullName: string, options?: IGetInitialsOptions): string;
```

**Description** : calcule les initiales d'un nom de personne, en majuscules. À utiliser pour un avatar sans photo, une signature courte ou une colonne étroite. Chaque mot donne sa première lettre (accents conservés : « Émile Zola » → « ÉZ ») ; les parties d'un nom composé comptent chacune (option `splitHyphens`), les particules (« de », « du », « van »…) et les élisions (« d’Ormesson ») sont ignorées.

**Paramètres**

- `fullName` : nom complet (prénom(s) puis nom).
- `options` : `maxLetters` et `splitHyphens` (voir `IGetInitialsOptions`).

**Retour** : les initiales en majuscules, ou une chaîne vide si le nom ne contient aucune lettre.

**Erreurs** : `RangeError` si `maxLetters` n'est pas un entier supérieur ou égal à 1.

**Exemple**

```ts
import { getInitials } from "@etiennea20/adr-misc";

getInitials("Jean-Pierre Dupont"); // "JPD"
getInitials("Jean-Pierre Dupont", { maxLetters: 2 }); // "JD"
getInitials("Jean-Pierre Dupont", { splitHyphens: false }); // "JD"
getInitials("Charles de Gaulle"); // "CG"
```

### `highlightMatches`

| Champ          | Valeur                                                   |
| -------------- | -------------------------------------------------------- |
| Catégorie      | `string`                                                 |
| Point d'entrée | `@etiennea20/adr-misc`                                   |
| Statut         | stable                                                   |
| Depuis         | 0.2.0                                                    |
| Source         | `src/string/highlight-matches/highlight-matches.ts`      |
| Tests          | `src/string/highlight-matches/highlight-matches.test.ts` |

**Signature**

```ts
function highlightMatches(text: string, query: string): IHighlightSegment[];
```

**Description** : découpe un texte en segments à surligner ou non selon une recherche, pour afficher un résultat de recherche. À utiliser avec `matchesSearch` : filtrer la liste, puis surligner dans chaque résultat les passages trouvés (`<mark>` en React). Chaque mot de la requête est cherché comme dans `matchesSearch` (insensible à la casse, aux accents, aux ligatures, aux types d'espaces et d'apostrophes) ; toutes ses occurrences sont marquées, et les passages qui se chevauchent ou se touchent sont fusionnés. La concaténation des segments redonne exactement `text`.

**Paramètres**

- `text` : texte à découper (titre, nom…).
- `query` : recherche saisie par l'utilisateur.

**Retour** : les segments dans l'ordre du texte, sans segment vide : un seul segment non marqué si rien ne correspond, un tableau vide si `text` est vide.

**Erreurs** : aucune.

**Exemple**

```ts
import { highlightMatches } from "@etiennea20/adr-misc";

highlightMatches("Les Misérables", "mise");
// [{ text: "Les ", match: false }, { text: "Misé", match: true }, { text: "rables", match: false }]
```

### `interpolate`

| Champ          | Valeur                                       |
| -------------- | -------------------------------------------- |
| Catégorie      | `string`                                     |
| Point d'entrée | `@etiennea20/adr-misc`                       |
| Statut         | stable                                       |
| Depuis         | 0.2.0                                        |
| Source         | `src/string/interpolate/interpolate.ts`      |
| Tests          | `src/string/interpolate/interpolate.test.ts` |

**Signature**

```ts
function interpolate(
  template: string,
  values: InterpolateValues,
  options?: IInterpolateOptions,
): string;
```

**Description** : remplace les marqueurs `{cle}` d'un modèle de texte par les valeurs correspondantes. À utiliser pour des messages paramétrés simples (notifications, libellés traduits, gabarits d'e-mail). Les clés acceptent lettres (accents compris), chiffres et underscores, avec des espaces facultatifs autour (`{ prenom }`) ; tout autre contenu entre accolades est laissé intact. Les valeurs sont converties avec `String()` (formater dates et nombres avant) et ne sont pas échappées (appliquer `escapeHtml` sur les valeurs avant d'insérer le résultat dans du HTML).

**Paramètres**

- `template` : modèle contenant des marqueurs `{cle}`.
- `values` : valeurs à insérer, indexées par clé.
- `options` : `missing` (traitement des clés absentes, défaut `"keep"`).

**Retour** : le texte avec les marqueurs remplacés.

**Erreurs** : `Error` si une clé est absente et que `missing` vaut `"throw"`.

**Exemple**

```ts
import { interpolate } from "@etiennea20/adr-misc";

interpolate("Bonjour {prenom}, {nombre} livre(s) en retard.", {
  prenom: "Inès",
  nombre: 2,
});
// "Bonjour Inès, 2 livre(s) en retard."
interpolate("Bonjour {prenom}", {}); // "Bonjour {prenom}"
interpolate("Bonjour {prenom}", {}, { missing: "empty" }); // "Bonjour "
```

### `maskString`

| Champ          | Valeur                                       |
| -------------- | -------------------------------------------- |
| Catégorie      | `string`                                     |
| Point d'entrée | `@etiennea20/adr-misc`                       |
| Statut         | stable                                       |
| Depuis         | 0.2.0                                        |
| Source         | `src/string/mask-string/mask-string.ts`      |
| Tests          | `src/string/mask-string/mask-string.test.ts` |

**Signature**

```ts
function maskString(value: string, options?: IMaskStringOptions): string;
```

**Description** : masque une valeur sensible en ne laissant visibles que quelques caractères au début et à la fin. À utiliser pour afficher une donnée confidentielle de façon reconnaissable sans la révéler : IBAN, numéro de carte, NIR, téléphone, e-mail. Par défaut, seuls les 4 derniers caractères restent visibles. Les caractères sont comptés par point de code (un emoji compte pour un). Si `visibleStart + visibleEnd` couvre toute la valeur, elle est renvoyée en clair. Masquer à l'affichage ne protège pas la donnée : masquer côté serveur si le client ne doit pas la connaître.

**Paramètres**

- `value` : valeur à masquer.
- `options` : `visibleStart`, `visibleEnd`, `maskChar` et `preserve` (voir `IMaskStringOptions`).

**Retour** : la valeur masquée.

**Erreurs** : `RangeError` si `visibleStart` ou `visibleEnd` n'est pas un entier positif ou nul.

**Exemple**

```ts
import { maskString } from "@etiennea20/adr-misc";

maskString("4970101234567890"); // "************7890"
maskString("jean.dupont@exemple.fr", {
  visibleStart: 2,
  visibleEnd: 11,
  preserve: "@.",
});
// "je**.******@exemple.fr"
maskString("0612345678", { visibleStart: 2, visibleEnd: 2, maskChar: "•" }); // "06••••••78"
```

### `matchesSearch`

| Champ          | Valeur                                             |
| -------------- | -------------------------------------------------- |
| Catégorie      | `string`                                           |
| Point d'entrée | `@etiennea20/adr-misc`                             |
| Statut         | stable                                             |
| Depuis         | 0.2.0                                              |
| Source         | `src/string/matches-search/matches-search.ts`      |
| Tests          | `src/string/matches-search/matches-search.test.ts` |

**Signature**

```ts
function matchesSearch(text: string, query: string): boolean;
```

**Description** : indique si un texte correspond à une recherche, sans tenir compte de la casse ni des accents. À utiliser pour filtrer une liste côté client à partir d'un champ de recherche (livres, adhérents, options d'une liste déroulante). La requête est découpée en mots : **tous** les mots doivent apparaître dans le texte, dans n'importe quel ordre, éventuellement au milieu d'un mot (« hug vic » trouve « Victor Hugo »). La comparaison ignore la casse, les accents, les ligatures (« oeuvre » trouve « Œuvre »), les types d'espaces et d'apostrophes (« l'ile » trouve « L’Île »). Une requête vide ou blanche correspond à tout.

**Paramètres**

- `text` : texte dans lequel chercher. Pour chercher dans plusieurs champs, les concaténer avec une espace.
- `query` : recherche saisie par l'utilisateur.

**Retour** : `true` si chaque mot de la requête apparaît dans le texte.

**Erreurs** : aucune.

**Exemple**

```ts
import { matchesSearch } from "@etiennea20/adr-misc";

matchesSearch("Les Misérables, Victor Hugo", "hugo miserables"); // true
matchesSearch("L’Œuvre au noir", "oeuvre"); // true
matchesSearch("Le Petit Prince", "petit roi"); // false
```

### `normalizeWhitespace`

| Champ          | Valeur                                                         |
| -------------- | -------------------------------------------------------------- |
| Catégorie      | `string`                                                       |
| Point d'entrée | `@etiennea20/adr-misc`                                         |
| Statut         | stable                                                         |
| Depuis         | 0.2.0                                                          |
| Source         | `src/string/normalize-whitespace/normalize-whitespace.ts`      |
| Tests          | `src/string/normalize-whitespace/normalize-whitespace.test.ts` |

**Signature**

```ts
function normalizeWhitespace(value: string): string;
```

**Description** : remplace toute suite d'espaces par une espace simple et supprime les espaces de tête et de fin. À utiliser pour nettoyer une saisie ou un texte copié-collé avant de le comparer, de le rechercher ou de l'enregistrer : espaces multiples, tabulations, retours à la ligne, espaces insécables (U+00A0) et fines insécables (U+202F) deviennent une espace simple. Supprime donc aussi les insécables de la typographie française : ne pas l'appliquer à un texte d'affichage qui doit les conserver.

**Paramètres**

- `value` : texte à nettoyer.

**Retour** : le texte avec des espaces simples, sans espace de tête ni de fin.

**Erreurs** : aucune.

**Exemple**

```ts
import { normalizeWhitespace } from "@etiennea20/adr-misc";

normalizeWhitespace("  Le   Petit\tPrince\n"); // "Le Petit Prince"
normalizeWhitespace("1 500 €"); // "1 500 €"
```

### `pluralize`

| Champ          | Valeur                                   |
| -------------- | ---------------------------------------- |
| Catégorie      | `string`                                 |
| Point d'entrée | `@etiennea20/adr-misc`                   |
| Statut         | stable                                   |
| Depuis         | 0.2.0                                    |
| Source         | `src/string/pluralize/pluralize.ts`      |
| Tests          | `src/string/pluralize/pluralize.test.ts` |

**Signature**

```ts
function pluralize(
  count: number,
  singular: string,
  pluralOrOptions?: string | IPluralizeOptions,
): string;
```

**Description** : accorde un mot au singulier ou au pluriel selon un nombre, avec la règle française : singulier quand la valeur absolue est inférieure à 2 (0, 1, 1,5, -1), pluriel à partir de 2. À utiliser pour les libellés dynamiques (« 1 livre », « 3 livres », « 0 retard »). Sans forme plurielle fournie, le pluriel régulier est déduit : -s, -x, -z invariables ; -au, -eau, -eu → -x sauf bleu, émeu, landau, pneu, sarrau ; les sept noms en -ou en -oux (bijou, caillou, chou, genou, hibou, joujou, pou) ; sinon « s ». Un mot en majuscules reçoit un suffixe en majuscules. Pour un pluriel irrégulier (« cheval ») ou une expression de plusieurs mots, fournir le pluriel.

**Paramètres**

- `count` : nombre qui détermine l'accord.
- `singular` : mot ou expression au singulier.
- `pluralOrOptions` : forme plurielle, ou options `plural`, `includeCount`, `locale` (voir `IPluralizeOptions`).

**Retour** : le mot accordé, éventuellement précédé du nombre formaté et d'une espace insécable.

**Erreurs** : `RangeError` si `count` vaut `NaN`.

**Exemple**

```ts
import { pluralize } from "@etiennea20/adr-misc";

pluralize(1, "livre"); // "livre"
pluralize(0, "retard"); // "retard"
pluralize(2, "livre"); // "livres"
pluralize(2, "cheval", "chevaux"); // "chevaux"
pluralize(1500, "livre", { includeCount: true }); // "1 500 livres" (espaces insécables)
```

### `removeAccents`

| Champ          | Valeur                                             |
| -------------- | -------------------------------------------------- |
| Catégorie      | `string`                                           |
| Point d'entrée | `@etiennea20/adr-misc`                             |
| Statut         | stable                                             |
| Depuis         | 0.2.0                                              |
| Source         | `src/string/remove-accents/remove-accents.ts`      |
| Tests          | `src/string/remove-accents/remove-accents.test.ts` |

**Signature**

```ts
function removeAccents(value: string): string;
```

**Description** : retire les accents et les diacritiques d'un texte, et décompose les ligatures. À utiliser pour comparer ou rechercher sans tenir compte des accents, ou pour produire un texte ASCII (identifiant, nom de fichier). « é » → « e », « ç » → « c », « œ » → « oe », « æ » → « ae », « ß » → « ss », « ø » → « o », « ł » → « l », « đ » → « d ». La casse est conservée. Seuls les diacritiques combinants génériques (U+0300 à U+036F : latin, grec, cyrillique) sont retirés ; les signes propres aux autres écritures sont conservés.

**Paramètres**

- `value` : texte à transformer (NFC ou NFD).

**Retour** : le texte sans accents, recomposé en NFC.

**Erreurs** : aucune.

**Exemple**

```ts
import { removeAccents } from "@etiennea20/adr-misc";

removeAccents("Élève à l’école"); // "Eleve a l’ecole"
removeAccents("Cœur d’Œdipe, ex æquo"); // "Coeur d’OEdipe, ex aequo"
```

### `slugify`

| Champ          | Valeur                               |
| -------------- | ------------------------------------ |
| Catégorie      | `string`                             |
| Point d'entrée | `@etiennea20/adr-misc`               |
| Statut         | stable                               |
| Depuis         | 0.2.0                                |
| Source         | `src/string/slugify/slugify.ts`      |
| Tests          | `src/string/slugify/slugify.test.ts` |

**Signature**

```ts
function slugify(value: string, options?: ISlugifyOptions): string;
```

**Description** : transforme un texte libre en « slug » utilisable dans une URL ou un nom de fichier. À utiliser pour construire une URL lisible à partir d'un titre (`/livres/le-petit-prince`) ou un nom de fichier d'export. Les accents sont retirés et les ligatures décomposées, puis toute suite de caractères autres que `a-z` et `0-9` devient un séparateur unique ; les séparateurs de tête et de fin sont supprimés. Les caractères non latins (cyrillique, chinois, emoji…) sont supprimés : le résultat peut être vide, à prévoir côté appelant.

**Paramètres**

- `value` : texte à transformer.
- `options` : `separator` (défaut `"-"`) et `lowercase` (défaut `true`).

**Retour** : le slug, éventuellement vide.

**Erreurs** : aucune.

**Exemple**

```ts
import { slugify } from "@etiennea20/adr-misc";

slugify("L’Île mystérieuse : tome 2"); // "l-ile-mysterieuse-tome-2"
slugify("Œuvres complètes", { separator: "_" }); // "oeuvres_completes"
slugify("Rapport Annuel 2026", { lowercase: false }); // "Rapport-Annuel-2026"
```

### `truncate`

| Champ          | Valeur                                 |
| -------------- | -------------------------------------- |
| Catégorie      | `string`                               |
| Point d'entrée | `@etiennea20/adr-misc`                 |
| Statut         | stable                                 |
| Depuis         | 0.2.0                                  |
| Source         | `src/string/truncate/truncate.ts`      |
| Tests          | `src/string/truncate/truncate.test.ts` |

**Signature**

```ts
function truncate(text: string, maxLength: number, options?: ITruncateOptions): string;
```

**Description** : tronque un texte trop long et y ajoute un suffixe (`…` par défaut). À utiliser pour afficher un résumé, un titre ou une description dans un espace limité (carte, liste, notification). Le résultat, suffixe compris, ne dépasse jamais `maxLength` ; un texte assez court est renvoyé tel quel. Les espaces et la ponctuation (`,`, `;`, `:`, tirets) qui précéderaient le suffixe sont retirés, et une paire de substitution (emoji) n'est jamais coupée en deux. Les longueurs sont comptées en unités de code UTF-16 (`string.length`), comme `maxlength` en HTML.

**Paramètres**

- `text` : texte à tronquer.
- `maxLength` : longueur maximale du résultat, suffixe compris (entier positif ou nul).
- `options` : `suffix` et `wordBoundary` (voir `ITruncateOptions`).

**Retour** : le texte, tronqué et suffixé s'il dépassait `maxLength`.

**Erreurs** : `RangeError` si `maxLength` n'est pas un entier positif ou nul.

**Exemple**

```ts
import { truncate } from "@etiennea20/adr-misc";

truncate("Le Comte de Monte-Cristo", 15); // "Le Comte de Mo…"
truncate("Le Comte de Monte-Cristo", 15, { wordBoundary: true }); // "Le Comte de…"
truncate("Court", 15); // "Court"
```

### `unescapeHtml`

| Champ          | Valeur                                           |
| -------------- | ------------------------------------------------ |
| Catégorie      | `string`                                         |
| Point d'entrée | `@etiennea20/adr-misc`                           |
| Statut         | stable                                           |
| Depuis         | 0.2.0                                            |
| Source         | `src/string/unescape-html/unescape-html.ts`      |
| Tests          | `src/string/unescape-html/unescape-html.test.ts` |

**Signature**

```ts
function unescapeHtml(value: string): string;
```

**Description** : décode les entités HTML d'un texte (opération inverse de `escapeHtml`). À utiliser pour afficher en texte brut un contenu reçu échappé (flux RSS, export HTML, réponse d'une ancienne API). Décode les entités numériques (`&#39;`, `&#x27;`) et les entités nommées courantes en français : `&amp;`, `&lt;`, `&gt;`, `&quot;`, `&apos;`, `&nbsp;`, guillemets et apostrophes typographiques (`&laquo;`, `&raquo;`, `&lsquo;`, `&rsquo;`, `&ldquo;`, `&rdquo;`), `&hellip;`, `&ndash;`, `&mdash;`, `&euro;`, `&copy;`, ligatures (`&oelig;`, `&aelig;`, `&szlig;`…) et lettres accentuées (`&eacute;`, `&ccedil;`, `&ntilde;`…). Les entités inconnues ou invalides sont laissées telles quelles ; le décodage se fait en une passe (`&amp;lt;` donne `&lt;`). Le résultat n'est pas sûr à insérer dans du HTML.

**Paramètres**

- `value` : texte contenant des entités HTML.

**Retour** : le texte décodé.

**Erreurs** : aucune.

**Exemple**

```ts
import { unescapeHtml } from "@etiennea20/adr-misc";

unescapeHtml("Tom &amp; Jerry"); // "Tom & Jerry"
unescapeHtml("L&#x27;&eacute;l&egrave;ve"); // "L'élève"
unescapeHtml("&laquo;&nbsp;Bonjour&nbsp;&raquo;"); // "« Bonjour »"
```

## case

### `ICapitalizeOptions`

| Champ          | Valeur                                   |
| -------------- | ---------------------------------------- |
| Catégorie      | `case`                                   |
| Point d'entrée | `@etiennea20/adr-misc`                   |
| Statut         | stable                                   |
| Depuis         | 0.2.0                                    |
| Source         | `src/case/capitalize/capitalize.ts`      |
| Tests          | `src/case/capitalize/capitalize.test.ts` |

**Signature**

```ts
interface ICapitalizeOptions {
  lowerRest?: boolean;
}
```

**Description** : options de `capitalize`. `lowerRest` (défaut `false`) met aussi le reste du texte en minuscules, utile pour un nom saisi en majuscules.

**Exemple**

```ts
import { capitalize, type ICapitalizeOptions } from "@etiennea20/adr-misc";

const options: ICapitalizeOptions = { lowerRest: true };
capitalize("DUPONT", options); // "Dupont"
```

### `IToTitleCaseOptions`

| Champ          | Valeur                                         |
| -------------- | ---------------------------------------------- |
| Catégorie      | `case`                                         |
| Point d'entrée | `@etiennea20/adr-misc`                         |
| Statut         | stable                                         |
| Depuis         | 0.2.0                                          |
| Source         | `src/case/to-title-case/to-title-case.ts`      |
| Tests          | `src/case/to-title-case/to-title-case.test.ts` |

**Signature**

```ts
interface IToTitleCaseOptions {
  lowercaseMinorWords?: boolean;
  minorWords?: readonly string[];
}
```

**Description** : options de `toTitleCase`. `lowercaseMinorWords` (défaut `false`) laisse les petits mots (articles, prépositions, conjonctions) en minuscules, sauf en tête du texte ; `minorWords` remplace la liste de ces petits mots (comparaison insensible à la casse ; par défaut : à, au, aux, avec, d, dans, de, des, du, en, et, l, la, le, les, ni, ou, par, pour, sans, sous, sur, un, une).

**Exemple**

```ts
import { toTitleCase, type IToTitleCaseOptions } from "@etiennea20/adr-misc";

const options: IToTitleCaseOptions = { lowercaseMinorWords: true };
toTitleCase("le comte de monte-cristo", options); // "Le Comte de Monte-Cristo"
```

### `capitalize`

| Champ          | Valeur                                   |
| -------------- | ---------------------------------------- |
| Catégorie      | `case`                                   |
| Point d'entrée | `@etiennea20/adr-misc`                   |
| Statut         | stable                                   |
| Depuis         | 0.2.0                                    |
| Source         | `src/case/capitalize/capitalize.ts`      |
| Tests          | `src/case/capitalize/capitalize.test.ts` |

**Signature**

```ts
function capitalize(value: string, options?: ICapitalizeOptions): string;
```

**Description** : met en majuscule la première lettre d'un texte, sans toucher au reste (sauf option `lowerRest`). À utiliser pour afficher un libellé, un nom ou une phrase commençant par une majuscule. La ponctuation et les espaces de tête sont ignorés : la majuscule porte sur le premier caractère alphanumérique ; si c'est un chiffre, rien n'est mis en majuscule (« 1er janvier » reste inchangé).

**Paramètres**

- `value` : texte à transformer.
- `options` : `lowerRest` pour mettre le reste en minuscules (défaut `false`).

**Retour** : le texte avec sa première lettre en majuscule.

**Erreurs** : aucune.

**Exemple**

```ts
import { capitalize } from "@etiennea20/adr-misc";

capitalize("œuvres complètes"); // "Œuvres complètes"
capitalize("élodie"); // "Élodie"
capitalize("JEAN", { lowerRest: true }); // "Jean"
```

### `toCamelCase`

| Champ          | Valeur                                         |
| -------------- | ---------------------------------------------- |
| Catégorie      | `case`                                         |
| Point d'entrée | `@etiennea20/adr-misc`                         |
| Statut         | stable                                         |
| Depuis         | 0.2.0                                          |
| Source         | `src/case/to-camel-case/to-camel-case.ts`      |
| Tests          | `src/case/to-camel-case/to-camel-case.test.ts` |

**Signature**

```ts
function toCamelCase(value: string): string;
```

**Description** : convertit un texte en `camelCase` (`nomDuChamp`). À utiliser pour dériver un nom de propriété ou de variable d'un libellé, d'une clé `snake_case` (API, base de données) ou `kebab-case`. Les mots sont découpés sur les espaces, tirets, underscores, ponctuation et changements de casse ; les sigles sont traités comme des mots (`XMLHttpRequest` → `xmlHttpRequest`) et les chiffres restent collés au mot qui les précède. Les accents sont conservés : appliquer `removeAccents` avant si l'identifiant doit être en ASCII.

**Paramètres**

- `value` : texte à convertir.

**Retour** : le texte en `camelCase`, ou une chaîne vide s'il ne contient aucun mot.

**Erreurs** : aucune.

**Exemple**

```ts
import { toCamelCase } from "@etiennea20/adr-misc";

toCamelCase("date_de_retour"); // "dateDeRetour"
toCamelCase("XMLHttpRequest"); // "xmlHttpRequest"
toCamelCase("Nombre d’emprunts"); // "nombreDEmprunts"
```

### `toConstantCase`

| Champ          | Valeur                                               |
| -------------- | ---------------------------------------------------- |
| Catégorie      | `case`                                               |
| Point d'entrée | `@etiennea20/adr-misc`                               |
| Statut         | stable                                               |
| Depuis         | 0.2.0                                                |
| Source         | `src/case/to-constant-case/to-constant-case.ts`      |
| Tests          | `src/case/to-constant-case/to-constant-case.test.ts` |

**Signature**

```ts
function toConstantCase(value: string): string;
```

**Description** : convertit un texte en `CONSTANT_CASE` (`UPPER_SNAKE_CASE` : `NOM_DU_CHAMP`). À utiliser pour dériver un nom de constante, une clé d'énumération (`EWeekDay.MONDAY`) ou une variable d'environnement. Les mots sont découpés comme pour `toCamelCase` puis mis en majuscules et reliés par des underscores. Les accents sont conservés.

**Paramètres**

- `value` : texte à convertir.

**Retour** : le texte en `CONSTANT_CASE`, ou une chaîne vide s'il ne contient aucun mot.

**Erreurs** : aucune.

**Exemple**

```ts
import { toConstantCase } from "@etiennea20/adr-misc";

toConstantCase("maxLoanCount"); // "MAX_LOAN_COUNT"
toConstantCase("en retard"); // "EN_RETARD"
```

### `toKebabCase`

| Champ          | Valeur                                         |
| -------------- | ---------------------------------------------- |
| Catégorie      | `case`                                         |
| Point d'entrée | `@etiennea20/adr-misc`                         |
| Statut         | stable                                         |
| Depuis         | 0.2.0                                          |
| Source         | `src/case/to-kebab-case/to-kebab-case.ts`      |
| Tests          | `src/case/to-kebab-case/to-kebab-case.test.ts` |

**Signature**

```ts
function toKebabCase(value: string): string;
```

**Description** : convertit un texte en `kebab-case` (`nom-du-champ`). À utiliser pour un nom de fichier, une classe CSS, un attribut `data-*` ou un segment d'URL dérivé d'un identifiant. Les mots sont découpés comme pour `toCamelCase` puis mis en minuscules et reliés par des tirets. Les accents sont conservés : pour une URL lisible à partir d'un texte libre, préférer `slugify`.

**Paramètres**

- `value` : texte à convertir.

**Retour** : le texte en `kebab-case`, ou une chaîne vide s'il ne contient aucun mot.

**Erreurs** : aucune.

**Exemple**

```ts
import { toKebabCase } from "@etiennea20/adr-misc";

toKebabCase("BookCard"); // "book-card"
toKebabCase("XMLHttpRequest"); // "xml-http-request"
```

### `toPascalCase`

| Champ          | Valeur                                           |
| -------------- | ------------------------------------------------ |
| Catégorie      | `case`                                           |
| Point d'entrée | `@etiennea20/adr-misc`                           |
| Statut         | stable                                           |
| Depuis         | 0.2.0                                            |
| Source         | `src/case/to-pascal-case/to-pascal-case.ts`      |
| Tests          | `src/case/to-pascal-case/to-pascal-case.test.ts` |

**Signature**

```ts
function toPascalCase(value: string): string;
```

**Description** : convertit un texte en `PascalCase` (`NomDuChamp`). À utiliser pour dériver un nom de composant, de classe ou de type d'un libellé ou d'une clé. Les mots sont découpés comme pour `toCamelCase` ; chaque mot commence par une majuscule, le reste est en minuscules. Les accents sont conservés.

**Paramètres**

- `value` : texte à convertir.

**Retour** : le texte en `PascalCase`, ou une chaîne vide s'il ne contient aucun mot.

**Erreurs** : aucune.

**Exemple**

```ts
import { toPascalCase } from "@etiennea20/adr-misc";

toPascalCase("book-card"); // "BookCard"
toPascalCase("XMLHttpRequest"); // "XmlHttpRequest"
```

### `toSnakeCase`

| Champ          | Valeur                                         |
| -------------- | ---------------------------------------------- |
| Catégorie      | `case`                                         |
| Point d'entrée | `@etiennea20/adr-misc`                         |
| Statut         | stable                                         |
| Depuis         | 0.2.0                                          |
| Source         | `src/case/to-snake-case/to-snake-case.ts`      |
| Tests          | `src/case/to-snake-case/to-snake-case.test.ts` |

**Signature**

```ts
function toSnakeCase(value: string): string;
```

**Description** : convertit un texte en `snake_case` (`nom_du_champ`). À utiliser pour produire une clé attendue par une API ou une base de données en `snake_case` à partir d'une propriété `camelCase`. Les mots sont découpés comme pour `toCamelCase` puis mis en minuscules et reliés par des underscores. Les accents sont conservés.

**Paramètres**

- `value` : texte à convertir.

**Retour** : le texte en `snake_case`, ou une chaîne vide s'il ne contient aucun mot.

**Erreurs** : aucune.

**Exemple**

```ts
import { toSnakeCase } from "@etiennea20/adr-misc";

toSnakeCase("dateDeRetour"); // "date_de_retour"
toSnakeCase("userID"); // "user_id"
```

### `toTitleCase`

| Champ          | Valeur                                         |
| -------------- | ---------------------------------------------- |
| Catégorie      | `case`                                         |
| Point d'entrée | `@etiennea20/adr-misc`                         |
| Statut         | stable                                         |
| Depuis         | 0.2.0                                          |
| Source         | `src/case/to-title-case/to-title-case.ts`      |
| Tests          | `src/case/to-title-case/to-title-case.test.ts` |

**Signature**

```ts
function toTitleCase(value: string, options?: IToTitleCaseOptions): string;
```

**Description** : met une majuscule au début de chaque mot d'un titre, en respectant les usages français. À utiliser pour afficher un titre d'ouvrage, un nom de rubrique ou un nom composé saisi sans soin. Chaque mot prend une majuscule initiale et le reste passe en minuscules ; la ponctuation et les espaces d'origine sont conservés. Les mots composés prennent une majuscule à chaque partie (« Monte-Cristo »), les élisions sont respectées (« L’Île », mais « Aujourd’hui »). Avec `lowercaseMinorWords`, les articles, prépositions et conjonctions restent en minuscules, sauf en tête du texte. Attention : les sigles perdent leurs majuscules (« SNCF » devient « Sncf »).

**Paramètres**

- `value` : texte à transformer.
- `options` : `lowercaseMinorWords` (défaut `false`) et `minorWords` (petits mots français par défaut).

**Retour** : le texte avec une majuscule au début de chaque mot.

**Erreurs** : aucune.

**Exemple**

```ts
import { toTitleCase } from "@etiennea20/adr-misc";

toTitleCase("le petit prince"); // "Le Petit Prince"
toTitleCase("vingt mille lieues sous les mers", { lowercaseMinorWords: true });
// "Vingt Mille Lieues sous les Mers"
toTitleCase("l’île mystérieuse"); // "L’Île Mystérieuse"
```

### `uncapitalize`

| Champ          | Valeur                                       |
| -------------- | -------------------------------------------- |
| Catégorie      | `case`                                       |
| Point d'entrée | `@etiennea20/adr-misc`                       |
| Statut         | stable                                       |
| Depuis         | 0.2.0                                        |
| Source         | `src/case/uncapitalize/uncapitalize.ts`      |
| Tests          | `src/case/uncapitalize/uncapitalize.test.ts` |

**Signature**

```ts
function uncapitalize(value: string): string;
```

**Description** : met en minuscule la première lettre d'un texte, sans toucher au reste. À utiliser pour insérer un libellé au milieu d'une phrase (« Supprimer le livre » → « Voulez-vous supprimer le livre ? ») ou pour dériver un identifiant `camelCase` d'un nom `PascalCase`. La ponctuation et les espaces de tête sont ignorés, comme pour `capitalize`.

**Paramètres**

- `value` : texte à transformer.

**Retour** : le texte avec sa première lettre en minuscule.

**Erreurs** : aucune.

**Exemple**

```ts
import { uncapitalize } from "@etiennea20/adr-misc";

uncapitalize("Supprimer le livre"); // "supprimer le livre"
uncapitalize("ÉLÈVE"); // "éLÈVE"
```

## math

### `average`

| Champ          | Valeur                             |
| -------------- | ---------------------------------- |
| Catégorie      | `math`                             |
| Point d'entrée | `@etiennea20/adr-misc`             |
| Statut         | stable                             |
| Depuis         | 0.2.0                              |
| Source         | `src/math/average/average.ts`      |
| Tests          | `src/math/average/average.test.ts` |

**Signature**

```ts
function average(values: readonly number[]): number;
```

**Description** : calcule la moyenne arithmétique d'une liste de nombres (durée moyenne d'emprunt, note moyenne). Une liste vide renvoie `NaN` plutôt que `0`, qui serait une valeur trompeuse : tester `Number.isNaN` avant d'afficher.

**Paramètres**

- `values` : nombres dont on veut la moyenne.

**Retour** : la moyenne, ou `NaN` pour une liste vide.

**Erreurs** : aucune.

**Exemple**

```ts
import { average } from "@etiennea20/adr-misc";

average([12, 15, 18]); // 15
average([]); // NaN
```

### `clamp`

| Champ          | Valeur                         |
| -------------- | ------------------------------ |
| Catégorie      | `math`                         |
| Point d'entrée | `@etiennea20/adr-misc`         |
| Statut         | stable                         |
| Depuis         | 0.2.0                          |
| Source         | `src/math/clamp/clamp.ts`      |
| Tests          | `src/math/clamp/clamp.test.ts` |

**Signature**

```ts
function clamp(value: number, min: number, max: number): number;
```

**Description** : contraint un nombre dans l'intervalle `[min, max]`, bornes incluses. À utiliser pour borner une saisie ou un résultat de calcul (quantité, page demandée, note sur 5, pourcentage d'une jauge).

**Paramètres**

- `value` : nombre à contraindre (`NaN` est renvoyé tel quel).
- `min` : borne inférieure (incluse).
- `max` : borne supérieure (incluse).

**Retour** : `min` si `value < min`, `max` si `value > max`, sinon `value`.

**Erreurs** : `RangeError` si `min > max` ou si l'une des bornes vaut `NaN`.

**Exemple**

```ts
import { clamp } from "@etiennea20/adr-misc";

clamp(12, 1, 10); // 10
clamp(-3, 0, 5); // 0
clamp(4, 0, 5); // 4
```

### `inRange`

| Champ          | Valeur                               |
| -------------- | ------------------------------------ |
| Catégorie      | `math`                               |
| Point d'entrée | `@etiennea20/adr-misc`               |
| Statut         | stable                               |
| Depuis         | 0.2.0                                |
| Source         | `src/math/in-range/in-range.ts`      |
| Tests          | `src/math/in-range/in-range.test.ts` |

**Signature**

```ts
function inRange(value: number, min: number, max: number): boolean;
```

**Description** : indique si un nombre appartient à l'intervalle `[min, max]`, **bornes incluses**. À utiliser pour tester une tranche (âge pour un tarif, palier de jours de retard, note dans un barème).

**Paramètres**

- `value` : nombre à tester (`NaN` n'appartient à aucun intervalle).
- `min` : borne inférieure (incluse).
- `max` : borne supérieure (incluse).

**Retour** : `true` si `min ≤ value ≤ max`.

**Erreurs** : `RangeError` si `min > max` ou si l'une des bornes vaut `NaN`.

**Exemple**

```ts
import { inRange } from "@etiennea20/adr-misc";

inRange(18, 18, 25); // true (bornes incluses)
inRange(26, 18, 25); // false
```

### `lerp`

| Champ          | Valeur                       |
| -------------- | ---------------------------- |
| Catégorie      | `math`                       |
| Point d'entrée | `@etiennea20/adr-misc`       |
| Statut         | stable                       |
| Depuis         | 0.2.0                        |
| Source         | `src/math/lerp/lerp.ts`      |
| Tests          | `src/math/lerp/lerp.test.ts` |

**Signature**

```ts
function lerp(start: number, end: number, t: number): number;
```

**Description** : calcule l'interpolation linéaire entre deux nombres. À utiliser pour une progression proportionnelle (animation, dégradé, estimation entre deux mesures). `t` n'est pas borné : hors de `[0, 1]`, le résultat est extrapolé (combiner avec `clamp` pour l'éviter).

**Paramètres**

- `start` : valeur pour `t = 0`.
- `end` : valeur pour `t = 1`.
- `t` : progression, en général entre 0 et 1.

**Retour** : `start + (end - start) * t`, exactement `start` pour `t = 0` et `end` pour `t = 1`.

**Erreurs** : aucune.

**Exemple**

```ts
import { lerp } from "@etiennea20/adr-misc";

lerp(0, 100, 0.25); // 25
lerp(0, 10, 1.5); // 15 (extrapolation)
```

### `maxBy`

| Champ          | Valeur                           |
| -------------- | -------------------------------- |
| Catégorie      | `math`                           |
| Point d'entrée | `@etiennea20/adr-misc`           |
| Statut         | stable                           |
| Depuis         | 0.2.0                            |
| Source         | `src/math/max-by/max-by.ts`      |
| Tests          | `src/math/max-by/max-by.test.ts` |

**Signature**

```ts
function maxBy<T>(items: readonly T[], getValue: (item: T) => number): T | undefined;
```

**Description** : renvoie l'élément (et non la valeur) dont la valeur extraite est la plus grande : retard le plus long, livre le plus emprunté. En cas d'égalité, le premier élément est renvoyé ; les valeurs `NaN` sont ignorées.

**Paramètres**

- `items` : éléments à parcourir (type générique `T`).
- `getValue` : fonction qui renvoie la valeur à comparer pour un élément.

**Retour** : l'élément de plus grande valeur, ou `undefined` pour une liste vide (ou ne contenant que des `NaN`).

**Erreurs** : aucune.

**Exemple**

```ts
import { maxBy } from "@etiennea20/adr-misc";

const loans = [
  { bookId: "b1", daysLate: 3 },
  { bookId: "b2", daysLate: 12 },
];
maxBy(loans, (loan) => loan.daysLate); // { bookId: "b2", daysLate: 12 }
```

### `median`

| Champ          | Valeur                           |
| -------------- | -------------------------------- |
| Catégorie      | `math`                           |
| Point d'entrée | `@etiennea20/adr-misc`           |
| Statut         | stable                           |
| Depuis         | 0.2.0                            |
| Source         | `src/math/median/median.ts`      |
| Tests          | `src/math/median/median.test.ts` |

**Signature**

```ts
function median(values: readonly number[]): number;
```

**Description** : calcule la médiane (valeur centrale une fois triée). À préférer à la moyenne quand quelques valeurs extrêmes faussent le résultat. Pour un nombre pair d'éléments, renvoie la moyenne des deux valeurs centrales. La liste n'est pas modifiée.

**Paramètres**

- `values` : nombres dont on veut la médiane, dans n'importe quel ordre.

**Retour** : la médiane, ou `NaN` pour une liste vide.

**Erreurs** : aucune.

**Exemple**

```ts
import { median } from "@etiennea20/adr-misc";

median([3, 1, 2]); // 2
median([10, 2, 4, 6]); // 5
median([]); // NaN
```

### `minBy`

| Champ          | Valeur                           |
| -------------- | -------------------------------- |
| Catégorie      | `math`                           |
| Point d'entrée | `@etiennea20/adr-misc`           |
| Statut         | stable                           |
| Depuis         | 0.2.0                            |
| Source         | `src/math/min-by/min-by.ts`      |
| Tests          | `src/math/min-by/min-by.test.ts` |

**Signature**

```ts
function minBy<T>(items: readonly T[], getValue: (item: T) => number): T | undefined;
```

**Description** : renvoie l'élément (et non la valeur) dont la valeur extraite est la plus petite : emprunt le plus ancien, livre le moins cher. En cas d'égalité, le premier élément est renvoyé ; les valeurs `NaN` sont ignorées.

**Paramètres**

- `items` : éléments à parcourir (type générique `T`).
- `getValue` : fonction qui renvoie la valeur à comparer pour un élément.

**Retour** : l'élément de plus petite valeur, ou `undefined` pour une liste vide (ou ne contenant que des `NaN`).

**Erreurs** : aucune.

**Exemple**

```ts
import { minBy } from "@etiennea20/adr-misc";

const books = [
  { title: "Germinal", price: 8 },
  { title: "Nana", price: 6.5 },
];
minBy(books, (book) => book.price); // { title: "Nana", price: 6.5 }
```

### `percentage`

| Champ          | Valeur                                   |
| -------------- | ---------------------------------------- |
| Catégorie      | `math`                                   |
| Point d'entrée | `@etiennea20/adr-misc`                   |
| Statut         | stable                                   |
| Depuis         | 0.2.0                                    |
| Source         | `src/math/percentage/percentage.ts`      |
| Tests          | `src/math/percentage/percentage.test.ts` |

**Signature**

```ts
function percentage(value: number, total: number, decimals?: number): number;
```

**Description** : calcule le pourcentage que représente une valeur par rapport à un total (livres empruntés sur le fonds, objectif atteint). Un total nul renvoie `0` (ni `NaN` ni `Infinity`), ce qui convient à une jauge vide.

**Paramètres**

- `value` : partie du total.
- `total` : total de référence (100 %).
- `decimals` : nombre de décimales du résultat (voir `round`) ; sans valeur, pas d'arrondi.

**Retour** : le pourcentage (`25` pour 25 %, pas `0.25`), ou `0` si `total` vaut `0`.

**Erreurs** : `RangeError` si `decimals` est fourni mais n'est pas un entier.

**Exemple**

```ts
import { percentage } from "@etiennea20/adr-misc";

percentage(30, 120); // 25
percentage(1, 3, 1); // 33.3
percentage(5, 0); // 0
```

### `round`

| Champ          | Valeur                         |
| -------------- | ------------------------------ |
| Catégorie      | `math`                         |
| Point d'entrée | `@etiennea20/adr-misc`         |
| Statut         | stable                         |
| Depuis         | 0.2.0                          |
| Source         | `src/math/round/round.ts`      |
| Tests          | `src/math/round/round.test.ts` |

**Signature**

```ts
function round(value: number, decimals?: number): number;
```

**Description** : arrondit un nombre à un nombre de décimales donné, sans les erreurs de l'arithmétique flottante (`round(1.005, 2)` vaut bien `1.01`). À utiliser avant d'afficher ou de stocker un montant, une moyenne ou un pourcentage. Les demis s'éloignent de zéro (`round(-2.5)` vaut `-3`), comme `Intl.NumberFormat` ; des décimales négatives arrondissent aux dizaines, centaines…

**Paramètres**

- `value` : nombre à arrondir (`NaN` et les infinis sont renvoyés tels quels).
- `decimals` : nombre de décimales à conserver, entier éventuellement négatif (défaut `0`).

**Retour** : le nombre arrondi (jamais `-0`).

**Erreurs** : `RangeError` si `decimals` n'est pas un entier.

**Exemple**

```ts
import { round } from "@etiennea20/adr-misc";

round(1.005, 2); // 1.01
round(2.5); // 3
round(-2.5); // -3
round(1234.5, -2); // 1200
```

### `roundToStep`

| Champ          | Valeur                                         |
| -------------- | ---------------------------------------------- |
| Catégorie      | `math`                                         |
| Point d'entrée | `@etiennea20/adr-misc`                         |
| Statut         | stable                                         |
| Depuis         | 0.2.0                                          |
| Source         | `src/math/round-to-step/round-to-step.ts`      |
| Tests          | `src/math/round-to-step/round-to-step.test.ts` |

**Signature**

```ts
function roundToStep(value: number, step: number): number;
```

**Description** : arrondit un nombre au multiple le plus proche d'un pas, sans erreur flottante. À utiliser pour caler une valeur sur une grille (prix au multiple de 0,05 €, durée au quart d'heure, quantité par lots). Les demis s'éloignent de zéro, comme avec `round`.

**Paramètres**

- `value` : nombre à arrondir.
- `step` : pas de la grille, strictement positif.

**Retour** : le multiple de `step` le plus proche de `value`.

**Erreurs** : `RangeError` si `step` n'est pas un nombre fini strictement positif.

**Exemple**

```ts
import { roundToStep } from "@etiennea20/adr-misc";

roundToStep(1.23, 0.05); // 1.25
roundToStep(52, 15); // 45 (minutes)
roundToStep(53, 15); // 60
```

### `sum`

| Champ          | Valeur                     |
| -------------- | -------------------------- |
| Catégorie      | `math`                     |
| Point d'entrée | `@etiennea20/adr-misc`     |
| Statut         | stable                     |
| Depuis         | 0.2.0                      |
| Source         | `src/math/sum/sum.ts`      |
| Tests          | `src/math/sum/sum.test.ts` |

**Signature**

```ts
function sum(values: readonly number[]): number;
```

**Description** : additionne une liste de nombres (montants, quantités). Pour additionner une propriété d'objets, utiliser `sumBy`. Le résultat suit l'arithmétique flottante : l'arrondir avec `round` avant affichage.

**Paramètres**

- `values` : nombres à additionner.

**Retour** : la somme, ou `0` pour une liste vide.

**Erreurs** : aucune.

**Exemple**

```ts
import { sum } from "@etiennea20/adr-misc";

sum([12, 8.5, 3]); // 23.5
sum([]); // 0
```

### `sumBy`

| Champ          | Valeur                           |
| -------------- | -------------------------------- |
| Catégorie      | `math`                           |
| Point d'entrée | `@etiennea20/adr-misc`           |
| Statut         | stable                           |
| Depuis         | 0.2.0                            |
| Source         | `src/math/sum-by/sum-by.ts`      |
| Tests          | `src/math/sum-by/sum-by.test.ts` |

**Signature**

```ts
function sumBy<T>(items: readonly T[], getValue: (item: T, index: number) => number): number;
```

**Description** : additionne une valeur numérique extraite de chaque élément d'une liste (montant des pénalités, nombre de pages) sans passer par `map` puis `reduce`.

**Paramètres**

- `items` : éléments à parcourir (type générique `T`).
- `getValue` : fonction qui renvoie la valeur à additionner pour un élément (reçoit aussi son index).

**Retour** : la somme des valeurs, ou `0` pour une liste vide.

**Erreurs** : aucune.

**Exemple**

```ts
import { sumBy } from "@etiennea20/adr-misc";

const fines = [{ amount: 1.5 }, { amount: 3 }];
sumBy(fines, (fine) => fine.amount); // 4.5
```

## random

### `createSeededRandom`

| Champ          | Valeur                                                         |
| -------------- | -------------------------------------------------------------- |
| Catégorie      | `random`                                                       |
| Point d'entrée | `@etiennea20/adr-misc`                                         |
| Statut         | stable                                                         |
| Depuis         | 0.2.0                                                          |
| Source         | `src/random/create-seeded-random/create-seeded-random.ts`      |
| Tests          | `src/random/create-seeded-random/create-seeded-random.test.ts` |

**Signature**

```ts
function createSeededRandom(seed: number | string): () => number;
```

**Description** : crée un générateur pseudo-aléatoire **déterministe** (mulberry32) : la même graine produit toujours la même suite. À passer comme paramètre `random` des autres fonctions de la catégorie pour des tests, des démos ou des données reproductibles. **Non adapté** à un usage sensible : la suite est prévisible par construction.

**Paramètres**

- `seed` : graine, nombre (tronqué en entier 32 bits) ou texte (haché).

**Retour** : une fonction qui renvoie à chaque appel le nombre suivant de la suite, dans `[0, 1)`.

**Erreurs** : `RangeError` si `seed` est un nombre non fini (`NaN`, `Infinity`).

**Exemple**

```ts
import { createSeededRandom, shuffle } from "@etiennea20/adr-misc";

const random = createSeededRandom(42);
random(); // toujours la même valeur pour la graine 42
shuffle(["a", "b", "c"], createSeededRandom("démo")); // toujours le même ordre
```

### `createUuid`

| Champ          | Valeur                                       |
| -------------- | -------------------------------------------- |
| Catégorie      | `random`                                     |
| Point d'entrée | `@etiennea20/adr-misc`                       |
| Statut         | stable                                       |
| Depuis         | 0.2.0                                        |
| Source         | `src/random/create-uuid/create-uuid.ts`      |
| Tests          | `src/random/create-uuid/create-uuid.test.ts` |

**Signature**

```ts
function createUuid(): string;
```

**Description** : génère un UUID v4 à partir de l'API Web Crypto (`crypto.randomUUID()`, sinon `crypto.getRandomValues()`, car le navigateur n'expose `randomUUID` qu'en HTTPS ou sur localhost). Seule fonction de la catégorie adaptée à un usage sensible : identifiant créé côté client, clé d'idempotence, identifiant de corrélation.

**Retour** : un UUID v4 en minuscules, par exemple `"3b241101-e2bb-4255-8caf-4136c566a962"`.

**Erreurs** : `Error` si l'API Web Crypto est absente de l'environnement.

**Exemple**

```ts
import { createUuid } from "@etiennea20/adr-misc";

const loanId = createUuid(); // par exemple "3b241101-e2bb-4255-8caf-4136c566a962"
```

### `IRandomStringOptions`

| Champ          | Valeur                                           |
| -------------- | ------------------------------------------------ |
| Catégorie      | `random`                                         |
| Point d'entrée | `@etiennea20/adr-misc`                           |
| Statut         | stable                                           |
| Depuis         | 0.2.0                                            |
| Source         | `src/random/random-string/random-string.ts`      |
| Tests          | `src/random/random-string/random-string.test.ts` |

**Signature**

```ts
interface IRandomStringOptions {
  alphabet?: string;
  random?: () => number;
}
```

**Description** : options de `randomString`. `alphabet` liste les caractères utilisables (chaque caractère Unicode compte pour un, les doublons augmentent sa probabilité ; défaut : lettres ASCII majuscules et minuscules et chiffres, 62 caractères). `random` est le générateur de nombres dans `[0, 1)` (défaut `Math.random`).

**Exemple**

```ts
import { randomString, type IRandomStringOptions } from "@etiennea20/adr-misc";

const options: IRandomStringOptions = { alphabet: "0123456789" };
randomString(6, options); // par exemple "402917"
```

### `randomFloat`

| Champ          | Valeur                                         |
| -------------- | ---------------------------------------------- |
| Catégorie      | `random`                                       |
| Point d'entrée | `@etiennea20/adr-misc`                         |
| Statut         | stable                                         |
| Depuis         | 0.2.0                                          |
| Source         | `src/random/random-float/random-float.ts`      |
| Tests          | `src/random/random-float/random-float.test.ts` |

**Signature**

```ts
function randomFloat(min: number, max: number, random?: () => number): number;
```

**Description** : tire un nombre décimal au hasard dans `[min, max)` (max exclu). À utiliser pour des valeurs continues (position, durée simulée, données de démonstration). Non adapté à un usage sensible.

**Paramètres**

- `min` : borne inférieure (incluse).
- `max` : borne supérieure (exclue, sauf si égale à `min`).
- `random` : générateur de nombres dans `[0, 1)` (défaut `Math.random`).

**Retour** : un nombre `x` tel que `min ≤ x < max` (ou `min` si `min === max`).

**Erreurs** : `RangeError` si une borne n'est pas un nombre fini ou si `min > max`.

**Exemple**

```ts
import { randomFloat } from "@etiennea20/adr-misc";

randomFloat(0, 1); // par exemple 0.4271…
randomFloat(10, 20, () => 0.5); // 15
```

### `randomInt`

| Champ          | Valeur                                     |
| -------------- | ------------------------------------------ |
| Catégorie      | `random`                                   |
| Point d'entrée | `@etiennea20/adr-misc`                     |
| Statut         | stable                                     |
| Depuis         | 0.2.0                                      |
| Source         | `src/random/random-int/random-int.ts`      |
| Tests          | `src/random/random-int/random-int.test.ts` |

**Signature**

```ts
function randomInt(min: number, max: number, random?: () => number): number;
```

**Description** : tire un entier au hasard entre deux bornes **incluses** (numéro de place, dé, index). Le générateur est injectable pour un tirage reproductible. Non adapté à un usage sensible (jeton, mot de passe).

**Paramètres**

- `min` : borne inférieure (incluse), entier.
- `max` : borne supérieure (incluse), entier.
- `random` : générateur de nombres dans `[0, 1)` (défaut `Math.random`).

**Retour** : un entier `n` tel que `min ≤ n ≤ max`.

**Erreurs** : `RangeError` si `min` ou `max` n'est pas un entier sûr, ou si `min > max`.

**Exemple**

```ts
import { createSeededRandom, randomInt } from "@etiennea20/adr-misc";

randomInt(1, 6); // 1, 2, 3, 4, 5 ou 6
randomInt(1, 6, createSeededRandom(42)); // toujours le même résultat
```

### `randomItem`

| Champ          | Valeur                                       |
| -------------- | -------------------------------------------- |
| Catégorie      | `random`                                     |
| Point d'entrée | `@etiennea20/adr-misc`                       |
| Statut         | stable                                       |
| Depuis         | 0.2.0                                        |
| Source         | `src/random/random-item/random-item.ts`      |
| Tests          | `src/random/random-item/random-item.test.ts` |

**Signature**

```ts
function randomItem<T>(items: readonly T[], random?: () => number): T | undefined;
```

**Description** : choisit un élément au hasard dans une liste (livre du jour, gagnant d'un concours). La liste n'est pas modifiée. Non adapté à un usage sensible.

**Paramètres**

- `items` : liste dans laquelle choisir (type générique `T`).
- `random` : générateur de nombres dans `[0, 1)` (défaut `Math.random`).

**Retour** : un élément de la liste, ou `undefined` si elle est vide.

**Erreurs** : aucune.

**Exemple**

```ts
import { randomItem } from "@etiennea20/adr-misc";

randomItem(["Germinal", "Nana", "L'Assommoir"]); // l'un des trois titres
randomItem([]); // undefined
```

### `randomString`

| Champ          | Valeur                                           |
| -------------- | ------------------------------------------------ |
| Catégorie      | `random`                                         |
| Point d'entrée | `@etiennea20/adr-misc`                           |
| Statut         | stable                                           |
| Depuis         | 0.2.0                                            |
| Source         | `src/random/random-string/random-string.ts`      |
| Tests          | `src/random/random-string/random-string.test.ts` |

**Signature**

```ts
function randomString(length: number, options?: IRandomStringOptions): string;
```

**Description** : génère une chaîne aléatoire d'une longueur donnée, à partir d'un alphabet configurable (code de retrait d'une réservation, suffixe de nom de fichier, données de démonstration). **Non adapté** à un secret (mot de passe, jeton) : utiliser `createUuid` ou une API cryptographique.

**Paramètres**

- `length` : longueur de la chaîne (entier positif ou nul).
- `options` : alphabet et générateur (voir `IRandomStringOptions`).

**Retour** : une chaîne de `length` caractères tirés dans l'alphabet.

**Erreurs** : `RangeError` si `length` n'est pas un entier positif ou nul ; `Error` si l'alphabet est vide.

**Exemple**

```ts
import { randomString } from "@etiennea20/adr-misc";

randomString(8); // par exemple "aZ3kP0qL"
// Code de retrait sans caractères ambigus (0/O, 1/I)
randomString(6, { alphabet: "ABCDEFGHJKLMNPQRSTUVWXYZ23456789" }); // par exemple "K7PX2M"
```

### `sample`

| Champ          | Valeur                             |
| -------------- | ---------------------------------- |
| Catégorie      | `random`                           |
| Point d'entrée | `@etiennea20/adr-misc`             |
| Statut         | stable                             |
| Depuis         | 0.2.0                              |
| Source         | `src/random/sample/sample.ts`      |
| Tests          | `src/random/sample/sample.test.ts` |

**Signature**

```ts
function sample<T>(items: readonly T[], count: number, random?: () => number): T[];
```

**Description** : tire plusieurs éléments distincts au hasard (tirage **sans remise**, Fisher-Yates partiel) : trois livres mis en avant, jury tiré au sort. Si `count` dépasse la taille de la liste, tous les éléments sont renvoyés dans un ordre aléatoire. La liste n'est pas modifiée.

**Paramètres**

- `items` : liste dans laquelle tirer (type générique `T`).
- `count` : nombre d'éléments voulus (entier positif ou nul).
- `random` : générateur de nombres dans `[0, 1)` (défaut `Math.random`).

**Retour** : un nouveau tableau de `min(count, items.length)` éléments, dans l'ordre du tirage.

**Erreurs** : `RangeError` si `count` n'est pas un entier positif ou nul.

**Exemple**

```ts
import { sample } from "@etiennea20/adr-misc";

sample(["Germinal", "Nana", "L'Assommoir", "Au Bonheur des Dames"], 2);
// par exemple ["Nana", "Germinal"]
```

### `shuffle`

| Champ          | Valeur                               |
| -------------- | ------------------------------------ |
| Catégorie      | `random`                             |
| Point d'entrée | `@etiennea20/adr-misc`               |
| Statut         | stable                               |
| Depuis         | 0.2.0                                |
| Source         | `src/random/shuffle/shuffle.ts`      |
| Tests          | `src/random/shuffle/shuffle.test.ts` |

**Signature**

```ts
function shuffle<T>(items: readonly T[], random?: () => number): T[];
```

**Description** : mélange une liste (Fisher-Yates, toutes les permutations équiprobables) pour présenter des éléments dans un ordre aléatoire (questions d'un quiz, suggestions de lecture). La liste d'origine n'est **pas** modifiée. Ne pas utiliser `items.sort(() => Math.random() - 0.5)`, dont le mélange est biaisé.

**Paramètres**

- `items` : liste à mélanger (type générique `T`).
- `random` : générateur de nombres dans `[0, 1)` (défaut `Math.random`).

**Retour** : un nouveau tableau contenant les mêmes éléments dans un ordre aléatoire.

**Erreurs** : aucune.

**Exemple**

```ts
import { createSeededRandom, shuffle } from "@etiennea20/adr-misc";

shuffle([1, 2, 3, 4]); // par exemple [3, 1, 4, 2]
shuffle([1, 2, 3, 4], createSeededRandom(42)); // toujours le même ordre
```

## parsing

### `IParseCsvOptions`

| Champ          | Valeur                                    |
| -------------- | ----------------------------------------- |
| Catégorie      | `parsing`                                 |
| Point d'entrée | `@etiennea20/adr-misc`                    |
| Statut         | stable                                    |
| Depuis         | 0.2.0                                     |
| Source         | `src/parsing/parse-csv/parse-csv.ts`      |
| Tests          | `src/parsing/parse-csv/parse-csv.test.ts` |

**Signature**

```ts
interface IParseCsvOptions {
  readonly delimiter?: string;
  readonly headers?: boolean;
  readonly skipEmptyLines?: boolean;
}
```

**Description** : options de `parseCsv`. `delimiter` impose le séparateur (un seul caractère ; par défaut, détection sur la première ligne parmi `;`, `,`, tabulation et `|`, `;` en cas d'égalité). `headers: true` utilise la première ligne comme en-têtes et renvoie des objets (défaut `false`). `skipEmptyLines` ignore les lignes vides (défaut `true`).

**Exemple**

```ts
import { parseCsv, type IParseCsvOptions } from "@etiennea20/adr-misc";

const options: IParseCsvOptions = { delimiter: ",", headers: true };
parseCsv("titre,auteur\nGerminal,Zola", options); // [{ titre: "Germinal", auteur: "Zola" }]
```

### `IParseNumberOptions`

| Champ          | Valeur                                          |
| -------------- | ----------------------------------------------- |
| Catégorie      | `parsing`                                       |
| Point d'entrée | `@etiennea20/adr-misc`                          |
| Statut         | stable                                          |
| Depuis         | 0.2.0                                           |
| Source         | `src/parsing/parse-number/parse-number.ts`      |
| Tests          | `src/parsing/parse-number/parse-number.test.ts` |

**Signature**

```ts
interface IParseNumberOptions {
  readonly decimalSeparator?: "," | ".";
}
```

**Description** : options de `parseNumber` et `parseInteger`. `decimalSeparator` impose le séparateur décimal ; sans lui, il est déduit de la saisie (si `,` et `.` sont présents, le dernier est décimal ; un séparateur présent une seule fois est décimal ; présent plusieurs fois, c'est un séparateur de milliers). À fournir pour lever l'ambiguïté de « 1,234 » ou « 1.234 ».

**Exemple**

```ts
import { parseNumber, type IParseNumberOptions } from "@etiennea20/adr-misc";

const options: IParseNumberOptions = { decimalSeparator: "." };
parseNumber("1,234", options); // 1234
```

### `IToCsvOptions`

| Champ          | Valeur                              |
| -------------- | ----------------------------------- |
| Catégorie      | `parsing`                           |
| Point d'entrée | `@etiennea20/adr-misc`              |
| Statut         | stable                              |
| Depuis         | 0.2.0                               |
| Source         | `src/parsing/to-csv/to-csv.ts`      |
| Tests          | `src/parsing/to-csv/to-csv.test.ts` |

**Signature**

```ts
interface IToCsvOptions {
  readonly delimiter?: string;
  readonly columns?: readonly string[];
  readonly includeHeader?: boolean;
  readonly bom?: boolean;
  readonly lineSeparator?: "\r\n" | "\n";
  readonly decimalSeparator?: "," | ".";
  readonly escapeFormulas?: boolean;
}
```

**Description** : options de `toCsv`. `delimiter` (défaut `";"`, un seul caractère) ; `columns` choisit et ordonne les clés des lignes objets (défaut : toutes les clés dans l'ordre d'apparition) ou donne la ligne d'en-têtes des lignes tableaux (défaut : aucune) ; `includeHeader` (défaut `true`) ; `bom` ajoute le BOM UTF-8 pour qu'Excel affiche les accents (défaut `false`) ; `lineSeparator` (défaut `"\r\n"`) ; `decimalSeparator` des nombres (défaut `","`) ; `escapeFormulas` préfixe d'une apostrophe les textes commençant par `=`, `+`, `-`, `@`, tabulation ou retour chariot, contre l'injection de formules (défaut `false`, à activer pour des données saisies par des utilisateurs).

**Exemple**

```ts
import { toCsv, type IToCsvOptions } from "@etiennea20/adr-misc";

const options: IToCsvOptions = {
  delimiter: ",",
  decimalSeparator: ".",
  bom: false,
};
toCsv([{ titre: "Germinal", prix: 8.5 }], options); // "titre,prix\r\nGerminal,8.5"
```

### `parseBoolean`

| Champ          | Valeur                                            |
| -------------- | ------------------------------------------------- |
| Catégorie      | `parsing`                                         |
| Point d'entrée | `@etiennea20/adr-misc`                            |
| Statut         | stable                                            |
| Depuis         | 0.2.0                                             |
| Source         | `src/parsing/parse-boolean/parse-boolean.ts`      |
| Tests          | `src/parsing/parse-boolean/parse-boolean.test.ts` |

**Signature**

```ts
function parseBoolean(value: string | number | boolean | null | undefined): boolean | undefined;
```

**Description** : convertit une saisie en booléen. À utiliser pour une colonne « Oui/Non » d'un CSV, un paramètre de requête ou une variable de configuration. Reconnaît, sans tenir compte de la casse ni des espaces autour : `true`/`false`, `vrai`/`faux`, `oui`/`non`, `yes`/`no`, `o`/`n`, `y`/`n`, `1`/`0`, `on`/`off`. Une saisie non reconnue renvoie `undefined` (valeur par défaut : `parseBoolean(saisie) ?? false`).

**Paramètres**

- `value` : saisie à convertir. Un booléen est renvoyé tel quel ; les nombres `1` et `0` sont acceptés.

**Retour** : le booléen, ou `undefined` si la saisie n'est pas reconnue.

**Erreurs** : aucune.

**Exemple**

```ts
import { parseBoolean } from "@etiennea20/adr-misc";

parseBoolean("Oui"); // true
parseBoolean(" off "); // false
parseBoolean(1); // true
parseBoolean("peut-être"); // undefined
```

### `parseCsv`

| Champ          | Valeur                                    |
| -------------- | ----------------------------------------- |
| Catégorie      | `parsing`                                 |
| Point d'entrée | `@etiennea20/adr-misc`                    |
| Statut         | stable                                    |
| Depuis         | 0.2.0                                     |
| Source         | `src/parsing/parse-csv/parse-csv.ts`      |
| Tests          | `src/parsing/parse-csv/parse-csv.test.ts` |

**Signature**

```ts
function parseCsv(
  text: string,
  options: IParseCsvOptions & { readonly headers: true },
): Record<string, string>[];
function parseCsv(
  text: string,
  options?: IParseCsvOptions & { readonly headers?: false },
): string[][];
```

**Description** : analyse un contenu CSV (RFC 4180) : champs entre guillemets, guillemets doublés (`""`), séparateurs et retours à la ligne dans les champs, fins de ligne `\r\n`, `\n` ou `\r`, BOM UTF-8 retiré. Le séparateur est détecté automatiquement (`;` pour les exports Excel français) ou imposé. À utiliser pour importer un fichier CSV ou un export Excel (adhérents, catalogue). Les valeurs restent des chaînes : les convertir avec `parseNumber`, `parseDate` ou `parseBoolean`. Un fichier mal formé (guillemet non fermé) est lu au mieux, sans erreur. Inverse de `toCsv`.

**Paramètres**

- `text` : contenu CSV.
- `options` : voir `IParseCsvOptions` ; avec `headers: true`, renvoie des objets.

**Retour** : la liste des lignes (chacune étant la liste de ses champs, lignes vides ignorées par défaut), ou, avec `headers: true`, un objet par ligne de données indexé par les en-têtes (champ manquant : `""`, champ en trop ignoré).

**Erreurs** : `RangeError` si `options.delimiter` n'est pas un caractère unique, ou s'il s'agit du guillemet ou d'un retour à la ligne.

**Exemple**

```ts
import { parseCsv } from "@etiennea20/adr-misc";

parseCsv("titre;auteur\nGerminal;Zola"); // [["titre", "auteur"], ["Germinal", "Zola"]]
parseCsv('titre;auteur\n"Germinal";"Zola, Émile"', { headers: true });
// [{ titre: "Germinal", auteur: "Zola, Émile" }]
```

### `parseDate`

| Champ          | Valeur                                      |
| -------------- | ------------------------------------------- |
| Catégorie      | `parsing`                                   |
| Point d'entrée | `@etiennea20/adr-misc`                      |
| Statut         | stable                                      |
| Depuis         | 0.2.0                                       |
| Source         | `src/parsing/parse-date/parse-date.ts`      |
| Tests          | `src/parsing/parse-date/parse-date.test.ts` |

**Signature**

```ts
function parseDate(value: ConfigType, formats?: readonly string[]): Dayjs | undefined;
```

**Description** : convertit une saisie en date dayjs. Une chaîne est d'abord lue en ISO 8601 strict (`2026-01-15`, `2026-01-15T10:30:00Z`…), puis avec chacun des `formats` en mode strict, dans l'ordre. Une date impossible (« 31/02/2026 ») est refusée au lieu d'être reportée au mois suivant. À utiliser pour une date saisie par un utilisateur, importée d'un CSV ou reçue d'une API. Les dates sans décalage sont lues dans le fuseau local. Active le plugin dayjs `customParseFormat` (idempotent) sur l'instance dayjs du projet.

**Paramètres**

- `value` : chaîne, `Date`, horodatage en millisecondes ou objet dayjs. `null`, `undefined` et la chaîne vide donnent `undefined` (et non l'instant présent, contrairement à `dayjs()`).
- `formats` : formats dayjs essayés après l'ISO 8601. Par défaut : `["DD/MM/YYYY", "DD/MM/YYYY HH:mm", "D/M/YYYY"]`.

**Retour** : la date dayjs, ou `undefined` si la saisie est vide ou invalide.

**Erreurs** : aucune.

**Exemple**

```ts
import { parseDate } from "@etiennea20/adr-misc";

parseDate("15/01/2026")?.format("YYYY-MM-DD"); // "2026-01-15"
parseDate("2026-01-15T10:30:00Z")?.toISOString(); // "2026-01-15T10:30:00.000Z"
parseDate("31/02/2026"); // undefined
parseDate("01-15-2026", ["MM-DD-YYYY"])?.date(); // 15
```

### `parseDuration`

| Champ          | Valeur                                              |
| -------------- | --------------------------------------------------- |
| Catégorie      | `parsing`                                           |
| Point d'entrée | `@etiennea20/adr-misc`                              |
| Statut         | stable                                              |
| Depuis         | 0.2.0                                               |
| Source         | `src/parsing/parse-duration/parse-duration.ts`      |
| Tests          | `src/parsing/parse-duration/parse-duration.test.ts` |

**Signature**

```ts
function parseDuration(text: string | null | undefined): number | undefined;
```

**Description** : convertit une durée saisie en texte en millisecondes, sans tenir compte de la casse. Formats : unités françaises ou anglaises (« 45s », « 90min », « 1h30 », « 1 h 30 min », « 2j 3h », « 1,5 h », « 1 heure et 30 minutes », « 2 semaines » ; un nombre final sans unité après `h` ou `min` vaut des minutes ou des secondes), horloge (« 1:30 », « 1:30:00 ») et ISO 8601 (« PT1H30M », « P2DT3H », « P1W », sans années ni mois). À utiliser pour une durée d'emprunt, un temps passé ou un délai saisi librement. Un nombre seul (« 90 ») est refusé (unité ambiguë) ; les durées négatives aussi.

**Paramètres**

- `text` : durée à convertir.

**Retour** : la durée en millisecondes (arrondie à l'entier), ou `undefined` si la saisie est vide ou invalide.

**Erreurs** : aucune.

**Exemple**

```ts
import { parseDuration } from "@etiennea20/adr-misc";

parseDuration("1h30"); // 5_400_000
parseDuration("2j 3h"); // 183_600_000
parseDuration("PT1H30M"); // 5_400_000
parseDuration("1:30:00"); // 5_400_000
parseDuration("90"); // undefined
```

### `parseInteger`

| Champ          | Valeur                                            |
| -------------- | ------------------------------------------------- |
| Catégorie      | `parsing`                                         |
| Point d'entrée | `@etiennea20/adr-misc`                            |
| Statut         | stable                                            |
| Depuis         | 0.2.0                                             |
| Source         | `src/parsing/parse-integer/parse-integer.ts`      |
| Tests          | `src/parsing/parse-integer/parse-integer.test.ts` |

**Signature**

```ts
function parseInteger(
  value: string | number | null | undefined,
  options?: IParseNumberOptions,
): number | undefined;
```

**Description** : convertit une saisie en nombre entier, avec les mêmes formats que `parseNumber` (« 1 234 », « 1.234.567 », « 12,0 »). Une saisie décimale (« 12,5 ») est refusée, pas arrondie. À utiliser pour une quantité, un nombre d'exemplaires ou un identifiant numérique saisi par un utilisateur.

**Paramètres**

- `value` : saisie à convertir. Un `number` entier est renvoyé tel quel.
- `options` : séparateur décimal imposé (voir `IParseNumberOptions`).

**Retour** : l'entier, ou `undefined` si la saisie est invalide, décimale ou hors des entiers sûrs (`Number.MAX_SAFE_INTEGER`).

**Erreurs** : aucune.

**Exemple**

```ts
import { parseInteger } from "@etiennea20/adr-misc";

parseInteger("1 234"); // 1234
parseInteger("12,5"); // undefined
parseInteger("1.234.567"); // 1234567
```

### `parseNumber`

| Champ          | Valeur                                          |
| -------------- | ----------------------------------------------- |
| Catégorie      | `parsing`                                       |
| Point d'entrée | `@etiennea20/adr-misc`                          |
| Statut         | stable                                          |
| Depuis         | 0.2.0                                           |
| Source         | `src/parsing/parse-number/parse-number.ts`      |
| Tests          | `src/parsing/parse-number/parse-number.test.ts` |

**Signature**

```ts
function parseNumber(
  value: string | number | null | undefined,
  options?: IParseNumberOptions,
): number | undefined;
```

**Description** : convertit une saisie en nombre, en acceptant les formats français et anglais : « 1 234,56 », « 1234.56 », « 1.234,56 », « 1,234.56 », espaces insécables (sortie de `Intl.NumberFormat`), signe (`+`, `-` ou moins typographique U+2212) et `%` final (renvoyé sous forme de ratio : « 12,5 % » donne `0.125`). Les regroupements de milliers mal placés (« 12.34.5 ») sont refusés. À utiliser pour un nombre saisi par un utilisateur ou importé d'un fichier (CSV, Excel, copier-coller). Ambiguïté : « 1,234 » ou « 1.234 » est lu comme décimal (`1.234`) ; imposer `decimalSeparator` pour la lever.

**Paramètres**

- `value` : saisie à convertir. Un `number` fini est renvoyé tel quel.
- `options` : séparateur décimal imposé (voir `IParseNumberOptions`).

**Retour** : le nombre, ou `undefined` si la saisie est vide, invalide ou non finie.

**Erreurs** : aucune.

**Exemple**

```ts
import { parseNumber } from "@etiennea20/adr-misc";

parseNumber("1 234,56"); // 1234.56
parseNumber("1,234.56"); // 1234.56
parseNumber("-12,5 %"); // -0.125
parseNumber("abc"); // undefined
parseNumber("1,234", { decimalSeparator: "." }); // 1234
```

### `safeJsonParse`

| Champ          | Valeur                                                |
| -------------- | ----------------------------------------------------- |
| Catégorie      | `parsing`                                             |
| Point d'entrée | `@etiennea20/adr-misc`                                |
| Statut         | stable                                                |
| Depuis         | 0.2.0                                                 |
| Source         | `src/parsing/safe-json-parse/safe-json-parse.ts`      |
| Tests          | `src/parsing/safe-json-parse/safe-json-parse.test.ts` |

**Signature**

```ts
function safeJsonParse<T>(text: string | null | undefined, fallback?: T): T | undefined;
```

**Description** : analyse une chaîne JSON sans lever d'erreur. À utiliser pour relire une valeur au contenu non garanti : stockage local, paramètre d'URL, champ texte en base, message d'un tiers. La valeur de repli est un paramètre (et non `?? valeur`) car `null` est un JSON valide. Le type `T` n'est **pas** vérifié à l'exécution : valider la structure (garde de type, schéma) avant de s'y fier.

**Paramètres**

- `text` : chaîne JSON à analyser ; `null` et `undefined` sont traités comme invalides.
- `fallback` : valeur renvoyée si `text` est absent ou invalide (type `T` déduit de cette valeur).

**Retour** : la valeur analysée, ou `fallback` (`undefined` par défaut).

**Erreurs** : aucune.

**Exemple**

```ts
import { safeJsonParse } from "@etiennea20/adr-misc";

safeJsonParse<{ id: number }>('{"id": 1}'); // { id: 1 }
safeJsonParse("{invalide"); // undefined
safeJsonParse("{invalide", { theme: "clair" }); // { theme: "clair" }
safeJsonParse("null", []); // null
```

### `toCsv`

| Champ          | Valeur                              |
| -------------- | ----------------------------------- |
| Catégorie      | `parsing`                           |
| Point d'entrée | `@etiennea20/adr-misc`              |
| Statut         | stable                              |
| Depuis         | 0.2.0                               |
| Source         | `src/parsing/to-csv/to-csv.ts`      |
| Tests          | `src/parsing/to-csv/to-csv.test.ts` |

**Signature**

```ts
function toCsv(
  rows: readonly (readonly unknown[] | Readonly<Record<string, unknown>>)[],
  options?: IToCsvOptions,
): string;
```

**Description** : convertit des lignes (tableaux de valeurs ou objets) en contenu CSV (RFC 4180), l'inverse de `parseCsv`. Les cellules contenant le séparateur, un guillemet ou un retour à la ligne sont mises entre guillemets. Valeurs par défaut pour Excel en français : `;`, virgule décimale, `\r\n`. Conversion : `null`, `undefined`, `NaN` et dates invalides donnent une cellule vide, une `Date` son ISO 8601, un objet son JSON (formater les dates en français avant l'appel si besoin). Le résultat ne se termine pas par une fin de ligne. À utiliser pour exporter des données vers un tableur (emprunts en retard, catalogue).

**Paramètres**

- `rows` : lignes à écrire.
- `options` : voir `IToCsvOptions`.

**Retour** : le contenu CSV.

**Erreurs** : `RangeError` si `options.delimiter` n'est pas un caractère unique, ou s'il s'agit du guillemet ou d'un retour à la ligne.

**Exemple**

```ts
import { toCsv } from "@etiennea20/adr-misc";

toCsv([
  { titre: "Germinal", auteur: "Zola, Émile", prix: 8.5 },
  { titre: 'Le "Horla"', auteur: "Maupassant", prix: 4 },
]);
// 'titre;auteur;prix\r\nGerminal;Zola, Émile;8,5\r\n"Le ""Horla""";Maupassant;4'

toCsv([["a", 1]], { columns: ["lettre", "nombre"], delimiter: ",", bom: true });
// "﻿lettre,nombre\r\na,1"
```

## format

### `IFormatBytesOptions`

| Champ          | Valeur                                         |
| -------------- | ---------------------------------------------- |
| Catégorie      | `format`                                       |
| Point d'entrée | `@etiennea20/adr-misc`                         |
| Statut         | stable                                         |
| Depuis         | 0.2.0                                          |
| Source         | `src/format/format-bytes/format-bytes.ts`      |
| Tests          | `src/format/format-bytes/format-bytes.test.ts` |

**Signature**

```ts
interface IFormatBytesOptions {
  readonly decimals?: number;
  readonly binary?: boolean;
  readonly locale?: string;
}
```

**Description** : options de `formatBytes`. `decimals` : nombre maximal de décimales (défaut `1`) ; `binary` : unités binaires en base 1024 (Kio, Mio…) au lieu des unités décimales en base 1000 (ko, Mo…) (défaut `false`) ; `locale` du nombre (défaut `"fr-FR"`, les unités restent en français).

**Exemple**

```ts
import { formatBytes, type IFormatBytesOptions } from "@etiennea20/adr-misc";

const options: IFormatBytesOptions = { binary: true, decimals: 2 };
formatBytes(1536, options); // "1,5 Kio"
```

### `IFormatCurrencyOptions`

| Champ          | Valeur                                               |
| -------------- | ---------------------------------------------------- |
| Catégorie      | `format`                                             |
| Point d'entrée | `@etiennea20/adr-misc`                               |
| Statut         | stable                                               |
| Depuis         | 0.2.0                                                |
| Source         | `src/format/format-currency/format-currency.ts`      |
| Tests          | `src/format/format-currency/format-currency.test.ts` |

**Signature**

```ts
interface IFormatCurrencyOptions {
  readonly currency?: string;
  readonly locale?: string;
  readonly fractionDigits?: number;
}
```

**Description** : options de `formatCurrency`. `currency` : code ISO 4217 (défaut `"EUR"`) ; `locale` (défaut `"fr-FR"`) ; `fractionDigits` : nombre exact de décimales (défaut : celui de la devise, 2 pour l'euro).

**Exemple**

```ts
import { formatCurrency, type IFormatCurrencyOptions } from "@etiennea20/adr-misc";

const options: IFormatCurrencyOptions = { currency: "USD", fractionDigits: 0 };
formatCurrency(1234.5, options); // "1 235 $US"
```

### `IFormatDateOptions`

| Champ          | Valeur                                       |
| -------------- | -------------------------------------------- |
| Catégorie      | `format`                                     |
| Point d'entrée | `@etiennea20/adr-misc`                       |
| Statut         | stable                                       |
| Depuis         | 0.2.0                                        |
| Source         | `src/format/format-date/format-date.ts`      |
| Tests          | `src/format/format-date/format-date.test.ts` |

**Signature**

```ts
interface IFormatDateOptions {
  readonly format?: string;
  readonly locale?: string;
}
```

**Description** : options de `formatDate` et `formatDateTime`. `format` : un format dayjs (`DD/MM/YYYY`, `YYYY-MM-DD`, `HH:mm`…) ou un style `Intl` traduit selon `locale` : `short` (« 15/01/2026 »), `medium` (« 15 janv. 2026 »), `long` (« 15 janvier 2026 »), `full` (« jeudi 15 janvier 2026 ») ; défaut `"DD/MM/YYYY"` pour `formatDate`, `"DD/MM/YYYY HH:mm"` pour `formatDateTime`. `locale` (défaut `"fr-FR"`) ne s'applique qu'aux styles ; un format dayjs suit la locale dayjs globale.

**Exemple**

```ts
import { formatDate, type IFormatDateOptions } from "@etiennea20/adr-misc";

const options: IFormatDateOptions = { format: "long" };
formatDate(new Date(2026, 0, 15), options); // "15 janvier 2026"
```

### `IFormatDurationOptions`

| Champ          | Valeur                                               |
| -------------- | ---------------------------------------------------- |
| Catégorie      | `format`                                             |
| Point d'entrée | `@etiennea20/adr-misc`                               |
| Statut         | stable                                               |
| Depuis         | 0.2.0                                                |
| Source         | `src/format/format-duration/format-duration.ts`      |
| Tests          | `src/format/format-duration/format-duration.test.ts` |

**Signature**

```ts
interface IFormatDurationOptions {
  readonly style?: "short" | "long" | "clock";
  readonly maxUnits?: number;
}
```

**Description** : options de `formatDuration`. `style` : `short` (« 1 j 2 h 30 min », défaut), `long` (« 1 jour, 2 heures et 30 minutes ») ou `clock` (« 26:30:00 », jours convertis en heures). `maxUnits` : nombre maximal d'unités affichées en partant de la plus grande (styles `short` et `long`), les suivantes étant tronquées ; défaut : toutes les unités non nulles.

**Exemple**

```ts
import { formatDuration, type IFormatDurationOptions } from "@etiennea20/adr-misc";

const options: IFormatDurationOptions = { style: "long", maxUnits: 2 };
formatDuration(93_784_000, options); // "1 jour et 2 heures"
```

### `IFormatFullNameOptions`

| Champ          | Valeur                                                 |
| -------------- | ------------------------------------------------------ |
| Catégorie      | `format`                                               |
| Point d'entrée | `@etiennea20/adr-misc`                                 |
| Statut         | stable                                                 |
| Depuis         | 0.2.0                                                  |
| Source         | `src/format/format-full-name/format-full-name.ts`      |
| Tests          | `src/format/format-full-name/format-full-name.test.ts` |

**Signature**

```ts
interface IFormatFullNameOptions {
  readonly order?: "firstLast" | "lastFirst";
  readonly uppercaseLastName?: boolean;
}
```

**Description** : options de `formatFullName`. `order` : `firstLast` (« Marie DUPONT », défaut) ou `lastFirst` (« DUPONT Marie », pour une liste triée par nom). `uppercaseLastName` : nom de famille en majuscules (défaut `true`) ; sinon, il est conservé tel quel (espaces normalisés), sa casse ne se devinant pas (« de La Fontaine »).

**Exemple**

```ts
import { formatFullName, type IFormatFullNameOptions } from "@etiennea20/adr-misc";

const options: IFormatFullNameOptions = { order: "lastFirst" };
formatFullName({ firstName: "Marie", lastName: "Dupont" }, options); // "DUPONT Marie"
```

### `IFormatIbanOptions`

| Champ          | Valeur                                       |
| -------------- | -------------------------------------------- |
| Catégorie      | `format`                                     |
| Point d'entrée | `@etiennea20/adr-misc`                       |
| Statut         | stable                                       |
| Depuis         | 0.2.0                                        |
| Source         | `src/format/format-iban/format-iban.ts`      |
| Tests          | `src/format/format-iban/format-iban.test.ts` |

**Signature**

```ts
interface IFormatIbanOptions {
  readonly masked?: boolean;
}
```

**Description** : options de `formatIban`. `masked` remplace par des astérisques tous les caractères sauf les 4 premiers (pays et clé) et les 4 derniers, pour afficher un IBAN sans l'exposer (défaut `false`).

**Exemple**

```ts
import { formatIban, type IFormatIbanOptions } from "@etiennea20/adr-misc";

const options: IFormatIbanOptions = { masked: true };
formatIban("FR7630006000011234567890189", options); // "FR76 **** **** **** **** ***0 189"
```

### `IFormatListOptions`

| Champ          | Valeur                                       |
| -------------- | -------------------------------------------- |
| Catégorie      | `format`                                     |
| Point d'entrée | `@etiennea20/adr-misc`                       |
| Statut         | stable                                       |
| Depuis         | 0.2.0                                        |
| Source         | `src/format/format-list/format-list.ts`      |
| Tests          | `src/format/format-list/format-list.test.ts` |

**Signature**

```ts
interface IFormatListOptions {
  readonly type?: "conjunction" | "disjunction" | "unit";
  readonly style?: "long" | "short" | "narrow";
  readonly locale?: string;
}
```

**Description** : options de `formatList`. `type` : `conjunction` (« et », défaut), `disjunction` (« ou ») ou `unit` (simple énumération de mesures) ; `style` de la liaison (défaut `"long"`) ; `locale` (défaut `"fr-FR"`).

**Exemple**

```ts
import { formatList, type IFormatListOptions } from "@etiennea20/adr-misc";

const options: IFormatListOptions = { type: "disjunction" };
formatList(["broché", "poche"], options); // "broché ou poche"
```

### `IFormatNumberOptions`

| Champ          | Valeur                                           |
| -------------- | ------------------------------------------------ |
| Catégorie      | `format`                                         |
| Point d'entrée | `@etiennea20/adr-misc`                           |
| Statut         | stable                                           |
| Depuis         | 0.2.0                                            |
| Source         | `src/format/format-number/format-number.ts`      |
| Tests          | `src/format/format-number/format-number.test.ts` |

**Signature**

```ts
interface IFormatNumberOptions {
  readonly locale?: string;
  readonly minimumFractionDigits?: number;
  readonly maximumFractionDigits?: number;
  readonly signDisplay?: "auto" | "always" | "exceptZero" | "never";
}
```

**Description** : options de `formatNumber`. `locale` (défaut `"fr-FR"`) ; `minimumFractionDigits` (défaut `0`) ; `maximumFractionDigits` (défaut `3`, ou le minimum s'il est plus grand) ; `signDisplay` (défaut `"auto"` ; `exceptZero` pour une variation : « +3 », « -2 », « 0 »).

**Exemple**

```ts
import { formatNumber, type IFormatNumberOptions } from "@etiennea20/adr-misc";

const options: IFormatNumberOptions = {
  maximumFractionDigits: 1,
  signDisplay: "exceptZero",
};
formatNumber(2.345, options); // "+2,3"
```

### `IFormatOrdinalOptions`

| Champ          | Valeur                                             |
| -------------- | -------------------------------------------------- |
| Catégorie      | `format`                                           |
| Point d'entrée | `@etiennea20/adr-misc`                             |
| Statut         | stable                                             |
| Depuis         | 0.2.0                                              |
| Source         | `src/format/format-ordinal/format-ordinal.ts`      |
| Tests          | `src/format/format-ordinal/format-ordinal.test.ts` |

**Signature**

```ts
interface IFormatOrdinalOptions {
  readonly gender?: "masculine" | "feminine";
}
```

**Description** : options de `formatOrdinal`. `gender` : genre du nom qualifié, qui ne change que « 1er » (`masculine`, défaut) / « 1re » (`feminine`).

**Exemple**

```ts
import { formatOrdinal, type IFormatOrdinalOptions } from "@etiennea20/adr-misc";

const options: IFormatOrdinalOptions = { gender: "feminine" };
formatOrdinal(1, options); // "1re"
```

### `IFormatPercentOptions`

| Champ          | Valeur                                             |
| -------------- | -------------------------------------------------- |
| Catégorie      | `format`                                           |
| Point d'entrée | `@etiennea20/adr-misc`                             |
| Statut         | stable                                             |
| Depuis         | 0.2.0                                              |
| Source         | `src/format/format-percent/format-percent.ts`      |
| Tests          | `src/format/format-percent/format-percent.test.ts` |

**Signature**

```ts
interface IFormatPercentOptions {
  readonly locale?: string;
  readonly minimumFractionDigits?: number;
  readonly maximumFractionDigits?: number;
}
```

**Description** : options de `formatPercent`. `locale` (défaut `"fr-FR"`) ; `minimumFractionDigits` (défaut `0`) ; `maximumFractionDigits` (défaut `1`, ou le minimum s'il est plus grand).

**Exemple**

```ts
import { formatPercent, type IFormatPercentOptions } from "@etiennea20/adr-misc";

const options: IFormatPercentOptions = { minimumFractionDigits: 2 };
formatPercent(0.5, options); // "50,00 %"
```

### `IFormatPhoneNumberOptions`

| Champ          | Valeur                                                       |
| -------------- | ------------------------------------------------------------ |
| Catégorie      | `format`                                                     |
| Point d'entrée | `@etiennea20/adr-misc`                                       |
| Statut         | stable                                                       |
| Depuis         | 0.2.0                                                        |
| Source         | `src/format/format-phone-number/format-phone-number.ts`      |
| Tests          | `src/format/format-phone-number/format-phone-number.test.ts` |

**Signature**

```ts
interface IFormatPhoneNumberOptions {
  readonly international?: boolean;
}
```

**Description** : options de `formatPhoneNumber`. `international` : `true` impose « +33 6 12 34 56 78 », `false` impose « 06 12 34 56 78 » ; par défaut, la forme de la saisie est conservée.

**Exemple**

```ts
import { formatPhoneNumber, type IFormatPhoneNumberOptions } from "@etiennea20/adr-misc";

const options: IFormatPhoneNumberOptions = { international: true };
formatPhoneNumber("06 12 34 56 78", options); // "+33 6 12 34 56 78"
```

### `IFormatRelativeTimeOptions`

| Champ          | Valeur                                                         |
| -------------- | -------------------------------------------------------------- |
| Catégorie      | `format`                                                       |
| Point d'entrée | `@etiennea20/adr-misc`                                         |
| Statut         | stable                                                         |
| Depuis         | 0.2.0                                                          |
| Source         | `src/format/format-relative-time/format-relative-time.ts`      |
| Tests          | `src/format/format-relative-time/format-relative-time.test.ts` |

**Signature**

```ts
interface IFormatRelativeTimeOptions {
  readonly now?: ConfigType;
  readonly locale?: string;
  readonly numeric?: "auto" | "always";
}
```

**Description** : options de `formatRelativeTime`. `now` : instant de référence (défaut : l'instant présent ; à fournir pour un résultat reproductible) ; `locale` (défaut `"fr-FR"`) ; `numeric` : `auto` utilise « hier », « demain », « maintenant » (défaut), `always` toujours un nombre (« il y a 1 jour »).

**Exemple**

```ts
import { formatRelativeTime, type IFormatRelativeTimeOptions } from "@etiennea20/adr-misc";

const options: IFormatRelativeTimeOptions = {
  now: new Date(2026, 0, 15),
  numeric: "always",
};
formatRelativeTime(new Date(2026, 0, 14), options); // "il y a 1 jour"
```

### `IPersonName`

| Champ          | Valeur                                                 |
| -------------- | ------------------------------------------------------ |
| Catégorie      | `format`                                               |
| Point d'entrée | `@etiennea20/adr-misc`                                 |
| Statut         | stable                                                 |
| Depuis         | 0.2.0                                                  |
| Source         | `src/format/format-full-name/format-full-name.ts`      |
| Tests          | `src/format/format-full-name/format-full-name.test.ts` |

**Signature**

```ts
interface IPersonName {
  readonly firstName?: string | null;
  readonly lastName?: string | null;
}
```

**Description** : prénom et nom d'une personne tels que stockés (casse et espaces quelconques), lus par `formatFullName`. Les deux sont facultatifs.

**Exemple**

```ts
import { formatFullName, type IPersonName } from "@etiennea20/adr-misc";

const member: IPersonName = { firstName: "marie", lastName: "Dupont" };
formatFullName(member); // "Marie DUPONT"
```

### `formatBytes`

| Champ          | Valeur                                         |
| -------------- | ---------------------------------------------- |
| Catégorie      | `format`                                       |
| Point d'entrée | `@etiennea20/adr-misc`                         |
| Statut         | stable                                         |
| Depuis         | 0.2.0                                          |
| Source         | `src/format/format-bytes/format-bytes.ts`      |
| Tests          | `src/format/format-bytes/format-bytes.test.ts` |

**Signature**

```ts
function formatBytes(bytes: number | null | undefined, options?: IFormatBytesOptions): string;
```

**Description** : formate une taille en octets avec l'unité adaptée, au format français (« 1,5 Mo »). Unités françaises (`o`, `ko`, `Mo`, `Go`, `To`, `Po`, ou `Kio`, `Mio`… en binaire), séparées du nombre par une espace insécable U+00A0. Passe à l'unité supérieure quand l'arrondi atteint la base (« 999 999 o » donne « 1 Mo »). À utiliser pour la taille d'un fichier joint ou d'un quota.

**Paramètres**

- `bytes` : taille en octets ; une valeur négative garde son signe.
- `options` : voir `IFormatBytesOptions`.

**Retour** : la taille formatée, ou `""` si `bytes` est `null`, `undefined`, `NaN` ou infini.

**Erreurs** : `RangeError` si `decimals` est hors de l'intervalle 0 à 100 ou si la locale est invalide.

**Exemple**

```ts
import { formatBytes } from "@etiennea20/adr-misc";

formatBytes(512); // "512 o"
formatBytes(1_500_000); // "1,5 Mo"
formatBytes(1536, { binary: true }); // "1,5 Kio"
```

### `formatCurrency`

| Champ          | Valeur                                               |
| -------------- | ---------------------------------------------------- |
| Catégorie      | `format`                                             |
| Point d'entrée | `@etiennea20/adr-misc`                               |
| Statut         | stable                                               |
| Depuis         | 0.2.0                                                |
| Source         | `src/format/format-currency/format-currency.ts`      |
| Tests          | `src/format/format-currency/format-currency.test.ts` |

**Signature**

```ts
function formatCurrency(value: number | null | undefined, options?: IFormatCurrencyOptions): string;
```

**Description** : formate un montant avec sa devise, en euros et au format français par défaut (« 1 234,50 € »). À utiliser pour un prix, une pénalité de retard, un total. Le résultat contient des espaces insécables (U+202F entre les milliers, U+00A0 avant le symbole) : en tenir compte dans les comparaisons.

**Paramètres**

- `value` : montant dans l'unité de la devise (euros, pas centimes).
- `options` : voir `IFormatCurrencyOptions`.

**Retour** : le montant formaté, ou `""` si `value` est `null`, `undefined`, `NaN` ou infini.

**Erreurs** : `RangeError` si le code de devise ou la locale est invalide, ou si `fractionDigits` est hors de l'intervalle 0 à 100.

**Exemple**

```ts
import { formatCurrency } from "@etiennea20/adr-misc";

formatCurrency(1234.5); // "1 234,50 €"
formatCurrency(-3, { fractionDigits: 0 }); // "-3 €"
formatCurrency(1234.5, { currency: "USD", locale: "en-US" }); // "$1,234.50"
```

### `formatDate`

| Champ          | Valeur                                       |
| -------------- | -------------------------------------------- |
| Catégorie      | `format`                                     |
| Point d'entrée | `@etiennea20/adr-misc`                       |
| Statut         | stable                                       |
| Depuis         | 0.2.0                                        |
| Source         | `src/format/format-date/format-date.ts`      |
| Tests          | `src/format/format-date/format-date.test.ts` |

**Signature**

```ts
function formatDate(value: ConfigType, options?: IFormatDateOptions): string;
```

**Description** : formate une date au format français (« 15/01/2026 » par défaut), avec un format dayjs ou un style `Intl` (`short`, `medium`, `long`, `full`). À utiliser pour une date d'emprunt, de retour ou de naissance. Pour les noms de mois et de jours en français, utiliser les styles `long` ou `full` : avec un format dayjs (`D MMMM YYYY`), ils suivent la locale dayjs globale (anglais tant que le projet n'a pas chargé `dayjs/locale/fr`). Une chaîne est lue par dayjs (ISO 8601) : lire d'abord une saisie française avec `parseDate`.

**Paramètres**

- `value` : `Date`, chaîne ISO 8601, horodatage en millisecondes ou objet dayjs ; `null` et `undefined` donnent `""` (et non la date du jour).
- `options` : voir `IFormatDateOptions`.

**Retour** : la date formatée, ou `""` si elle est absente ou invalide.

**Erreurs** : `RangeError` si la locale d'un style `Intl` est invalide.

**Exemple**

```ts
import { formatDate } from "@etiennea20/adr-misc";

formatDate(new Date(2026, 0, 15)); // "15/01/2026"
formatDate("2026-01-15", { format: "full" }); // "jeudi 15 janvier 2026"
formatDate(new Date(2026, 0, 15), { format: "YYYY-MM-DD" }); // "2026-01-15"
formatDate(null); // ""
```

### `formatDateTime`

| Champ          | Valeur                                                 |
| -------------- | ------------------------------------------------------ |
| Catégorie      | `format`                                               |
| Point d'entrée | `@etiennea20/adr-misc`                                 |
| Statut         | stable                                                 |
| Depuis         | 0.2.0                                                  |
| Source         | `src/format/format-date-time/format-date-time.ts`      |
| Tests          | `src/format/format-date-time/format-date-time.test.ts` |

**Signature**

```ts
function formatDateTime(value: ConfigType, options?: IFormatDateOptions): string;
```

**Description** : formate une date et son heure au format français (« 15/01/2026 10:30 » par défaut), dans le fuseau local. Avec un style `Intl`, l'heure est ajoutée au style `short` (« 15 janvier 2026 à 10:30 »). À utiliser pour l'horodatage d'une réservation, d'un retour ou d'une connexion.

**Paramètres**

- `value` : `Date`, chaîne ISO 8601, horodatage ou objet dayjs ; `null` et `undefined` donnent `""`.
- `options` : voir `IFormatDateOptions` (format par défaut : `"DD/MM/YYYY HH:mm"`).

**Retour** : la date et l'heure formatées, ou `""` si la date est absente ou invalide.

**Erreurs** : `RangeError` si la locale d'un style `Intl` est invalide.

**Exemple**

```ts
import { formatDateTime } from "@etiennea20/adr-misc";

formatDateTime(new Date(2026, 0, 15, 10, 30)); // "15/01/2026 10:30"
formatDateTime(new Date(2026, 0, 15, 10, 30), { format: "long" }); // "15 janvier 2026 à 10:30"
```

### `formatDuration`

| Champ          | Valeur                                               |
| -------------- | ---------------------------------------------------- |
| Catégorie      | `format`                                             |
| Point d'entrée | `@etiennea20/adr-misc`                               |
| Statut         | stable                                               |
| Depuis         | 0.2.0                                                |
| Source         | `src/format/format-duration/format-duration.ts`      |
| Tests          | `src/format/format-duration/format-duration.test.ts` |

**Signature**

```ts
function formatDuration(
  durationMs: number | null | undefined,
  options?: IFormatDurationOptions,
): string;
```

**Description** : formate une durée en millisecondes en texte français : « 1 h 30 min », « 2 jours et 3 heures » ou « 1:30:00 ». La durée est arrondie à la seconde (unités : jours, heures, minutes, secondes ; « 0 s » pour une durée nulle). Les styles `short` (défaut) et `clock` sont relus à l'identique par `parseDuration`. À utiliser pour une durée d'emprunt, un retard, un temps de lecture.

**Paramètres**

- `durationMs` : durée en millisecondes ; une durée négative est préfixée par `-`.
- `options` : voir `IFormatDurationOptions`.

**Retour** : la durée formatée, ou `""` si `durationMs` est `null`, `undefined`, `NaN` ou infini.

**Erreurs** : `RangeError` si `maxUnits` n'est pas un entier supérieur ou égal à 1.

**Exemple**

```ts
import { formatDuration } from "@etiennea20/adr-misc";

formatDuration(5_400_000); // "1 h 30 min"
formatDuration(183_600_000, { style: "long" }); // "2 jours et 3 heures"
formatDuration(5_400_000, { style: "clock" }); // "1:30:00"
formatDuration(93_784_000, { maxUnits: 2 }); // "1 j 2 h"
```

### `formatFullName`

| Champ          | Valeur                                                 |
| -------------- | ------------------------------------------------------ |
| Catégorie      | `format`                                               |
| Point d'entrée | `@etiennea20/adr-misc`                                 |
| Statut         | stable                                                 |
| Depuis         | 0.2.0                                                  |
| Source         | `src/format/format-full-name/format-full-name.ts`      |
| Tests          | `src/format/format-full-name/format-full-name.test.ts` |

**Signature**

```ts
function formatFullName(person: IPersonName, options?: IFormatFullNameOptions): string;
```

**Description** : formate le nom complet d'une personne à la française (« Marie DUPONT »), quelle que soit la casse de la saisie. Le prénom est capitalisé après chaque espace, tiret ou apostrophe (« jean-pierre » donne « Jean-Pierre »), les espaces sont normalisés, et un prénom ou un nom absent est omis. À utiliser pour afficher un adhérent, un auteur ou un bibliothécaire de façon homogène.

**Paramètres**

- `person` : prénom et nom (voir `IPersonName`).
- `options` : voir `IFormatFullNameOptions`.

**Retour** : le nom complet, ou `""` si ni le prénom ni le nom n'est renseigné.

**Erreurs** : aucune.

**Exemple**

```ts
import { formatFullName } from "@etiennea20/adr-misc";

formatFullName({ firstName: "jean-pierre", lastName: "Dupont" }); // "Jean-Pierre DUPONT"
formatFullName({ firstName: "Marie", lastName: "Curie" }, { order: "lastFirst" }); // "CURIE Marie"
formatFullName({ lastName: "de La Fontaine" }, { uppercaseLastName: false }); // "de La Fontaine"
```

### `formatIban`

| Champ          | Valeur                                       |
| -------------- | -------------------------------------------- |
| Catégorie      | `format`                                     |
| Point d'entrée | `@etiennea20/adr-misc`                       |
| Statut         | stable                                       |
| Depuis         | 0.2.0                                        |
| Source         | `src/format/format-iban/format-iban.ts`      |
| Tests          | `src/format/format-iban/format-iban.test.ts` |

**Signature**

```ts
function formatIban(iban: string | null | undefined, options?: IFormatIbanOptions): string;
```

**Description** : formate un IBAN par groupes de quatre caractères en majuscules, comme sur un RIB (« FR76 3000 6000 0112 3456 7890 189 »), quelle que soit la saisie (espaces, tirets, minuscules), avec masquage facultatif. Ne vérifie ni la longueur ni la clé de contrôle (utiliser une fonction de validation pour cela). À utiliser pour afficher les coordonnées bancaires d'un adhérent ou d'un fournisseur.

**Paramètres**

- `iban` : IBAN à formater.
- `options` : voir `IFormatIbanOptions`.

**Retour** : l'IBAN groupé par quatre, ou `""` s'il est absent ou vide.

**Erreurs** : aucune.

**Exemple**

```ts
import { formatIban } from "@etiennea20/adr-misc";

formatIban("fr76 3000-6000 0112 3456 7890 189"); // "FR76 3000 6000 0112 3456 7890 189"
formatIban("FR7630006000011234567890189", { masked: true }); // "FR76 **** **** **** **** ***0 189"
```

### `formatList`

| Champ          | Valeur                                       |
| -------------- | -------------------------------------------- |
| Catégorie      | `format`                                     |
| Point d'entrée | `@etiennea20/adr-misc`                       |
| Statut         | stable                                       |
| Depuis         | 0.2.0                                        |
| Source         | `src/format/format-list/format-list.ts`      |
| Tests          | `src/format/format-list/format-list.test.ts` |

**Signature**

```ts
function formatList(items: readonly string[], options?: IFormatListOptions): string;
```

**Description** : formate une liste en français courant (« Zola, Hugo et Balzac ») avec `Intl.ListFormat`. Les éléments vides ou composés d'espaces sont ignorés, ce qui permet de passer des champs facultatifs sans les filtrer. À utiliser pour énumérer des auteurs, des genres ou des exemplaires dans une phrase.

**Paramètres**

- `items` : éléments à énumérer, dans l'ordre.
- `options` : voir `IFormatListOptions`.

**Retour** : la liste formatée, ou `""` si aucun élément n'est renseigné.

**Erreurs** : `RangeError` si la locale est invalide.

**Exemple**

```ts
import { formatList } from "@etiennea20/adr-misc";

formatList(["Zola", "Hugo", "Balzac"]); // "Zola, Hugo et Balzac"
formatList(["Zola", "", "Hugo"]); // "Zola et Hugo"
formatList(["roman", "essai"], { type: "disjunction" }); // "roman ou essai"
```

### `formatNumber`

| Champ          | Valeur                                           |
| -------------- | ------------------------------------------------ |
| Catégorie      | `format`                                         |
| Point d'entrée | `@etiennea20/adr-misc`                           |
| Statut         | stable                                           |
| Depuis         | 0.2.0                                            |
| Source         | `src/format/format-number/format-number.ts`      |
| Tests          | `src/format/format-number/format-number.test.ts` |

**Signature**

```ts
function formatNumber(value: number | null | undefined, options?: IFormatNumberOptions): string;
```

**Description** : formate un nombre au format français : espace fine insécable U+202F entre les milliers et virgule décimale (« 1 234 567,891 »), trois décimales au plus par défaut. À utiliser pour une quantité, un total, une statistique. Une valeur absente ou non finie donne `""` (cellule vide plutôt que « NaN »).

**Paramètres**

- `value` : nombre à formater.
- `options` : voir `IFormatNumberOptions`.

**Retour** : le nombre formaté, ou `""` si `value` est `null`, `undefined`, `NaN` ou infini.

**Erreurs** : `RangeError` si la locale est invalide ou si le nombre de décimales est hors de l'intervalle 0 à 100 (ou si le minimum dépasse le maximum).

**Exemple**

```ts
import { formatNumber } from "@etiennea20/adr-misc";

formatNumber(1234567.891); // "1 234 567,891"
formatNumber(1234.5, { minimumFractionDigits: 2 }); // "1 234,50"
formatNumber(Number.NaN); // ""
```

### `formatOrdinal`

| Champ          | Valeur                                             |
| -------------- | -------------------------------------------------- |
| Catégorie      | `format`                                           |
| Point d'entrée | `@etiennea20/adr-misc`                             |
| Statut         | stable                                             |
| Depuis         | 0.2.0                                              |
| Source         | `src/format/format-ordinal/format-ordinal.ts`      |
| Tests          | `src/format/format-ordinal/format-ordinal.test.ts` |

**Signature**

```ts
function formatOrdinal(value: number, options?: IFormatOrdinalOptions): string;
```

**Description** : formate un ordinal selon l'usage typographique français, sans exposant : « 1er », « 1re », « 2e », « 21e » (et non « 2ème » ni « 2nd »). À utiliser pour un rang, un numéro d'édition, un étage, un siècle.

**Paramètres**

- `value` : rang, entier positif ou nul.
- `options` : voir `IFormatOrdinalOptions`.

**Retour** : l'ordinal abrégé.

**Erreurs** : `RangeError` si `value` n'est pas un entier positif ou nul.

**Exemple**

```ts
import { formatOrdinal } from "@etiennea20/adr-misc";

formatOrdinal(1); // "1er"
formatOrdinal(1, { gender: "feminine" }); // "1re"
formatOrdinal(21); // "21e"
```

### `formatPercent`

| Champ          | Valeur                                             |
| -------------- | -------------------------------------------------- |
| Catégorie      | `format`                                           |
| Point d'entrée | `@etiennea20/adr-misc`                             |
| Statut         | stable                                             |
| Depuis         | 0.2.0                                              |
| Source         | `src/format/format-percent/format-percent.ts`      |
| Tests          | `src/format/format-percent/format-percent.test.ts` |

**Signature**

```ts
function formatPercent(ratio: number | null | undefined, options?: IFormatPercentOptions): string;
```

**Description** : formate un **ratio** en pourcentage au format français (`0.125` donne « 12,5 % », avec une espace insécable U+00A0 avant `%`), une décimale au plus par défaut. Cohérent avec `parseNumber`, qui renvoie un ratio pour « 12,5 % ». À utiliser pour un taux (retour des livres, adhérents actifs).

**Paramètres**

- `ratio` : ratio à formater (`1` = 100 %).
- `options` : voir `IFormatPercentOptions`.

**Retour** : le pourcentage formaté, ou `""` si `ratio` est `null`, `undefined`, `NaN` ou infini.

**Erreurs** : `RangeError` si la locale est invalide ou si le nombre de décimales est hors de l'intervalle 0 à 100 (ou si le minimum dépasse le maximum).

**Exemple**

```ts
import { formatPercent } from "@etiennea20/adr-misc";

formatPercent(0.125); // "12,5 %"
formatPercent(0.4567); // "45,7 %"
formatPercent(1); // "100 %"
```

### `formatPhoneNumber`

| Champ          | Valeur                                                       |
| -------------- | ------------------------------------------------------------ |
| Catégorie      | `format`                                                     |
| Point d'entrée | `@etiennea20/adr-misc`                                       |
| Statut         | stable                                                       |
| Depuis         | 0.2.0                                                        |
| Source         | `src/format/format-phone-number/format-phone-number.ts`      |
| Tests          | `src/format/format-phone-number/format-phone-number.test.ts` |

**Signature**

```ts
function formatPhoneNumber(
  phone: string | null | undefined,
  options?: IFormatPhoneNumberOptions,
): string;
```

**Description** : formate un numéro de téléphone français par paires de chiffres (« 06 12 34 56 78 » ou « +33 6 12 34 56 78 »), quelle que soit la saisie (espaces, points, tirets, barres obliques, `+33`, `0033`, `(0)`). Par défaut, la forme nationale ou internationale de la saisie est conservée. Un numéro non reconnu (étranger, incomplet, outre-mer avec un autre indicatif) est renvoyé tel quel, sans les espaces autour. Ne valide pas le numéro. À utiliser pour afficher le numéro d'un adhérent.

**Paramètres**

- `phone` : numéro à formater.
- `options` : voir `IFormatPhoneNumberOptions`.

**Retour** : le numéro formaté, la saisie sans espaces autour si elle n'est pas reconnue, ou `""` si elle est absente.

**Erreurs** : aucune.

**Exemple**

```ts
import { formatPhoneNumber } from "@etiennea20/adr-misc";

formatPhoneNumber("0612345678"); // "06 12 34 56 78"
formatPhoneNumber("+33 (0)6.12.34.56.78"); // "+33 6 12 34 56 78"
formatPhoneNumber("+33612345678", { international: false }); // "06 12 34 56 78"
formatPhoneNumber("+44 20 7946 0958"); // "+44 20 7946 0958"
```

### `formatRelativeTime`

| Champ          | Valeur                                                         |
| -------------- | -------------------------------------------------------------- |
| Catégorie      | `format`                                                       |
| Point d'entrée | `@etiennea20/adr-misc`                                         |
| Statut         | stable                                                         |
| Depuis         | 0.2.0                                                          |
| Source         | `src/format/format-relative-time/format-relative-time.ts`      |
| Tests          | `src/format/format-relative-time/format-relative-time.test.ts` |

**Signature**

```ts
function formatRelativeTime(value: ConfigType, options?: IFormatRelativeTimeOptions): string;
```

**Description** : formate l'écart entre une date et maintenant en langage courant (« il y a 3 jours », « dans 2 heures », « hier », « le mois dernier ») avec `Intl.RelativeTimeFormat`. L'unité est choisie automatiquement : secondes, minutes, heures et jours sous leur seuil (60, 60, 24, 7), puis semaines sous un mois, mois sous un an, et années. À utiliser pour une dernière connexion, un retour attendu, un ajout au catalogue.

**Paramètres**

- `value` : `Date`, chaîne ISO 8601, horodatage ou objet dayjs.
- `options` : voir `IFormatRelativeTimeOptions` (`now` pour un résultat reproductible).

**Retour** : l'écart formaté, ou `""` si la date ou l'instant de référence est absent ou invalide.

**Erreurs** : `RangeError` si la locale est invalide.

**Exemple**

```ts
import { formatRelativeTime } from "@etiennea20/adr-misc";

const now = new Date(2026, 0, 15, 12, 0);
formatRelativeTime(new Date(2026, 0, 12, 12, 0), { now }); // "il y a 3 jours"
formatRelativeTime(new Date(2026, 0, 15, 14, 0), { now }); // "dans 2 heures"
formatRelativeTime(new Date(2026, 0, 14, 12, 0), { now }); // "hier"
```

## date

### `addBusinessDays`

| Champ          | Valeur                                                 |
| -------------- | ------------------------------------------------------ |
| Catégorie      | `date`                                                 |
| Point d'entrée | `@etiennea20/adr-misc`                                 |
| Statut         | stable                                                 |
| Depuis         | 0.2.0                                                  |
| Source         | `src/date/add-business-days/add-business-days.ts`      |
| Tests          | `src/date/add-business-days/add-business-days.test.ts` |

**Signature**

```ts
function addBusinessDays(date: ConfigType, days: number, options?: IPublicHolidayOptions): Dayjs;
```

**Description** : ajoute (ou retire, si `days` est négatif) un nombre de jours ouvrés à une date, en sautant les week-ends et les jours fériés français. À utiliser pour calculer une échéance (« sous 5 jours ouvrés »). Le jour de départ n'est jamais compté ; avec `days` à 0, la date est renvoyée telle quelle, même si elle n'est pas ouvrée. L'heure de départ est conservée.

**Paramètres**

- `date` : date de départ (tout ce qu'accepte `dayjs()`).
- `days` : nombre entier de jours ouvrés ; négatif pour reculer.
- `options` : options des jours fériés (`alsaceMoselle`).

**Retour** : la date obtenue (`Dayjs`), toujours un jour ouvré si `days` est non nul.

**Erreurs** : `Error` si la date est invalide ; `RangeError` si `days` n'est pas un entier ou si le calcul atteint une année hors de 1583 à 9999.

**Exemple**

```ts
import { addBusinessDays } from "@etiennea20/adr-misc";

addBusinessDays("2026-10-30", 1).format("YYYY-MM-DD"); // "2026-11-02" (week-end sauté)
addBusinessDays("2026-11-10", 1).format("YYYY-MM-DD"); // "2026-11-12" (11 novembre sauté)
addBusinessDays("2026-11-02", -1).format("YYYY-MM-DD"); // "2026-10-30"
```

### `countBusinessDays`

| Champ          | Valeur                                                     |
| -------------- | ---------------------------------------------------------- |
| Catégorie      | `date`                                                     |
| Point d'entrée | `@etiennea20/adr-misc`                                     |
| Statut         | stable                                                     |
| Depuis         | 0.2.0                                                      |
| Source         | `src/date/count-business-days/count-business-days.ts`      |
| Tests          | `src/date/count-business-days/count-business-days.test.ts` |

**Signature**

```ts
function countBusinessDays(
  start: ConfigType,
  end: ConfigType,
  options?: IPublicHolidayOptions,
): number;
```

**Description** : compte les jours ouvrés (ni week-end, ni jour férié français) entre deux dates, bornes incluses. À utiliser pour mesurer un délai en jours ouvrés (durée d'un retard, d'un traitement). Les heures sont ignorées : seuls les jours comptent (heure locale).

**Paramètres**

- `start` : premier jour de la période (inclus).
- `end` : dernier jour de la période (inclus).
- `options` : options des jours fériés (`alsaceMoselle`).

**Retour** : le nombre de jours ouvrés de la période.

**Erreurs** : `Error` si une borne est invalide ou si `start` est postérieur à `end` ; `RangeError` si la période touche une année hors de 1583 à 9999.

**Exemple**

```ts
import { countBusinessDays } from "@etiennea20/adr-misc";

countBusinessDays("2026-11-02", "2026-11-06"); // 5 (du lundi au vendredi)
countBusinessDays("2026-11-09", "2026-11-13"); // 4 (mercredi 11 novembre férié)
```

### `getAge`

| Champ          | Valeur                             |
| -------------- | ---------------------------------- |
| Catégorie      | `date`                             |
| Point d'entrée | `@etiennea20/adr-misc`             |
| Statut         | stable                             |
| Depuis         | 0.2.0                              |
| Source         | `src/date/get-age/get-age.ts`      |
| Tests          | `src/date/get-age/get-age.test.ts` |

**Signature**

```ts
function getAge(birthDate: ConfigType, referenceDate?: ConfigType): number;
```

**Description** : calcule l'âge en années révolues à une date donnée (par défaut, maintenant). À utiliser pour un contrôle d'âge (adhésion, tarif, majorité) : l'anniversaire est compté le jour même ; une personne née un 29 février prend un an le 1er mars des années non bissextiles.

**Paramètres**

- `birthDate` : date de naissance.
- `referenceDate` : date à laquelle calculer l'âge (défaut : `dayjs()`).

**Retour** : l'âge en années entières.

**Erreurs** : `Error` si une des dates est invalide, ou si la date de naissance est postérieure à la date de référence.

**Exemple**

```ts
import { getAge } from "@etiennea20/adr-misc";

getAge("2008-10-29", "2026-10-29"); // 18
getAge("2008-10-30", "2026-10-29"); // 17
getAge(member.birthDate) >= 18; // majeur aujourd'hui
```

### `getDateRange`

| Champ          | Valeur                                           |
| -------------- | ------------------------------------------------ |
| Catégorie      | `date`                                           |
| Point d'entrée | `@etiennea20/adr-misc`                           |
| Statut         | stable                                           |
| Depuis         | 0.2.0                                            |
| Source         | `src/date/get-date-range/get-date-range.ts`      |
| Tests          | `src/date/get-date-range/get-date-range.test.ts` |

**Signature**

```ts
function getDateRange(start: ConfigType, end: ConfigType, unit?: "day" | "month" | "year"): Dayjs[];
```

**Description** : liste les jours (ou les mois, ou les années) compris entre deux dates, bornes incluses. À utiliser pour construire les colonnes d'un planning, les lignes d'un rapport mensuel ou parcourir une période. Chaque élément est le début de l'unité (minuit pour un jour, le 1er du mois pour un mois), en heure locale.

**Paramètres**

- `start` : début de la période (inclus).
- `end` : fin de la période (incluse).
- `unit` : pas de la liste, `"day"` (défaut), `"month"` ou `"year"`.

**Retour** : les débuts d'unité, dans l'ordre chronologique.

**Erreurs** : `Error` si une borne est invalide, ou si `start` est postérieur à `end` (à l'unité près).

**Exemple**

```ts
import { getDateRange } from "@etiennea20/adr-misc";

getDateRange("2026-10-30", "2026-11-02").map((day) => day.format("DD/MM"));
// ["30/10", "31/10", "01/11", "02/11"]
getDateRange("2026-09-15", "2026-12-01", "month").map((month) => month.format("MM/YYYY"));
// ["09/2026", "10/2026", "11/2026", "12/2026"]
```

### `getEasterDate`

| Champ          | Valeur                                             |
| -------------- | -------------------------------------------------- |
| Catégorie      | `date`                                             |
| Point d'entrée | `@etiennea20/adr-misc`                             |
| Statut         | stable                                             |
| Depuis         | 0.2.0                                              |
| Source         | `src/date/get-easter-date/get-easter-date.ts`      |
| Tests          | `src/date/get-easter-date/get-easter-date.test.ts` |

**Signature**

```ts
function getEasterDate(year: number): Dayjs;
```

**Description** : calcule le dimanche de Pâques (calendrier grégorien) d'une année, avec l'algorithme de Meeus/Jones/Butcher. À utiliser pour dériver les fêtes mobiles (lundi de Pâques, Ascension, Pentecôte).

**Paramètres**

- `year` : année entière, de 1583 à 9999.

**Retour** : le dimanche de Pâques, à minuit (heure locale).

**Erreurs** : `RangeError` si l'année n'est pas un entier compris entre 1583 et 9999.

**Exemple**

```ts
import { getEasterDate } from "@etiennea20/adr-misc";

getEasterDate(2026).format("DD/MM/YYYY"); // "05/04/2026"
getEasterDate(2027).format("DD/MM/YYYY"); // "28/03/2027"
```

### `getIsoWeek`

| Champ          | Valeur                                       |
| -------------- | -------------------------------------------- |
| Catégorie      | `date`                                       |
| Point d'entrée | `@etiennea20/adr-misc`                       |
| Statut         | stable                                       |
| Depuis         | 0.2.0                                        |
| Source         | `src/date/get-iso-week/get-iso-week.ts`      |
| Tests          | `src/date/get-iso-week/get-iso-week.test.ts` |

**Signature**

```ts
function getIsoWeek(date: ConfigType): number;
```

**Description** : renvoie le numéro de semaine ISO 8601 d'une date (semaines du lundi au dimanche, la semaine 1 contient le premier jeudi de l'année). À utiliser pour les plannings et rapports hebdomadaires. Les premiers jours de janvier peuvent appartenir à la semaine 52 ou 53 de l'année précédente. Calculé sans le plugin dayjs `isoWeek` et indépendamment de la locale.

**Paramètres**

- `date` : date dont on veut la semaine (heure locale).

**Retour** : le numéro de semaine, de 1 à 53.

**Erreurs** : `Error` si la date est invalide.

**Exemple**

```ts
import { getIsoWeek } from "@etiennea20/adr-misc";

getIsoWeek("2026-10-29"); // 44
getIsoWeek("2027-01-01"); // 53 (semaine 53 de 2026)
getIsoWeek("2024-12-30"); // 1 (semaine 1 de 2025)
```

### `getPublicHolidaysFr`

| Champ          | Valeur                                                           |
| -------------- | ---------------------------------------------------------------- |
| Catégorie      | `date`                                                           |
| Point d'entrée | `@etiennea20/adr-misc`                                           |
| Statut         | stable                                                           |
| Depuis         | 0.2.0                                                            |
| Source         | `src/date/get-public-holidays-fr/get-public-holidays-fr.ts`      |
| Tests          | `src/date/get-public-holidays-fr/get-public-holidays-fr.test.ts` |

**Signature**

```ts
function getPublicHolidaysFr(year: number, options?: IPublicHolidayOptions): IPublicHoliday[];
```

**Description** : liste les 11 jours fériés légaux de France métropolitaine d'une année, triés par date (fêtes mobiles dérivées de Pâques). L'option `alsaceMoselle` ajoute le Vendredi saint et la Saint-Étienne. À utiliser pour afficher un calendrier de fermeture ou alimenter un calcul de jours ouvrés. Deux jours fériés tombant le même jour sont renvoyés tous les deux ; les jours fériés d'outre-mer ne sont pas inclus.

**Paramètres**

- `year` : année entière, de 1583 à 9999.
- `options` : options (`alsaceMoselle`).

**Retour** : les jours fériés (`date` à minuit en heure locale, `name` en français).

**Erreurs** : `RangeError` si l'année n'est pas un entier compris entre 1583 et 9999.

**Exemple**

```ts
import { getPublicHolidaysFr } from "@etiennea20/adr-misc";

getPublicHolidaysFr(2026).map(({ date, name }) => `${date.format("DD/MM")} ${name}`);
// ["01/01 Jour de l'an", "06/04 Lundi de Pâques", "01/05 Fête du Travail", …]
getPublicHolidaysFr(2026, { alsaceMoselle: true }).length; // 13
```

### `getSchoolYear`

| Champ          | Valeur                                             |
| -------------- | -------------------------------------------------- |
| Catégorie      | `date`                                             |
| Point d'entrée | `@etiennea20/adr-misc`                             |
| Statut         | stable                                             |
| Depuis         | 0.2.0                                              |
| Source         | `src/date/get-school-year/get-school-year.ts`      |
| Tests          | `src/date/get-school-year/get-school-year.test.ts` |

**Signature**

```ts
function getSchoolYear(date?: ConfigType, options?: ISchoolYearOptions): string;
```

**Description** : renvoie le libellé « 2026-2027 » de l'année scolaire (ou universitaire) qui contient une date. À utiliser pour rattacher une inscription, une adhésion ou une statistique à une année scolaire. L'année commence le 1er du mois `startMonth` (septembre par défaut).

**Paramètres**

- `date` : date à situer (défaut : `dayjs()`).
- `options` : options (`startMonth`).

**Retour** : le libellé « AAAA-AAAA ».

**Erreurs** : `Error` si la date est invalide ; `RangeError` si `startMonth` n'est pas un entier compris entre 0 et 11.

**Exemple**

```ts
import { getSchoolYear } from "@etiennea20/adr-misc";

getSchoolYear("2026-10-29"); // "2026-2027"
getSchoolYear("2026-08-31"); // "2025-2026"
getSchoolYear("2026-08-31", { startMonth: 7 }); // "2026-2027"
```

### `IDateBetweenOptions`

| Champ          | Valeur                                             |
| -------------- | -------------------------------------------------- |
| Catégorie      | `date`                                             |
| Point d'entrée | `@etiennea20/adr-misc`                             |
| Statut         | stable                                             |
| Depuis         | 0.2.0                                              |
| Source         | `src/date/is-date-between/is-date-between.ts`      |
| Tests          | `src/date/is-date-between/is-date-between.test.ts` |

**Signature**

```ts
interface IDateBetweenOptions {
  readonly inclusive?: boolean; // défaut : true
  readonly unit?: OpUnitType; // défaut : "day"
}
```

**Description** : options de `isDateBetween` : inclusion des bornes et granularité de la comparaison (les unités plus fines sont ignorées).

**Exemple**

```ts
import type { IDateBetweenOptions } from "@etiennea20/adr-misc";

const options: IDateBetweenOptions = { inclusive: false, unit: "month" };
```

### `IPublicHoliday`

| Champ          | Valeur                                                           |
| -------------- | ---------------------------------------------------------------- |
| Catégorie      | `date`                                                           |
| Point d'entrée | `@etiennea20/adr-misc`                                           |
| Statut         | stable                                                           |
| Depuis         | 0.2.0                                                            |
| Source         | `src/date/get-public-holidays-fr/get-public-holidays-fr.ts`      |
| Tests          | `src/date/get-public-holidays-fr/get-public-holidays-fr.test.ts` |

**Signature**

```ts
interface IPublicHoliday {
  readonly date: Dayjs;
  readonly name: string;
}
```

**Description** : jour férié renvoyé par `getPublicHolidaysFr` : sa date (à minuit, heure locale) et son nom usuel en français.

**Exemple**

```ts
import type { IPublicHoliday } from "@etiennea20/adr-misc";

const holiday: IPublicHoliday = {
  date: dayjs("2026-07-14"),
  name: "Fête nationale",
};
```

### `IPublicHolidayOptions`

| Champ          | Valeur                                                           |
| -------------- | ---------------------------------------------------------------- |
| Catégorie      | `date`                                                           |
| Point d'entrée | `@etiennea20/adr-misc`                                           |
| Statut         | stable                                                           |
| Depuis         | 0.2.0                                                            |
| Source         | `src/date/get-public-holidays-fr/get-public-holidays-fr.ts`      |
| Tests          | `src/date/get-public-holidays-fr/get-public-holidays-fr.test.ts` |

**Signature**

```ts
interface IPublicHolidayOptions {
  readonly alsaceMoselle?: boolean; // défaut : false
}
```

**Description** : options communes aux fonctions qui tiennent compte des jours fériés (`getPublicHolidaysFr`, `isPublicHolidayFr`, `isBusinessDay`, `addBusinessDays`, `countBusinessDays`). `alsaceMoselle` ajoute le Vendredi saint et la Saint-Étienne (26 décembre).

**Exemple**

```ts
import { isBusinessDay } from "@etiennea20/adr-misc";
import type { IPublicHolidayOptions } from "@etiennea20/adr-misc";

const options: IPublicHolidayOptions = { alsaceMoselle: true };
isBusinessDay("2026-12-26", options); // false (Saint-Étienne, et samedi)
```

### `isBusinessDay`

| Champ          | Valeur                                             |
| -------------- | -------------------------------------------------- |
| Catégorie      | `date`                                             |
| Point d'entrée | `@etiennea20/adr-misc`                             |
| Statut         | stable                                             |
| Depuis         | 0.2.0                                              |
| Source         | `src/date/is-business-day/is-business-day.ts`      |
| Tests          | `src/date/is-business-day/is-business-day.test.ts` |

**Signature**

```ts
function isBusinessDay(date: ConfigType, options?: IPublicHolidayOptions): boolean;
```

**Description** : indique si une date est un jour ouvré (ni samedi, ni dimanche, ni jour férié français). À utiliser pour valider une date de rendez-vous ou d'échéance. Les fermetures propres à une structure (ponts, congés) ne sont pas connues : les filtrer en plus si besoin.

**Paramètres**

- `date` : date à tester.
- `options` : options des jours fériés (`alsaceMoselle`).

**Retour** : `true` si la date est un jour ouvré.

**Erreurs** : `Error` si la date est invalide ; `RangeError` si son année est hors de 1583 à 9999.

**Exemple**

```ts
import { isBusinessDay } from "@etiennea20/adr-misc";

isBusinessDay("2026-11-02"); // true (lundi)
isBusinessDay("2026-11-01"); // false (dimanche, Toussaint)
isBusinessDay("2026-11-11"); // false (mercredi férié)
```

### `ISchoolYearOptions`

| Champ          | Valeur                                             |
| -------------- | -------------------------------------------------- |
| Catégorie      | `date`                                             |
| Point d'entrée | `@etiennea20/adr-misc`                             |
| Statut         | stable                                             |
| Depuis         | 0.2.0                                              |
| Source         | `src/date/get-school-year/get-school-year.ts`      |
| Tests          | `src/date/get-school-year/get-school-year.test.ts` |

**Signature**

```ts
interface ISchoolYearOptions {
  readonly startMonth?: number; // 0 (janvier) à 11 (décembre), défaut : 8 (septembre)
}
```

**Description** : options de `getSchoolYear` : mois de début de l'année scolaire, numéroté comme `Date.prototype.getMonth()`.

**Exemple**

```ts
import type { ISchoolYearOptions } from "@etiennea20/adr-misc";

const options: ISchoolYearOptions = { startMonth: 7 }; // exercice qui commence en août
```

### `isDateBetween`

| Champ          | Valeur                                             |
| -------------- | -------------------------------------------------- |
| Catégorie      | `date`                                             |
| Point d'entrée | `@etiennea20/adr-misc`                             |
| Statut         | stable                                             |
| Depuis         | 0.2.0                                              |
| Source         | `src/date/is-date-between/is-date-between.ts`      |
| Tests          | `src/date/is-date-between/is-date-between.test.ts` |

**Signature**

```ts
function isDateBetween(
  date: ConfigType,
  start: ConfigType,
  end: ConfigType,
  options?: IDateBetweenOptions,
): boolean;
```

**Description** : indique si une date est comprise dans une période. À utiliser pour savoir si un emprunt, une adhésion ou une promotion est en cours. Par défaut, bornes incluses et comparaison au jour près (l'heure est ignorée), sans le plugin dayjs `isBetween`.

**Paramètres**

- `date` : date à tester.
- `start` : début de la période.
- `end` : fin de la période.
- `options` : inclusion des bornes (`inclusive`, défaut `true`) et granularité (`unit`, défaut `"day"`).

**Retour** : `true` si la date est dans la période.

**Erreurs** : `Error` si une des dates est invalide, ou si `start` est postérieur à `end`.

**Exemple**

```ts
import { isDateBetween } from "@etiennea20/adr-misc";

isDateBetween("2026-10-31T18:00", "2026-10-01", "2026-10-31"); // true (jour inclus)
isDateBetween("2026-10-31", "2026-10-01", "2026-10-31", { inclusive: false }); // false
isDateBetween("2026-10-15", "2026-09-30", "2026-11-01", { unit: "month" }); // true
```

### `isPublicHolidayFr`

| Champ          | Valeur                                                       |
| -------------- | ------------------------------------------------------------ |
| Catégorie      | `date`                                                       |
| Point d'entrée | `@etiennea20/adr-misc`                                       |
| Statut         | stable                                                       |
| Depuis         | 0.2.0                                                        |
| Source         | `src/date/is-public-holiday-fr/is-public-holiday-fr.ts`      |
| Tests          | `src/date/is-public-holiday-fr/is-public-holiday-fr.test.ts` |

**Signature**

```ts
function isPublicHolidayFr(date: ConfigType, options?: IPublicHolidayOptions): boolean;
```

**Description** : indique si une date est un jour férié légal en France métropolitaine. À utiliser pour signaler un jour de fermeture ou refuser une date d'échéance. L'heure est ignorée : seul le jour compte (heure locale).

**Paramètres**

- `date` : date à tester.
- `options` : options (`alsaceMoselle`).

**Retour** : `true` si la date tombe un jour férié.

**Erreurs** : `Error` si la date est invalide ; `RangeError` si son année est hors de 1583 à 9999.

**Exemple**

```ts
import { isPublicHolidayFr } from "@etiennea20/adr-misc";

isPublicHolidayFr("2026-07-14"); // true
isPublicHolidayFr("2026-12-26"); // false
isPublicHolidayFr("2026-12-26", { alsaceMoselle: true }); // true
```

### `isWeekend`

| Champ          | Valeur                                   |
| -------------- | ---------------------------------------- |
| Catégorie      | `date`                                   |
| Point d'entrée | `@etiennea20/adr-misc`                   |
| Statut         | stable                                   |
| Depuis         | 0.2.0                                    |
| Source         | `src/date/is-weekend/is-weekend.ts`      |
| Tests          | `src/date/is-weekend/is-weekend.test.ts` |

**Signature**

```ts
function isWeekend(date: ConfigType): boolean;
```

**Description** : indique si une date tombe un samedi ou un dimanche (heure locale). À utiliser pour griser les week-ends d'un calendrier ou refuser une date. Pour exclure aussi les jours fériés, utiliser `isBusinessDay`.

**Paramètres**

- `date` : date à tester.

**Retour** : `true` le samedi et le dimanche.

**Erreurs** : `Error` si la date est invalide.

**Exemple**

```ts
import { isWeekend } from "@etiennea20/adr-misc";

isWeekend("2026-10-31"); // true (samedi)
isWeekend("2026-11-02"); // false (lundi)
```

### `toIsoDate`

| Champ          | Valeur                                     |
| -------------- | ------------------------------------------ |
| Catégorie      | `date`                                     |
| Point d'entrée | `@etiennea20/adr-misc`                     |
| Statut         | stable                                     |
| Depuis         | 0.2.0                                      |
| Source         | `src/date/to-iso-date/to-iso-date.ts`      |
| Tests          | `src/date/to-iso-date/to-iso-date.test.ts` |

**Signature**

```ts
function toIsoDate(date: ConfigType): string;
```

**Description** : formate une date au format ISO 8601 court « YYYY-MM-DD » (jour local, sans heure ni fuseau). À utiliser pour envoyer une date calendaire à une API, la stocker dans une colonne `date` ou remplir un `<input type="date">`. Contrairement à `toISOString()`, le jour n'est pas décalé par la conversion en UTC.

**Paramètres**

- `date` : date à formater.

**Retour** : la date au format « YYYY-MM-DD ».

**Erreurs** : `Error` si la date est invalide.

**Exemple**

```ts
import { toIsoDate } from "@etiennea20/adr-misc";

toIsoDate(new Date(2026, 9, 29, 23, 30)); // "2026-10-29"
toIsoDate(dayjs("2026-10-29T08:00:00")); // "2026-10-29"
```

## enums

### `EDurationMs`

| Champ          | Valeur                                      |
| -------------- | ------------------------------------------- |
| Catégorie      | `enums`                                     |
| Point d'entrée | `@etiennea20/adr-misc`                      |
| Statut         | stable                                      |
| Depuis         | 0.2.0                                       |
| Source         | `src/enums/duration-ms/duration-ms.ts`      |
| Tests          | `src/enums/duration-ms/duration-ms.test.ts` |

**Signature**

```ts
const EDurationMs = {
  SECOND: 1000,
  MINUTE: 60_000,
  HOUR: 3_600_000,
  DAY: 86_400_000,
  WEEK: 604_800_000,
} as const;
type EDurationMs = (typeof EDurationMs)[keyof typeof EDurationMs];
```

**Description** : durées usuelles en millisecondes. À utiliser pour les délais, durées de cache et intervalles (`staleTime`, TTL) plutôt que `24 * 60 * 60 * 1000`. Pour un calcul calendaire (ajouter un jour à une date), préférer dayjs : un jour civil ne dure pas toujours 24 heures (changement d'heure).

**Exemple**

```ts
import { EDurationMs } from "@etiennea20/adr-misc";

const staleTime = 5 * EDurationMs.MINUTE; // 300000
EDurationMs.DAY; // 86400000
```

### `EHttpMethod`

| Champ          | Valeur                                      |
| -------------- | ------------------------------------------- |
| Catégorie      | `enums`                                     |
| Point d'entrée | `@etiennea20/adr-misc`                      |
| Statut         | stable                                      |
| Depuis         | 0.2.0                                       |
| Source         | `src/enums/http-method/http-method.ts`      |
| Tests          | `src/enums/http-method/http-method.test.ts` |

**Signature**

```ts
const EHttpMethod = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  PATCH: "PATCH",
  DELETE: "DELETE",
  HEAD: "HEAD",
  OPTIONS: "OPTIONS",
} as const;
type EHttpMethod = (typeof EHttpMethod)[keyof typeof EHttpMethod];
```

**Description** : méthodes HTTP, en majuscules. À utiliser pour typer la méthode d'une requête ou d'une route (client HTTP, journalisation, droits par méthode) plutôt qu'une chaîne libre.

**Exemple**

```ts
import { EHttpMethod } from "@etiennea20/adr-misc";

const method: EHttpMethod = EHttpMethod.POST; // "POST"
```

### `EHttpStatus`

| Champ          | Valeur                                      |
| -------------- | ------------------------------------------- |
| Catégorie      | `enums`                                     |
| Point d'entrée | `@etiennea20/adr-misc`                      |
| Statut         | stable                                      |
| Depuis         | 0.2.0                                       |
| Source         | `src/enums/http-status/http-status.ts`      |
| Tests          | `src/enums/http-status/http-status.test.ts` |

**Signature**

```ts
const EHttpStatus = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  MOVED_PERMANENTLY: 301,
  FOUND: 302,
  NOT_MODIFIED: 304,
  TEMPORARY_REDIRECT: 307,
  PERMANENT_REDIRECT: 308,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  GONE: 410,
  PAYLOAD_TOO_LARGE: 413,
  UNSUPPORTED_MEDIA_TYPE: 415,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const;
type EHttpStatus = (typeof EHttpStatus)[keyof typeof EHttpStatus];
```

**Description** : codes de statut HTTP courants, nommés comme dans la RFC 9110 (et comme `HttpStatus` de NestJS). À utiliser côté front pour interpréter une réponse et côté back pour renvoyer un statut, sans nombre magique.

**Exemple**

```ts
import { EHttpStatus } from "@etiennea20/adr-misc";

if (response.status === EHttpStatus.NOT_FOUND) {
  showMessage("Livre introuvable");
}
```

### `EMimeType`

| Champ          | Valeur                                  |
| -------------- | --------------------------------------- |
| Catégorie      | `enums`                                 |
| Point d'entrée | `@etiennea20/adr-misc`                  |
| Statut         | stable                                  |
| Depuis         | 0.2.0                                   |
| Source         | `src/enums/mime-type/mime-type.ts`      |
| Tests          | `src/enums/mime-type/mime-type.test.ts` |

**Signature**

```ts
const EMimeType = {
  JSON: "application/json",
  XML: "application/xml",
  PDF: "application/pdf",
  ZIP: "application/zip",
  OCTET_STREAM: "application/octet-stream",
  FORM_URLENCODED: "application/x-www-form-urlencoded",
  FORM_DATA: "multipart/form-data",
  XLS: "application/vnd.ms-excel",
  XLSX: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  DOC: "application/msword",
  DOCX: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ODS: "application/vnd.oasis.opendocument.spreadsheet",
  ODT: "application/vnd.oasis.opendocument.text",
  CSV: "text/csv",
  TEXT: "text/plain",
  HTML: "text/html",
  PNG: "image/png",
  JPEG: "image/jpeg",
  GIF: "image/gif",
  WEBP: "image/webp",
  SVG: "image/svg+xml",
} as const;
type EMimeType = (typeof EMimeType)[keyof typeof EMimeType];
```

**Description** : types MIME courants (en-têtes `Content-Type` et `Accept`, attribut `accept` d'un champ fichier, exports). À utiliser à la place des chaînes longues et faciles à mal recopier (XLSX, DOCX…).

**Exemple**

```ts
import { EMimeType } from "@etiennea20/adr-misc";

headers["Content-Type"] = EMimeType.JSON; // "application/json"
new Blob([buffer], { type: EMimeType.XLSX });
```

### `EMonth`

| Champ          | Valeur                          |
| -------------- | ------------------------------- |
| Catégorie      | `enums`                         |
| Point d'entrée | `@etiennea20/adr-misc`          |
| Statut         | stable                          |
| Depuis         | 0.2.0                           |
| Source         | `src/enums/month/month.ts`      |
| Tests          | `src/enums/month/month.test.ts` |

**Signature**

```ts
const EMonth = {
  JANUARY: 0,
  FEBRUARY: 1,
  // ...
  DECEMBER: 11,
} as const;
type EMonth = (typeof EMonth)[keyof typeof EMonth];
```

**Description** : mois de l'année, numérotés comme `Date.prototype.getMonth()` et `dayjs().month()` (janvier = 0). À utiliser à la place des nombres magiques, source classique d'erreurs « à un mois près » avec le constructeur `Date`. Libellés français : `MONTH_LABELS`.

**Exemple**

```ts
import { EMonth } from "@etiennea20/adr-misc";

EMonth.SEPTEMBER; // 8
new Date(2026, EMonth.OCTOBER, 29); // 29 octobre 2026
```

### `ESortDirection`

| Champ          | Valeur                                            |
| -------------- | ------------------------------------------------- |
| Catégorie      | `enums`                                           |
| Point d'entrée | `@etiennea20/adr-misc`                            |
| Statut         | stable                                            |
| Depuis         | 0.2.0                                             |
| Source         | `src/enums/sort-direction/sort-direction.ts`      |
| Tests          | `src/enums/sort-direction/sort-direction.test.ts` |

**Signature**

```ts
const ESortDirection = { ASC: "asc", DESC: "desc" } as const;
type ESortDirection = (typeof ESortDirection)[keyof typeof ESortDirection];
```

**Description** : sens d'un tri, croissant ou décroissant. À utiliser pour les paramètres de tri échangés entre un tableau côté front et une API (`?sort=title&direction=asc`), avec les mêmes valeurs des deux côtés.

**Exemple**

```ts
import { ESortDirection } from "@etiennea20/adr-misc";

const sort = { field: "title", direction: ESortDirection.ASC }; // direction : "asc"
```

### `EWeekDay`

| Champ          | Valeur                                |
| -------------- | ------------------------------------- |
| Catégorie      | `enums`                               |
| Point d'entrée | `@etiennea20/adr-misc`                |
| Statut         | stable                                |
| Depuis         | 0.2.0                                 |
| Source         | `src/enums/week-day/week-day.ts`      |
| Tests          | `src/enums/week-day/week-day.test.ts` |

**Signature**

```ts
const EWeekDay = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
} as const;
type EWeekDay = (typeof EWeekDay)[keyof typeof EWeekDay];
```

**Description** : jours de la semaine, numérotés comme `Date.prototype.getDay()` et `dayjs().day()` (dimanche = 0). À utiliser à la place des nombres magiques pour comparer ou stocker un jour de la semaine (jours d'ouverture, récurrences). Libellés français : `WEEK_DAY_LABELS`.

**Exemple**

```ts
import { EWeekDay } from "@etiennea20/adr-misc";

EWeekDay.MONDAY; // 1
new Date(2026, 9, 31).getDay() === EWeekDay.SATURDAY; // true
```

### `getEnumKey`

| Champ          | Valeur                                        |
| -------------- | --------------------------------------------- |
| Catégorie      | `enums`                                       |
| Point d'entrée | `@etiennea20/adr-misc`                        |
| Statut         | stable                                        |
| Depuis         | 0.2.0                                         |
| Source         | `src/enums/get-enum-key/get-enum-key.ts`      |
| Tests          | `src/enums/get-enum-key/get-enum-key.test.ts` |

**Signature**

```ts
function getEnumKey<TEnum extends Readonly<Record<string, string | number>>>(
  enumObject: TEnum,
  value: unknown,
): (keyof TEnum & string) | undefined;
```

**Description** : renvoie la clé d'une énumération `as const` qui porte une valeur (recherche inverse). À utiliser pour journaliser ou afficher le nom d'une valeur (`404` vers `"NOT_FOUND"`). Si plusieurs clés portent la même valeur, la première déclarée est renvoyée.

**Paramètres**

- `enumObject` : énumération de référence.
- `value` : valeur recherchée, de n'importe quel type (comparaison stricte `===`).

**Retour** : la clé correspondante, ou `undefined` si la valeur n'appartient pas à l'énumération.

**Erreurs** : aucune.

**Exemple**

```ts
import { EHttpStatus, getEnumKey } from "@etiennea20/adr-misc";

getEnumKey(EHttpStatus, 404); // "NOT_FOUND"
getEnumKey(EHttpStatus, 418); // undefined
```

### `getEnumKeys`

| Champ          | Valeur                                          |
| -------------- | ----------------------------------------------- |
| Catégorie      | `enums`                                         |
| Point d'entrée | `@etiennea20/adr-misc`                          |
| Statut         | stable                                          |
| Depuis         | 0.2.0                                           |
| Source         | `src/enums/get-enum-keys/get-enum-keys.ts`      |
| Tests          | `src/enums/get-enum-keys/get-enum-keys.test.ts` |

**Signature**

```ts
function getEnumKeys<TEnum extends Readonly<Record<string, string | number>>>(
  enumObject: TEnum,
): (keyof TEnum & string)[];
```

**Description** : renvoie les clés d'une énumération `as const`, dans l'ordre de déclaration. À utiliser pour parcourir les noms d'une énumération (clés de traduction, en-têtes de colonnes). Contrairement à `Object.keys`, le résultat est typé avec l'union des clés.

**Paramètres**

- `enumObject` : énumération (`EWeekDay`, `EHttpMethod`…).

**Retour** : un nouveau tableau des clés.

**Erreurs** : aucune.

**Exemple**

```ts
import { ESortDirection, getEnumKeys } from "@etiennea20/adr-misc";

getEnumKeys(ESortDirection); // ["ASC", "DESC"]
```

### `getEnumValues`

| Champ          | Valeur                                              |
| -------------- | --------------------------------------------------- |
| Catégorie      | `enums`                                             |
| Point d'entrée | `@etiennea20/adr-misc`                              |
| Statut         | stable                                              |
| Depuis         | 0.2.0                                               |
| Source         | `src/enums/get-enum-values/get-enum-values.ts`      |
| Tests          | `src/enums/get-enum-values/get-enum-values.test.ts` |

**Signature**

```ts
function getEnumValues<TEnum extends Readonly<Record<string, string | number>>>(
  enumObject: TEnum,
): TEnum[keyof TEnum][];
```

**Description** : renvoie les valeurs d'une énumération `as const`, dans l'ordre de déclaration. À utiliser pour construire les options d'une liste déroulante, valider une saisie ou parcourir tous les cas. Prévu pour les objets `as const` préfixés par `E` (pas pour les `enum` TypeScript numériques, qui contiennent des clés inverses).

**Paramètres**

- `enumObject` : énumération (`EHttpMethod`, `ESortDirection`…).

**Retour** : un nouveau tableau des valeurs, typé avec l'union des valeurs.

**Erreurs** : aucune.

**Exemple**

```ts
import { ESortDirection, getEnumValues } from "@etiennea20/adr-misc";

getEnumValues(ESortDirection); // ["asc", "desc"]
```

### `isEnumValue`

| Champ          | Valeur                                          |
| -------------- | ----------------------------------------------- |
| Catégorie      | `enums`                                         |
| Point d'entrée | `@etiennea20/adr-misc`                          |
| Statut         | stable                                          |
| Depuis         | 0.2.0                                           |
| Source         | `src/enums/is-enum-value/is-enum-value.ts`      |
| Tests          | `src/enums/is-enum-value/is-enum-value.test.ts` |

**Signature**

```ts
function isEnumValue<TEnum extends Readonly<Record<string, string | number>>>(
  enumObject: TEnum,
  value: unknown,
): value is TEnum[keyof TEnum];
```

**Description** : garde de type : indique si une valeur fait partie d'une énumération `as const`. À utiliser pour valider une valeur venue de l'extérieur (paramètre d'URL, réponse d'API, `localStorage`) avant de la traiter comme une valeur de l'énumération. Comparaison stricte : `"1"` n'est pas une valeur de `EWeekDay`.

**Paramètres**

- `enumObject` : énumération de référence.
- `value` : valeur à tester, de n'importe quel type.

**Retour** : `true` si `value` est l'une des valeurs de l'énumération (le type est alors affiné).

**Erreurs** : aucune.

**Exemple**

```ts
import { ESortDirection, isEnumValue } from "@etiennea20/adr-misc";

const direction = params.get("direction");
const sortDirection = isEnumValue(ESortDirection, direction) ? direction : ESortDirection.ASC;
```

### `MONTH_LABELS`

| Champ          | Valeur                                        |
| -------------- | --------------------------------------------- |
| Catégorie      | `enums`                                       |
| Point d'entrée | `@etiennea20/adr-misc`                        |
| Statut         | stable                                        |
| Depuis         | 0.2.0                                         |
| Source         | `src/enums/month-labels/month-labels.ts`      |
| Tests          | `src/enums/month-labels/month-labels.test.ts` |

**Signature**

```ts
const MONTH_LABELS: Readonly<Record<EMonth, string>>; // "janvier" … "décembre"
```

**Description** : libellés français des mois, en minuscules, indexés par la valeur de `EMonth` (donc par `getMonth()`). À utiliser pour afficher un mois sans dépendre de la locale dayjs configurée ; mettre la majuscule à l'affichage si besoin.

**Exemple**

```ts
import { EMonth, MONTH_LABELS } from "@etiennea20/adr-misc";

MONTH_LABELS[EMonth.AUGUST]; // "août"
`${MONTH_LABELS[date.month() as EMonth]} ${date.year()}`; // "octobre 2026"
```

### `WEEK_DAY_LABELS`

| Champ          | Valeur                                              |
| -------------- | --------------------------------------------------- |
| Catégorie      | `enums`                                             |
| Point d'entrée | `@etiennea20/adr-misc`                              |
| Statut         | stable                                              |
| Depuis         | 0.2.0                                               |
| Source         | `src/enums/week-day-labels/week-day-labels.ts`      |
| Tests          | `src/enums/week-day-labels/week-day-labels.test.ts` |

**Signature**

```ts
const WEEK_DAY_LABELS: Readonly<Record<EWeekDay, string>>; // "dimanche" … "samedi"
```

**Description** : libellés français des jours de la semaine, en minuscules, indexés par la valeur de `EWeekDay` (donc par `getDay()`). À utiliser pour afficher un jour sans dépendre de la locale dayjs configurée ; mettre la majuscule à l'affichage si besoin (début de phrase, en-tête de colonne).

**Exemple**

```ts
import { EWeekDay, WEEK_DAY_LABELS } from "@etiennea20/adr-misc";

WEEK_DAY_LABELS[EWeekDay.MONDAY]; // "lundi"
WEEK_DAY_LABELS[new Date(2026, 9, 31).getDay() as EWeekDay]; // "samedi"
```

## validation

### `EPasswordCriterion`

| Champ          | Valeur                                                               |
| -------------- | -------------------------------------------------------------------- |
| Catégorie      | `validation`                                                         |
| Point d'entrée | `@etiennea20/adr-misc`                                               |
| Statut         | stable                                                               |
| Depuis         | 0.2.0                                                                |
| Source         | `src/validation/get-password-strength/get-password-strength.ts`      |
| Tests          | `src/validation/get-password-strength/get-password-strength.test.ts` |

**Signature**

```ts
const EPasswordCriterion = {
  MIN_LENGTH: "minLength",
  UPPERCASE: "uppercase",
  LOWERCASE: "lowercase",
  DIGIT: "digit",
  SPECIAL_CHAR: "specialChar",
} as const;
type EPasswordCriterion = (typeof EPasswordCriterion)[keyof typeof EPasswordCriterion];
```

**Description** : critères de robustesse d'un mot de passe, renvoyés par `getPasswordStrength` quand ils ne sont pas respectés.

**Exemple**

```ts
import { EPasswordCriterion, getPasswordStrength } from "@etiennea20/adr-misc";

const strength = getPasswordStrength("bibliotheque");
strength.missingCriteria.includes(EPasswordCriterion.DIGIT); // true
```

### `getPasswordStrength`

| Champ          | Valeur                                                               |
| -------------- | -------------------------------------------------------------------- |
| Catégorie      | `validation`                                                         |
| Point d'entrée | `@etiennea20/adr-misc`                                               |
| Statut         | stable                                                               |
| Depuis         | 0.2.0                                                                |
| Source         | `src/validation/get-password-strength/get-password-strength.ts`      |
| Tests          | `src/validation/get-password-strength/get-password-strength.test.ts` |

**Signature**

```ts
function getPasswordStrength(value: string, rules?: IPasswordRules): IPasswordStrength;
```

**Description** : évalue la robustesse d'un mot de passe : score de 0 à 4 et critères manquants. À utiliser pour afficher une jauge et des conseils pendant la saisie d'un mot de passe ; pour une simple validation, préférer `isStrongPassword`. Le score est la part des critères exigés qui sont respectés, ramenée à 0–4 (arrondie à l'inférieur) ; il est plafonné à 2 tant que la longueur minimale n'est pas atteinte et vaut 0 pour une chaîne vide.

**Paramètres**

- `value` : mot de passe à évaluer.
- `rules` : règles de robustesse (par défaut : 12 caractères, majuscule, minuscule, chiffre et caractère spécial).

**Retour** : le score et la liste des critères exigés non respectés.

**Erreurs** : aucune.

**Exemple**

```ts
import { getPasswordStrength } from "@etiennea20/adr-misc";

getPasswordStrength("Livre2026!Lecture"); // { score: 4, missingCriteria: [] }
getPasswordStrength("livre"); // { score: 0, missingCriteria: ["minLength", "uppercase", "digit", "specialChar"] }
```

### `IIsUrlOptions`

| Champ          | Valeur                                 |
| -------------- | -------------------------------------- |
| Catégorie      | `validation`                           |
| Point d'entrée | `@etiennea20/adr-misc`                 |
| Statut         | stable                                 |
| Depuis         | 0.2.0                                  |
| Source         | `src/validation/is-url/is-url.ts`      |
| Tests          | `src/validation/is-url/is-url.test.ts` |

**Signature**

```ts
interface IIsUrlOptions {
  protocols?: readonly string[];
}
```

**Description** : options de `isUrl`.

**Membres**

- `protocols` : protocoles acceptés, sans `://` (comparaison insensible à la casse). Par défaut : `["http", "https"]`.

**Exemple**

```ts
import type { IIsUrlOptions } from "@etiennea20/adr-misc";

const options: IIsUrlOptions = { protocols: ["http", "https", "ftp"] };
```

### `IPasswordRules`

| Champ          | Valeur                                                               |
| -------------- | -------------------------------------------------------------------- |
| Catégorie      | `validation`                                                         |
| Point d'entrée | `@etiennea20/adr-misc`                                               |
| Statut         | stable                                                               |
| Depuis         | 0.2.0                                                                |
| Source         | `src/validation/get-password-strength/get-password-strength.ts`      |
| Tests          | `src/validation/get-password-strength/get-password-strength.test.ts` |

**Signature**

```ts
interface IPasswordRules {
  minLength?: number;
  requireUppercase?: boolean;
  requireLowercase?: boolean;
  requireDigit?: boolean;
  requireSpecialChar?: boolean;
}
```

**Description** : règles de robustesse d'un mot de passe, utilisées par `getPasswordStrength` et `isStrongPassword`. Les valeurs par défaut suivent la recommandation de la CNIL (12 caractères mêlant majuscules, minuscules, chiffres et caractères spéciaux).

**Membres**

- `minLength` : nombre minimal de caractères (points de code Unicode). Par défaut : 12.
- `requireUppercase` : exiger au moins une lettre majuscule (accentuées comprises). Par défaut : true.
- `requireLowercase` : exiger au moins une lettre minuscule (accentuées comprises). Par défaut : true.
- `requireDigit` : exiger au moins un chiffre. Par défaut : true.
- `requireSpecialChar` : exiger au moins un caractère spécial (ni lettre ni chiffre). Par défaut : true.

**Exemple**

```ts
import type { IPasswordRules } from "@etiennea20/adr-misc";

const rules: IPasswordRules = { minLength: 8, requireSpecialChar: false };
```

### `IPasswordStrength`

| Champ          | Valeur                                                               |
| -------------- | -------------------------------------------------------------------- |
| Catégorie      | `validation`                                                         |
| Point d'entrée | `@etiennea20/adr-misc`                                               |
| Statut         | stable                                                               |
| Depuis         | 0.2.0                                                                |
| Source         | `src/validation/get-password-strength/get-password-strength.ts`      |
| Tests          | `src/validation/get-password-strength/get-password-strength.test.ts` |

**Signature**

```ts
interface IPasswordStrength {
  score: 0 | 1 | 2 | 3 | 4;
  missingCriteria: EPasswordCriterion[];
}
```

**Description** : résultat de `getPasswordStrength`.

**Membres**

- `score` : score de 0 (très faible) à 4 (fort) : part des critères exigés qui sont respectés.
- `missingCriteria` : critères exigés non respectés, dans l'ordre de `EPasswordCriterion`.

**Exemple**

```ts
import type { IPasswordStrength } from "@etiennea20/adr-misc";

const strength: IPasswordStrength = {
  score: 3,
  missingCriteria: ["specialChar"],
};
```

### `isEmail`

| Champ          | Valeur                                     |
| -------------- | ------------------------------------------ |
| Catégorie      | `validation`                               |
| Point d'entrée | `@etiennea20/adr-misc`                     |
| Statut         | stable                                     |
| Depuis         | 0.2.0                                      |
| Source         | `src/validation/is-email/is-email.ts`      |
| Tests          | `src/validation/is-email/is-email.test.ts` |

**Signature**

```ts
function isEmail(value: string): boolean;
```

**Description** : indique si une chaîne est une adresse électronique syntaxiquement valide. À utiliser pour valider un champ de formulaire ou une donnée importée avant envoi. La vérification est syntaxique : elle ne garantit pas que la boîte existe. Les espaces ne sont pas tolérés (appeler `trim()` avant si besoin).

**Paramètres**

- `value` : chaîne à tester.

**Retour** : `true` si `value` est une adresse électronique valide, `false` sinon.

**Erreurs** : aucune.

**Exemple**

```ts
import { isEmail } from "@etiennea20/adr-misc";

isEmail("lecteur@bibliotheque.fr"); // true
isEmail("lecteur@bibliotheque"); // false (pas d'extension)
isEmail("lecteur..dupont@bibliotheque.fr"); // false (points consécutifs)
```

### `isFrenchVatNumber`

| Champ          | Valeur                                                             |
| -------------- | ------------------------------------------------------------------ |
| Catégorie      | `validation`                                                       |
| Point d'entrée | `@etiennea20/adr-misc`                                             |
| Statut         | stable                                                             |
| Depuis         | 0.2.0                                                              |
| Source         | `src/validation/is-french-vat-number/is-french-vat-number.ts`      |
| Tests          | `src/validation/is-french-vat-number/is-french-vat-number.test.ts` |

**Signature**

```ts
function isFrenchVatNumber(value: string): boolean;
```

**Description** : indique si une chaîne est un numéro de TVA intracommunautaire français valide. À utiliser pour valider le numéro de TVA d'un client ou d'un fournisseur sur une facture. Format attendu : `FR`, une clé numérique de 2 chiffres, puis le SIREN (9 chiffres). Vérifie la clé (`(12 + 3 × (SIREN mod 97)) mod 97`) et la clé de Luhn du SIREN. Les espaces de présentation et la casse du préfixe sont tolérés. Les anciennes clés alphanumériques (entités sans SIREN) ne sont pas prises en charge. N'interroge pas le service VIES.

**Paramètres**

- `value` : numéro à tester, espaces tolérés.

**Retour** : `true` si `value` est un numéro de TVA français valide, `false` sinon.

**Erreurs** : aucune.

**Exemple**

```ts
import { isFrenchVatNumber } from "@etiennea20/adr-misc";

isFrenchVatNumber("FR 44 732 829 320"); // true
isFrenchVatNumber("FR45732829320"); // false (clé invalide)
```

### `isHexColor`

| Champ          | Valeur                                             |
| -------------- | -------------------------------------------------- |
| Catégorie      | `validation`                                       |
| Point d'entrée | `@etiennea20/adr-misc`                             |
| Statut         | stable                                             |
| Depuis         | 0.2.0                                              |
| Source         | `src/validation/is-hex-color/is-hex-color.ts`      |
| Tests          | `src/validation/is-hex-color/is-hex-color.test.ts` |

**Signature**

```ts
function isHexColor(value: string): boolean;
```

**Description** : indique si une chaîne est une couleur hexadécimale CSS (`#RGB`, `#RGBA`, `#RRGGBB` ou `#RRGGBBAA`). À utiliser pour valider une couleur saisie par un utilisateur (thème, étiquette) avant de l'enregistrer. Le `#` est obligatoire ; la casse est indifférente.

**Paramètres**

- `value` : chaîne à tester.

**Retour** : `true` si `value` est une couleur hexadécimale valide, `false` sinon.

**Erreurs** : aucune.

**Exemple**

```ts
import { isHexColor } from "@etiennea20/adr-misc";

isHexColor("#1e90ff"); // true
isHexColor("#FFF"); // true
isHexColor("1e90ff"); // false (sans #)
```

### `isIban`

| Champ          | Valeur                                   |
| -------------- | ---------------------------------------- |
| Catégorie      | `validation`                             |
| Point d'entrée | `@etiennea20/adr-misc`                   |
| Statut         | stable                                   |
| Depuis         | 0.2.0                                    |
| Source         | `src/validation/is-iban/is-iban.ts`      |
| Tests          | `src/validation/is-iban/is-iban.test.ts` |

**Signature**

```ts
function isIban(value: string): boolean;
```

**Description** : indique si une chaîne est un IBAN valide (format, longueur du pays, clé modulo 97). À utiliser pour valider des coordonnées bancaires (prélèvement d'une cotisation, remboursement d'une caution). Les espaces de présentation (`FR76 3000 6000 …`) et les minuscules sont tolérés. La longueur est vérifiée pour les pays de la zone SEPA ; pour les autres pays, seules les bornes générales (15 à 34 caractères) le sont. N'affirme pas que le compte existe.

**Paramètres**

- `value` : IBAN à tester, espaces tolérés.

**Retour** : `true` si `value` est un IBAN valide, `false` sinon.

**Erreurs** : aucune.

**Exemple**

```ts
import { isIban } from "@etiennea20/adr-misc";

isIban("FR76 3000 6000 0112 3456 7890 189"); // true
isIban("FR76 3000 6000 0112 3456 7890 188"); // false (clé invalide)
isIban("FR76 3000 6000 0112 3456 7890"); // false (trop court pour la France)
```

### `isIpv4`

| Champ          | Valeur                                   |
| -------------- | ---------------------------------------- |
| Catégorie      | `validation`                             |
| Point d'entrée | `@etiennea20/adr-misc`                   |
| Statut         | stable                                   |
| Depuis         | 0.2.0                                    |
| Source         | `src/validation/is-ipv4/is-ipv4.ts`      |
| Tests          | `src/validation/is-ipv4/is-ipv4.test.ts` |

**Signature**

```ts
function isIpv4(value: string): boolean;
```

**Description** : indique si une chaîne est une adresse IPv4 en notation décimale pointée. À utiliser pour valider une adresse saisie dans une configuration (liste blanche, proxy…). Les zéros non significatifs (`192.168.01.1`) et les espaces sont refusés.

**Paramètres**

- `value` : chaîne à tester.

**Retour** : `true` si `value` est une adresse IPv4 valide, `false` sinon.

**Erreurs** : aucune.

**Exemple**

```ts
import { isIpv4 } from "@etiennea20/adr-misc";

isIpv4("192.168.1.10"); // true
isIpv4("256.0.0.1"); // false
isIpv4("10.0.0"); // false
```

### `isLuhnValid`

| Champ          | Valeur                                               |
| -------------- | ---------------------------------------------------- |
| Catégorie      | `validation`                                         |
| Point d'entrée | `@etiennea20/adr-misc`                               |
| Statut         | stable                                               |
| Depuis         | 0.2.0                                                |
| Source         | `src/validation/is-luhn-valid/is-luhn-valid.ts`      |
| Tests          | `src/validation/is-luhn-valid/is-luhn-valid.test.ts` |

**Signature**

```ts
function isLuhnValid(value: string): boolean;
```

**Description** : indique si une suite de chiffres respecte l'algorithme de Luhn (clé « modulo 10 »). À utiliser pour contrôler un numéro de carte bancaire, un SIREN, un SIRET ou un IMEI avant un traitement plus coûteux. Les espaces de présentation sont ignorés ; tout autre caractère rend la chaîne invalide. Il faut au moins deux chiffres (une donnée et sa clé).

**Paramètres**

- `value` : suite de chiffres à contrôler, espaces tolérés.

**Retour** : `true` si la clé de Luhn est correcte, `false` sinon.

**Erreurs** : aucune.

**Exemple**

```ts
import { isLuhnValid } from "@etiennea20/adr-misc";

isLuhnValid("4532 0151 1283 0366"); // true
isLuhnValid("4532 0151 1283 0367"); // false
```

### `isNir`

| Champ          | Valeur                                 |
| -------------- | -------------------------------------- |
| Catégorie      | `validation`                           |
| Point d'entrée | `@etiennea20/adr-misc`                 |
| Statut         | stable                                 |
| Depuis         | 0.2.0                                  |
| Source         | `src/validation/is-nir/is-nir.ts`      |
| Tests          | `src/validation/is-nir/is-nir.test.ts` |

**Signature**

```ts
function isNir(value: string): boolean;
```

**Description** : indique si une chaîne est un numéro de sécurité sociale français (NIR) valide. À utiliser pour valider le NIR d'un agent ou d'un usager (15 caractères : 13 pour le numéro, 2 pour la clé). Vérifie la structure (sexe, mois, département) et la clé `97 - (numéro mod 97)`. Les départements corses `2A` et `2B` sont gérés (remplacés par 19 et 18 pour le calcul de la clé). Les espaces de présentation et les minuscules (`2a`) sont tolérés.

**Paramètres**

- `value` : NIR à tester, espaces tolérés.

**Retour** : `true` si `value` est un NIR valide, `false` sinon.

**Erreurs** : aucune.

**Exemple**

```ts
import { isNir } from "@etiennea20/adr-misc";

isNir("1 85 05 78 006 084 91"); // true
isNir("2 69 05 2A 004 012 28"); // true (né en Corse-du-Sud)
isNir("1 85 05 78 006 084 92"); // false (clé invalide)
```

### `isPhoneNumberFr`

| Champ          | Valeur                                                         |
| -------------- | -------------------------------------------------------------- |
| Catégorie      | `validation`                                                   |
| Point d'entrée | `@etiennea20/adr-misc`                                         |
| Statut         | stable                                                         |
| Depuis         | 0.2.0                                                          |
| Source         | `src/validation/is-phone-number-fr/is-phone-number-fr.ts`      |
| Tests          | `src/validation/is-phone-number-fr/is-phone-number-fr.test.ts` |

**Signature**

```ts
function isPhoneNumberFr(value: string): boolean;
```

**Description** : indique si une chaîne est un numéro de téléphone français (fixe, mobile ou spécial). À utiliser pour valider un numéro saisi dans un formulaire. Accepte les formats `0X`, `+33 X` et `0033 X`, avec ou sans espaces, points ou tirets de présentation (`06 12 34 56 78`, `06.12.34.56.78`, `+33 6 12 34 56 78`). Le format `+33 (0)6…` est refusé.

**Paramètres**

- `value` : chaîne à tester.

**Retour** : `true` si `value` est un numéro français valide, `false` sinon.

**Erreurs** : aucune.

**Exemple**

```ts
import { isPhoneNumberFr } from "@etiennea20/adr-misc";

isPhoneNumberFr("06 12 34 56 78"); // true
isPhoneNumberFr("+33 1 23 45 67 89"); // true
isPhoneNumberFr("06 12 34 56"); // false (trop court)
```

### `isPostalCodeFr`

| Champ          | Valeur                                                       |
| -------------- | ------------------------------------------------------------ |
| Catégorie      | `validation`                                                 |
| Point d'entrée | `@etiennea20/adr-misc`                                       |
| Statut         | stable                                                       |
| Depuis         | 0.2.0                                                        |
| Source         | `src/validation/is-postal-code-fr/is-postal-code-fr.ts`      |
| Tests          | `src/validation/is-postal-code-fr/is-postal-code-fr.test.ts` |

**Signature**

```ts
function isPostalCodeFr(value: string): boolean;
```

**Description** : indique si une chaîne est un code postal français plausible. À utiliser pour valider une adresse postale. Vérifie le format (5 chiffres) et le préfixe départemental : 01 à 95 en métropole (la Corse utilise les codes 20xxx, jamais 2A ou 2B), 971 à 978 en outre-mer, 980 (Monaco), 984, 986, 987 et 988. N'affirme pas que le code existe réellement. Les espaces ne sont pas tolérés.

**Paramètres**

- `value` : chaîne à tester.

**Retour** : `true` si `value` est un code postal français plausible, `false` sinon.

**Erreurs** : aucune.

**Exemple**

```ts
import { isPostalCodeFr } from "@etiennea20/adr-misc";

isPostalCodeFr("75001"); // true
isPostalCodeFr("20000"); // true (Ajaccio)
isPostalCodeFr("97400"); // true (La Réunion)
isPostalCodeFr("2A000"); // false
```

### `isSiren`

| Champ          | Valeur                                     |
| -------------- | ------------------------------------------ |
| Catégorie      | `validation`                               |
| Point d'entrée | `@etiennea20/adr-misc`                     |
| Statut         | stable                                     |
| Depuis         | 0.2.0                                      |
| Source         | `src/validation/is-siren/is-siren.ts`      |
| Tests          | `src/validation/is-siren/is-siren.test.ts` |

**Signature**

```ts
function isSiren(value: string): boolean;
```

**Description** : indique si une chaîne est un numéro SIREN valide (9 chiffres, clé de Luhn). À utiliser pour valider l'identifiant d'une entreprise française (fournisseur, éditeur…). Les espaces de présentation (`732 829 320`) sont tolérés. N'affirme pas que l'entreprise existe : seule la clé est vérifiée.

**Paramètres**

- `value` : numéro à tester, espaces tolérés.

**Retour** : `true` si `value` est un SIREN valide, `false` sinon.

**Erreurs** : aucune.

**Exemple**

```ts
import { isSiren } from "@etiennea20/adr-misc";

isSiren("732 829 320"); // true
isSiren("732 829 321"); // false (clé invalide)
```

### `isSiret`

| Champ          | Valeur                                     |
| -------------- | ------------------------------------------ |
| Catégorie      | `validation`                               |
| Point d'entrée | `@etiennea20/adr-misc`                     |
| Statut         | stable                                     |
| Depuis         | 0.2.0                                      |
| Source         | `src/validation/is-siret/is-siret.ts`      |
| Tests          | `src/validation/is-siret/is-siret.test.ts` |

**Signature**

```ts
function isSiret(value: string): boolean;
```

**Description** : indique si une chaîne est un numéro SIRET valide (14 chiffres, clé de Luhn). À utiliser pour valider l'identifiant d'un établissement d'entreprise française. Les espaces de présentation (`732 829 320 00074`) sont tolérés. Gère l'exception de La Poste (SIREN `356000000`) : ses établissements sont valides si la somme de leurs chiffres est un multiple de 5.

**Paramètres**

- `value` : numéro à tester, espaces tolérés.

**Retour** : `true` si `value` est un SIRET valide, `false` sinon.

**Erreurs** : aucune.

**Exemple**

```ts
import { isSiret } from "@etiennea20/adr-misc";

isSiret("732 829 320 00074"); // true
isSiret("356 000 000 49837"); // true (établissement de La Poste)
isSiret("732 829 320 00075"); // false
```

### `isStrongPassword`

| Champ          | Valeur                                                         |
| -------------- | -------------------------------------------------------------- |
| Catégorie      | `validation`                                                   |
| Point d'entrée | `@etiennea20/adr-misc`                                         |
| Statut         | stable                                                         |
| Depuis         | 0.2.0                                                          |
| Source         | `src/validation/is-strong-password/is-strong-password.ts`      |
| Tests          | `src/validation/is-strong-password/is-strong-password.test.ts` |

**Signature**

```ts
function isStrongPassword(value: string, rules?: IPasswordRules): boolean;
```

**Description** : indique si un mot de passe respecte toutes les règles de robustesse demandées. À utiliser pour valider un mot de passe à la création d'un compte ou lors de son changement. Par défaut, suit la recommandation de la CNIL : au moins 12 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial. Pour afficher une jauge ou les critères manquants, utiliser `getPasswordStrength`.

**Paramètres**

- `value` : mot de passe à tester.
- `rules` : règles de robustesse, chacune surchargeable.

**Retour** : `true` si tous les critères exigés sont respectés, `false` sinon.

**Erreurs** : aucune.

**Exemple**

```ts
import { isStrongPassword } from "@etiennea20/adr-misc";

isStrongPassword("Livre2026!Lecture"); // true
isStrongPassword("Livre2026!"); // false (moins de 12 caractères)
isStrongPassword("livre2026", {
  minLength: 8,
  requireUppercase: false,
  requireSpecialChar: false,
}); // true
```

### `isUrl`

| Champ          | Valeur                                 |
| -------------- | -------------------------------------- |
| Catégorie      | `validation`                           |
| Point d'entrée | `@etiennea20/adr-misc`                 |
| Statut         | stable                                 |
| Depuis         | 0.2.0                                  |
| Source         | `src/validation/is-url/is-url.ts`      |
| Tests          | `src/validation/is-url/is-url.test.ts` |

**Signature**

```ts
function isUrl(value: string, options?: IIsUrlOptions): boolean;
```

**Description** : indique si une chaîne est une URL absolue valide (par défaut en `http` ou `https`). À utiliser pour valider un lien saisi par un utilisateur (site web, lien vers une notice…). L'hôte doit être un nom de domaine avec extension, `localhost`, une adresse IPv4 ou une adresse IPv6 entre crochets ; le port éventuel doit être compris entre 1 et 65535. Seules les URL hiérarchiques (`protocole://hôte…`) sont reconnues : `mailto:` ou `tel:` ne le sont pas. Les espaces ne sont pas tolérés.

**Paramètres**

- `value` : chaîne à tester.
- `options` : options, dont les protocoles acceptés.

**Retour** : `true` si `value` est une URL valide avec un protocole accepté, `false` sinon.

**Erreurs** : aucune.

**Exemple**

```ts
import { isUrl } from "@etiennea20/adr-misc";

isUrl("https://bibliotheque.fr/livres?page=2"); // true
isUrl("ftp://fichiers.bibliotheque.fr"); // false
isUrl("ftp://fichiers.bibliotheque.fr", { protocols: ["ftp"] }); // true
isUrl("bibliotheque.fr"); // false (protocole absent)
```

### `isUuid`

| Champ          | Valeur                                   |
| -------------- | ---------------------------------------- |
| Catégorie      | `validation`                             |
| Point d'entrée | `@etiennea20/adr-misc`                   |
| Statut         | stable                                   |
| Depuis         | 0.2.0                                    |
| Source         | `src/validation/is-uuid/is-uuid.ts`      |
| Tests          | `src/validation/is-uuid/is-uuid.test.ts` |

**Signature**

```ts
function isUuid(value: string, version?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8): boolean;
```

**Description** : indique si une chaîne est un UUID (RFC 9562) au format canonique `8-4-4-4-12`. À utiliser pour valider un identifiant reçu d'une route ou d'une API avant de l'utiliser. Sans `version`, accepte les versions 1 à 8 (variante RFC), ainsi que l'UUID nul et l'UUID maximal. Avec `version`, n'accepte que cette version. La casse est indifférente ; les accolades et les espaces sont refusés.

**Paramètres**

- `value` : chaîne à tester.
- `version` : version attendue (1 à 8). Omise : toute version.

**Retour** : `true` si `value` est un UUID valide (de la version demandée), `false` sinon.

**Erreurs** : aucune.

**Exemple**

```ts
import { isUuid } from "@etiennea20/adr-misc";

isUuid("9b2c6f4e-3d1a-4f6b-8c2d-1e5f7a9b0c3d"); // true
isUuid("9b2c6f4e-3d1a-4f6b-8c2d-1e5f7a9b0c3d", 7); // false (c'est une v4)
isUuid("9b2c6f4e3d1a4f6b8c2d1e5f7a9b0c3d"); // false (tirets absents)
```

## url

### `buildQueryString`

| Champ          | Valeur                                                  |
| -------------- | ------------------------------------------------------- |
| Catégorie      | `url`                                                   |
| Point d'entrée | `@etiennea20/adr-misc`                                  |
| Statut         | stable                                                  |
| Depuis         | 0.2.0                                                   |
| Source         | `src/url/build-query-string/build-query-string.ts`      |
| Tests          | `src/url/build-query-string/build-query-string.test.ts` |

**Signature**

```ts
function buildQueryString(params: QueryParams, options?: IBuildQueryStringOptions): string;
```

**Description** : construit une query string à partir d'un objet de paramètres. À utiliser pour préparer les paramètres d'un appel d'API ou d'un lien filtré (recherche, pagination). Les valeurs `null` et `undefined` sont ignorées (ce qui permet de passer directement un objet de filtres partiellement rempli), les booléens et nombres sont convertis en texte, les dates en ISO 8601 (UTC). Clés et valeurs sont encodées avec `encodeURIComponent` (espace encodé `%20`). L'ordre des clés est conservé.

**Paramètres**

- `params` : paramètres à sérialiser.
- `options` : format des tableaux et préfixe `?`.

**Retour** : la query string, sans `?` initial par défaut ; chaîne vide si aucun paramètre.

**Erreurs** : `RangeError` si une valeur est une date invalide.

**Exemple**

```ts
import { buildQueryString } from "@etiennea20/adr-misc";

buildQueryString({
  q: "Victor Hugo",
  page: 2,
  genre: ["roman", "poésie"],
  auteur: undefined,
});
// "q=Victor%20Hugo&page=2&genre=roman&genre=po%C3%A9sie"
buildQueryString({ genre: ["roman", "bd"] }, { arrayFormat: "brackets", addQueryPrefix: true });
// "?genre[]=roman&genre[]=bd"
```

### `buildUrl`

| Champ          | Valeur                                |
| -------------- | ------------------------------------- |
| Catégorie      | `url`                                 |
| Point d'entrée | `@etiennea20/adr-misc`                |
| Statut         | stable                                |
| Depuis         | 0.2.0                                 |
| Source         | `src/url/build-url/build-url.ts`      |
| Tests          | `src/url/build-url/build-url.test.ts` |

**Signature**

```ts
function buildUrl(
  base: string,
  path?: string,
  params?: QueryParams,
  options?: IBuildQueryStringOptions,
): string;
```

**Description** : construit une URL complète à partir d'une base, d'un chemin et de paramètres de query. À utiliser pour préparer l'URL d'un appel d'API ou d'un lien en une seule instruction. Le chemin est assemblé avec `joinUrl` (un seul `/` à la jonction) et les paramètres avec `buildQueryString` (valeurs `null` et `undefined` ignorées). Si la base contient déjà une query string, les paramètres y sont ajoutés avec `&`. Une base contenant un fragment (`#…`) n'est pas prise en charge.

**Paramètres**

- `base` : URL ou chemin de base (`https://api.bibliotheque.fr`, `/api`).
- `path` : chemin à ajouter à la base (facultatif).
- `params` : paramètres de query (facultatifs).
- `options` : format des tableaux (l'option `addQueryPrefix` est ignorée).

**Retour** : l'URL construite.

**Erreurs** : `RangeError` si un paramètre est une date invalide.

**Exemple**

```ts
import { buildUrl } from "@etiennea20/adr-misc";

buildUrl("https://api.bibliotheque.fr/", "/livres", {
  q: "Hugo",
  page: 2,
  genre: undefined,
});
// "https://api.bibliotheque.fr/livres?q=Hugo&page=2"
buildUrl("/api/livres?tri=titre", undefined, { page: 3 }); // "/api/livres?tri=titre&page=3"
```

### `getUrlParts`

| Champ          | Valeur                                        |
| -------------- | --------------------------------------------- |
| Catégorie      | `url`                                         |
| Point d'entrée | `@etiennea20/adr-misc`                        |
| Statut         | stable                                        |
| Depuis         | 0.2.0                                         |
| Source         | `src/url/get-url-parts/get-url-parts.ts`      |
| Tests          | `src/url/get-url-parts/get-url-parts.test.ts` |

**Signature**

```ts
function getUrlParts(url: string): IUrlParts;
```

**Description** : découpe une URL en composants (protocole, hôte, port, chemin, query, fragment), sans dépendre de l'API `URL`. À utiliser pour lire une partie d'une URL (hôte d'un lien externe, query d'une URL reçue) dans un code qui doit tourner sans `URL` ni DOM. Ne lève jamais d'erreur et ne valide pas l'URL (utiliser `isUrl` pour cela) : une URL relative donne un protocole et un hôte vides. Les composants ne sont ni décodés ni normalisés (hormis la casse du protocole et du nom d'hôte) ; les identifiants (`utilisateur:secret@`) sont écartés.

**Paramètres**

- `url` : URL absolue ou relative à découper.

**Retour** : les composants de l'URL, `""` pour ceux qui sont absents.

**Erreurs** : aucune.

**Exemple**

```ts
import { getUrlParts } from "@etiennea20/adr-misc";

getUrlParts("https://api.bibliotheque.fr:8443/livres?page=2#resultats");
// { protocol: "https", host: "api.bibliotheque.fr:8443", hostname: "api.bibliotheque.fr",
//   port: "8443", pathname: "/livres", query: "page=2", hash: "resultats" }
getUrlParts("/livres?page=2").query; // "page=2"
```

### `IBuildQueryStringOptions`

| Champ          | Valeur                                                  |
| -------------- | ------------------------------------------------------- |
| Catégorie      | `url`                                                   |
| Point d'entrée | `@etiennea20/adr-misc`                                  |
| Statut         | stable                                                  |
| Depuis         | 0.2.0                                                   |
| Source         | `src/url/build-query-string/build-query-string.ts`      |
| Tests          | `src/url/build-query-string/build-query-string.test.ts` |

**Signature**

```ts
interface IBuildQueryStringOptions {
  arrayFormat?: "repeat" | "brackets" | "comma";
  addQueryPrefix?: boolean;
}
```

**Description** : options de `buildQueryString` (et de `buildUrl`).

**Membres**

- `arrayFormat` : sérialisation des tableaux : `"repeat"` (`tag=a&tag=b`), `"brackets"` (`tag[]=a&tag[]=b`) ou `"comma"` (`tag=a,b`). Par défaut : `"repeat"`.
- `addQueryPrefix` : préfixer le résultat par `?` (seulement s'il n'est pas vide). Par défaut : false.

**Exemple**

```ts
import type { IBuildQueryStringOptions } from "@etiennea20/adr-misc";

const options: IBuildQueryStringOptions = {
  arrayFormat: "brackets",
  addQueryPrefix: true,
};
```

### `isAbsoluteUrl`

| Champ          | Valeur                                            |
| -------------- | ------------------------------------------------- |
| Catégorie      | `url`                                             |
| Point d'entrée | `@etiennea20/adr-misc`                            |
| Statut         | stable                                            |
| Depuis         | 0.2.0                                             |
| Source         | `src/url/is-absolute-url/is-absolute-url.ts`      |
| Tests          | `src/url/is-absolute-url/is-absolute-url.test.ts` |

**Signature**

```ts
function isAbsoluteUrl(value: string): boolean;
```

**Description** : indique si une chaîne est une URL absolue, c'est-à-dire qui commence par un protocole (`https:`, `mailto:`, `data:`…). À utiliser pour décider s'il faut préfixer un lien par l'URL de base de l'application ou de l'API. Une URL relative au protocole (`//cdn.fr/x.js`), un chemin (`/livres`, `livres`) ou un chemin Windows (`C:\…`) n'est pas absolu. Attention : `localhost:3000` est vu comme une URL absolue de protocole `localhost`, comme le ferait un navigateur.

**Paramètres**

- `value` : chaîne à tester.

**Retour** : `true` si `value` commence par un protocole, `false` sinon.

**Erreurs** : aucune.

**Exemple**

```ts
import { isAbsoluteUrl } from "@etiennea20/adr-misc";

isAbsoluteUrl("https://bibliotheque.fr/livres"); // true
isAbsoluteUrl("mailto:contact@bibliotheque.fr"); // true
isAbsoluteUrl("/livres/42"); // false
isAbsoluteUrl("//cdn.bibliotheque.fr/logo.svg"); // false
```

### `IUrlParts`

| Champ          | Valeur                                        |
| -------------- | --------------------------------------------- |
| Catégorie      | `url`                                         |
| Point d'entrée | `@etiennea20/adr-misc`                        |
| Statut         | stable                                        |
| Depuis         | 0.2.0                                         |
| Source         | `src/url/get-url-parts/get-url-parts.ts`      |
| Tests          | `src/url/get-url-parts/get-url-parts.test.ts` |

**Signature**

```ts
interface IUrlParts {
  protocol: string;
  host: string;
  hostname: string;
  port: string;
  pathname: string;
  query: string;
  hash: string;
}
```

**Description** : composants d'une URL, renvoyés par `getUrlParts`. Un composant absent vaut `""`.

**Membres**

- `protocol` : protocole en minuscules, sans `:` (`"https"`).
- `host` : hôte avec le port éventuel, sans identifiants (`"api.bibliotheque.fr:8443"`).
- `hostname` : nom d'hôte seul, en minuscules (`"api.bibliotheque.fr"`, `"[::1]"`).
- `port` : port tel qu'écrit dans l'URL, sans `:` (`"8443"`).
- `pathname` : chemin, non décodé (`"/livres/42"`).
- `query` : query string sans `?`, non décodée (à passer à `parseQueryString`).
- `hash` : fragment sans `#`, non décodé.

**Exemple**

```ts
import type { IUrlParts } from "@etiennea20/adr-misc";

const parts: IUrlParts = {
  protocol: "https",
  host: "api.bibliotheque.fr:8443",
  hostname: "api.bibliotheque.fr",
  port: "8443",
  pathname: "/livres",
  query: "page=2",
  hash: "resultats",
};
```

### `joinUrl`

| Champ          | Valeur                              |
| -------------- | ----------------------------------- |
| Catégorie      | `url`                               |
| Point d'entrée | `@etiennea20/adr-misc`              |
| Statut         | stable                              |
| Depuis         | 0.2.0                               |
| Source         | `src/url/join-url/join-url.ts`      |
| Tests          | `src/url/join-url/join-url.test.ts` |

**Signature**

```ts
function joinUrl(...segments: string[]): string;
```

**Description** : assemble des segments d'URL ou de chemin avec exactement un `/` entre chacun. À utiliser pour construire l'URL d'un appel d'API à partir d'une base configurable et de segments (`joinUrl(apiBaseUrl, "livres", id)`) sans se soucier des `/` en double ou manquants. Seuls les `/` aux jonctions sont normalisés : le `//` du protocole (`https://`) et ceux internes à un segment sont conservés, de même que le `/` initial du premier segment et le `/` final du dernier. Les segments vides sont ignorés. Les segments ne sont pas encodés : utiliser `encodeURIComponent` pour une valeur saisie.

**Paramètres**

- `segments` : segments à assembler, dans l'ordre.

**Retour** : l'URL ou le chemin assemblé ; chaîne vide si aucun segment n'est fourni.

**Erreurs** : aucune.

**Exemple**

```ts
import { joinUrl } from "@etiennea20/adr-misc";

joinUrl("https://api.bibliotheque.fr/", "/v1/", "livres", "42"); // "https://api.bibliotheque.fr/v1/livres/42"
joinUrl("/api", "adherents/"); // "/api/adherents/"
```

### `ParsedQueryString`

| Champ          | Valeur                                                  |
| -------------- | ------------------------------------------------------- |
| Catégorie      | `url`                                                   |
| Point d'entrée | `@etiennea20/adr-misc`                                  |
| Statut         | stable                                                  |
| Depuis         | 0.2.0                                                   |
| Source         | `src/url/parse-query-string/parse-query-string.ts`      |
| Tests          | `src/url/parse-query-string/parse-query-string.test.ts` |

**Signature**

```ts
type ParsedQueryString = Record<string, string | string[]>;
```

**Description** : résultat de `parseQueryString` : une chaîne par clé, ou un tableau quand la clé est répétée ou suffixée par `[]`.

**Exemple**

```ts
import type { ParsedQueryString } from "@etiennea20/adr-misc";

const parsed: ParsedQueryString = { q: "Hugo", genre: ["roman", "bd"] };
```

### `parseQueryString`

| Champ          | Valeur                                                  |
| -------------- | ------------------------------------------------------- |
| Catégorie      | `url`                                                   |
| Point d'entrée | `@etiennea20/adr-misc`                                  |
| Statut         | stable                                                  |
| Depuis         | 0.2.0                                                   |
| Source         | `src/url/parse-query-string/parse-query-string.ts`      |
| Tests          | `src/url/parse-query-string/parse-query-string.test.ts` |

**Signature**

```ts
function parseQueryString(query: string): ParsedQueryString;
```

**Description** : analyse une query string et renvoie ses paramètres décodés. À utiliser pour lire les filtres d'un lien partagé ou d'une URL reçue côté serveur, sans dépendre de `URLSearchParams`. Le `?` initial est facultatif. Une clé répétée (`genre=a&genre=b`) ou suffixée par `[]` (`genre[]=a`) donne un tableau ; une clé sans `=` donne une chaîne vide. `+` est décodé en espace. Un encodage invalide est conservé tel quel (aucune exception). Les valeurs ne sont pas converties : tout reste du texte.

**Paramètres**

- `query` : query string à analyser, avec ou sans `?` initial.

**Retour** : un objet clé → valeur (ou tableau de valeurs), sans prototype hérité exploitable.

**Erreurs** : aucune.

**Exemple**

```ts
import { parseQueryString } from "@etiennea20/adr-misc";

parseQueryString("?q=Victor+Hugo&genre=roman&genre=po%C3%A9sie&page=2");
// { q: "Victor Hugo", genre: ["roman", "poésie"], page: "2" }
parseQueryString("genre[]=roman"); // { genre: ["roman"] }
```

### `QueryParams`

| Champ          | Valeur                                                  |
| -------------- | ------------------------------------------------------- |
| Catégorie      | `url`                                                   |
| Point d'entrée | `@etiennea20/adr-misc`                                  |
| Statut         | stable                                                  |
| Depuis         | 0.2.0                                                   |
| Source         | `src/url/build-query-string/build-query-string.ts`      |
| Tests          | `src/url/build-query-string/build-query-string.test.ts` |

**Signature**

```ts
type QueryParams = Readonly<Record<string, QueryParamValue | readonly QueryParamValue[]>>;
```

**Description** : paramètres d'une query string : chaque clé porte une valeur simple ou un tableau de valeurs.

**Exemple**

```ts
import type { QueryParams } from "@etiennea20/adr-misc";

const params: QueryParams = {
  q: "Hugo",
  page: 2,
  genre: ["roman", "poésie"],
  auteur: undefined,
};
```

### `QueryParamValue`

| Champ          | Valeur                                                  |
| -------------- | ------------------------------------------------------- |
| Catégorie      | `url`                                                   |
| Point d'entrée | `@etiennea20/adr-misc`                                  |
| Statut         | stable                                                  |
| Depuis         | 0.2.0                                                   |
| Source         | `src/url/build-query-string/build-query-string.ts`      |
| Tests          | `src/url/build-query-string/build-query-string.test.ts` |

**Signature**

```ts
type QueryParamValue = string | number | boolean | Date | null | undefined;
```

**Description** : valeur simple d'un paramètre de query string. `null` et `undefined` sont ignorés par `buildQueryString` ; une `Date` est sérialisée en ISO 8601.

**Exemple**

```ts
import type { QueryParamValue } from "@etiennea20/adr-misc";

const value: QueryParamValue = new Date(2026, 9, 28);
```

## file

### `changeFileExtension`

| Champ          | Valeur                                                         |
| -------------- | -------------------------------------------------------------- |
| Catégorie      | `file`                                                         |
| Point d'entrée | `@etiennea20/adr-misc`                                         |
| Statut         | stable                                                         |
| Depuis         | 0.2.0                                                          |
| Source         | `src/file/change-file-extension/change-file-extension.ts`      |
| Tests          | `src/file/change-file-extension/change-file-extension.test.ts` |

**Signature**

```ts
function changeFileExtension(fileName: string, extension: string): string;
```

**Description** : remplace (ou ajoute) l'extension d'un nom ou d'un chemin de fichier. À utiliser pour nommer un fichier converti (export PDF d'un document, miniature WebP d'une image). Le dossier est conservé ; seule la dernière extension est remplacée (`archive.tar.gz` devient `archive.tar.zip`). L'extension peut être donnée avec ou sans point ; une extension vide retire l'extension existante. La casse fournie est conservée.

**Paramètres**

- `fileName` : nom ou chemin du fichier.
- `extension` : nouvelle extension (`"pdf"` ou `".pdf"`), ou `""` pour la retirer.

**Retour** : le nom ou chemin avec la nouvelle extension.

**Erreurs** : aucune.

**Exemple**

```ts
import { changeFileExtension } from "@etiennea20/adr-misc";

changeFileExtension("exports/catalogue.docx", "pdf"); // "exports/catalogue.pdf"
changeFileExtension("couverture.png", ".webp"); // "couverture.webp"
changeFileExtension("LISEZMOI", "md"); // "LISEZMOI.md"
changeFileExtension("notes.txt", ""); // "notes"
```

### `getFileBaseName`

| Champ          | Valeur                                                   |
| -------------- | -------------------------------------------------------- |
| Catégorie      | `file`                                                   |
| Point d'entrée | `@etiennea20/adr-misc`                                   |
| Statut         | stable                                                   |
| Depuis         | 0.2.0                                                    |
| Source         | `src/file/get-file-base-name/get-file-base-name.ts`      |
| Tests          | `src/file/get-file-base-name/get-file-base-name.test.ts` |

**Signature**

```ts
function getFileBaseName(path: string): string;
```

**Description** : renvoie le nom d'un fichier sans son dossier ni sa dernière extension. À utiliser pour proposer un titre par défaut à partir d'un fichier téléversé (`rapport-2026.pdf` donne `rapport-2026`) ou pour construire un nom dérivé. Accepte `/` et `\` comme séparateurs. Seule la dernière extension est retirée (`archive.tar.gz` donne `archive.tar`) ; un fichier caché (`.env`) est renvoyé tel quel.

**Paramètres**

- `path` : chemin ou nom du fichier.

**Retour** : le nom sans dossier ni extension, ou `""` si le chemin est vide.

**Erreurs** : aucune.

**Exemple**

```ts
import { getFileBaseName } from "@etiennea20/adr-misc";

getFileBaseName("/uploads/2026/couverture.jpg"); // "couverture"
getFileBaseName("C:\\Documents\\archive.tar.gz"); // "archive.tar"
getFileBaseName(".env"); // ".env"
```

### `getFileExtension`

| Champ          | Valeur                                                   |
| -------------- | -------------------------------------------------------- |
| Catégorie      | `file`                                                   |
| Point d'entrée | `@etiennea20/adr-misc`                                   |
| Statut         | stable                                                   |
| Depuis         | 0.2.0                                                    |
| Source         | `src/file/get-file-extension/get-file-extension.ts`      |
| Tests          | `src/file/get-file-extension/get-file-extension.test.ts` |

**Signature**

```ts
function getFileExtension(fileName: string): string;
```

**Description** : renvoie l'extension d'un fichier, en minuscules et sans le point. À utiliser pour choisir une icône, filtrer des fichiers par type ou contrôler l'extension d'un fichier téléversé. Seule la dernière extension est renvoyée (`archive.tar.gz` donne `gz`) ; un fichier caché sans autre point (`.env`) n'a pas d'extension. Accepte un chemin complet (`/` ou `\`).

**Paramètres**

- `fileName` : nom ou chemin du fichier.

**Retour** : l'extension en minuscules sans point, ou `""` si le fichier n'en a pas.

**Erreurs** : aucune.

**Exemple**

```ts
import { getFileExtension } from "@etiennea20/adr-misc";

getFileExtension("Couverture.JPG"); // "jpg"
getFileExtension("archive.tar.gz"); // "gz"
getFileExtension(".env"); // ""
```

### `getFileName`

| Champ          | Valeur                                         |
| -------------- | ---------------------------------------------- |
| Catégorie      | `file`                                         |
| Point d'entrée | `@etiennea20/adr-misc`                         |
| Statut         | stable                                         |
| Depuis         | 0.2.0                                          |
| Source         | `src/file/get-file-name/get-file-name.ts`      |
| Tests          | `src/file/get-file-name/get-file-name.test.ts` |

**Signature**

```ts
function getFileName(path: string): string;
```

**Description** : renvoie le nom d'un fichier (avec son extension) à partir d'un chemin, sans le dossier. À utiliser pour afficher le nom d'une pièce jointe ou d'un fichier téléversé dont on ne connaît que le chemin. Accepte `/` et `\` comme séparateurs (chemins Unix et Windows) et ignore les séparateurs finaux. N'accède jamais au système de fichiers.

**Paramètres**

- `path` : chemin ou nom de fichier.

**Retour** : le nom du fichier, ou `""` si le chemin est vide.

**Erreurs** : aucune.

**Exemple**

```ts
import { getFileName } from "@etiennea20/adr-misc";

getFileName("/uploads/2026/couverture.jpg"); // "couverture.jpg"
getFileName("C:\\Users\\lecteur\\liste.pdf"); // "liste.pdf"
```

### `getMimeType`

| Champ          | Valeur                                         |
| -------------- | ---------------------------------------------- |
| Catégorie      | `file`                                         |
| Point d'entrée | `@etiennea20/adr-misc`                         |
| Statut         | stable                                         |
| Depuis         | 0.2.0                                          |
| Source         | `src/file/get-mime-type/get-mime-type.ts`      |
| Tests          | `src/file/get-mime-type/get-mime-type.test.ts` |

**Signature**

```ts
function getMimeType(fileName: string): string;
```

**Description** : renvoie le type MIME correspondant à l'extension d'un fichier. À utiliser pour renseigner l'en-tête `Content-Type` d'un téléchargement ou le type d'un `Blob` quand seul le nom du fichier est connu. Couvre les extensions courantes (documents bureautiques et OpenDocument, PDF, images, audio, vidéo, polices, archives, web) ; la casse de l'extension est indifférente. Le type est déduit du nom, pas du contenu : ne pas s'en servir comme contrôle de sécurité d'un fichier téléversé.

**Paramètres**

- `fileName` : nom ou chemin du fichier.

**Retour** : le type MIME, ou `"application/octet-stream"` si l'extension est inconnue ou absente.

**Erreurs** : aucune.

**Exemple**

```ts
import { getMimeType } from "@etiennea20/adr-misc";

getMimeType("notice.pdf"); // "application/pdf"
getMimeType("Couverture.JPG"); // "image/jpeg"
getMimeType("donnees.bin"); // "application/octet-stream"
```

### `ISanitizeFileNameOptions`

| Champ          | Valeur                                                   |
| -------------- | -------------------------------------------------------- |
| Catégorie      | `file`                                                   |
| Point d'entrée | `@etiennea20/adr-misc`                                   |
| Statut         | stable                                                   |
| Depuis         | 0.2.0                                                    |
| Source         | `src/file/sanitize-file-name/sanitize-file-name.ts`      |
| Tests          | `src/file/sanitize-file-name/sanitize-file-name.test.ts` |

**Signature**

```ts
interface ISanitizeFileNameOptions {
  replacement?: string;
  maxLength?: number;
}
```

**Description** : options de `sanitizeFileName`. `replacement` est le texte qui remplace chaque caractère interdit (`"_"` par défaut ; `""` les supprime) ; `maxLength` est la longueur maximale du nom renvoyé, en caractères (`255` par défaut), l'extension étant conservée si possible.

**Exemple**

```ts
import type { ISanitizeFileNameOptions } from "@etiennea20/adr-misc";

const options: ISanitizeFileNameOptions = { replacement: "-", maxLength: 100 };
```

### `isImageFile`

| Champ          | Valeur                                         |
| -------------- | ---------------------------------------------- |
| Catégorie      | `file`                                         |
| Point d'entrée | `@etiennea20/adr-misc`                         |
| Statut         | stable                                         |
| Depuis         | 0.2.0                                          |
| Source         | `src/file/is-image-file/is-image-file.ts`      |
| Tests          | `src/file/is-image-file/is-image-file.test.ts` |

**Signature**

```ts
function isImageFile(fileName: string): boolean;
```

**Description** : indique si un fichier est une image, d'après son extension. À utiliser pour décider d'afficher un aperçu ou une icône générique dans une liste de pièces jointes. Reconnaît les extensions d'image connues de `getMimeType` (`jpg`, `jpeg`, `png`, `gif`, `webp`, `avif`, `svg`, `bmp`, `ico`, `tif`, `tiff`, `heic`), sans tenir compte de la casse. Le contenu du fichier n'est pas examiné.

**Paramètres**

- `fileName` : nom ou chemin du fichier.

**Retour** : `true` si l'extension correspond à un type MIME `image/*`, `false` sinon.

**Erreurs** : aucune.

**Exemple**

```ts
import { isImageFile } from "@etiennea20/adr-misc";

isImageFile("couverture.WEBP"); // true
isImageFile("notice.pdf"); // false
```

### `sanitizeFileName`

| Champ          | Valeur                                                   |
| -------------- | -------------------------------------------------------- |
| Catégorie      | `file`                                                   |
| Point d'entrée | `@etiennea20/adr-misc`                                   |
| Statut         | stable                                                   |
| Depuis         | 0.2.0                                                    |
| Source         | `src/file/sanitize-file-name/sanitize-file-name.ts`      |
| Tests          | `src/file/sanitize-file-name/sanitize-file-name.test.ts` |

**Signature**

```ts
function sanitizeFileName(fileName: string, options?: ISanitizeFileNameOptions): string;
```

**Description** : transforme un texte libre en nom de fichier valide sous Windows, macOS et Linux. À utiliser pour nommer un fichier exporté à partir d'une donnée saisie (titre d'un livre, nom d'un adhérent) ou pour assainir le nom d'un fichier téléversé avant de l'enregistrer. Remplace les caractères interdits (`< > : " / \ | ? *` et caractères de contrôle), retire les espaces de début et de fin ainsi que les points et espaces finaux, préfixe d'un `_` les noms réservés par Windows (`CON`, `NUL`, `COM1`…) et limite la longueur en conservant l'extension. Les accents et les autres caractères Unicode sont conservés.

**Paramètres**

- `fileName` : nom de fichier ou texte libre à assainir (pas un chemin : `/` et `\` sont remplacés).
- `options` : caractère de remplacement (`replacement`, défaut `"_"`) et longueur maximale (`maxLength`, défaut `255`).

**Retour** : le nom assaini, ou `""` s'il ne reste aucun caractère utilisable.

**Erreurs** : `RangeError` si `replacement` contient un caractère interdit, ou si `maxLength` n'est pas un entier strictement positif.

**Exemple**

```ts
import { sanitizeFileName } from "@etiennea20/adr-misc";

sanitizeFileName('Rapport : "Retards" 2026/10.pdf'); // "Rapport _ _Retards_ 2026_10.pdf"
sanitizeFileName("Qui a peur ?.txt", { replacement: "" }); // "Qui a peur .txt"
sanitizeFileName("  notes.  "); // "notes"
sanitizeFileName("CON.txt"); // "_CON.txt"
```

## color

### `darkenColor`

| Champ          | Valeur                                        |
| -------------- | --------------------------------------------- |
| Catégorie      | `color`                                       |
| Point d'entrée | `@etiennea20/adr-misc`                        |
| Statut         | stable                                        |
| Depuis         | 0.2.0                                         |
| Source         | `src/color/darken-color/darken-color.ts`      |
| Tests          | `src/color/darken-color/darken-color.test.ts` |

**Signature**

```ts
function darkenColor(hex: string, amount: number): string;
```

**Description** : assombrit une couleur en la mélangeant avec du noir. À utiliser pour dériver une teinte foncée d'une couleur de thème (bordure, état actif d'un bouton). L'opacité d'origine est conservée.

**Paramètres**

- `hex` : couleur hexadécimale à assombrir.
- `amount` : part de noir, de 0 (inchangée) à 1 (noir).

**Retour** : la couleur assombrie au format `#rrggbb` (ou `#rrggbbaa`).

**Erreurs** : `RangeError` si `amount` n'est pas entre 0 et 1 ; `Error` si `hex` n'est pas une couleur hexadécimale valide.

**Exemple**

```ts
import { darkenColor } from "@etiennea20/adr-misc";

darkenColor("#2563eb", 0.2); // "#1e4fbc"
darkenColor("#2563eb", 1); // "#000000"
```

### `getContrastRatio`

| Champ          | Valeur                                                    |
| -------------- | --------------------------------------------------------- |
| Catégorie      | `color`                                                   |
| Point d'entrée | `@etiennea20/adr-misc`                                    |
| Statut         | stable                                                    |
| Depuis         | 0.2.0                                                     |
| Source         | `src/color/get-contrast-ratio/get-contrast-ratio.ts`      |
| Tests          | `src/color/get-contrast-ratio/get-contrast-ratio.test.ts` |

**Signature**

```ts
function getContrastRatio(first: string, second: string): number;
```

**Description** : calcule le rapport de contraste WCAG 2.x entre deux couleurs, pour vérifier l'accessibilité d'un couple texte / fond (AA : 4,5 pour un texte courant, 3 pour un grand texte ; AAA : 7 et 4,5). L'ordre des couleurs est indifférent et l'opacité est ignorée.

**Paramètres**

- `first` : première couleur hexadécimale.
- `second` : seconde couleur hexadécimale.

**Retour** : le rapport de contraste, de 1 (couleurs identiques) à 21 (noir sur blanc), non arrondi.

**Erreurs** : `Error` si l'une des couleurs n'est pas hexadécimale.

**Exemple**

```ts
import { getContrastRatio } from "@etiennea20/adr-misc";

getContrastRatio("#000000", "#ffffff"); // 21
getContrastRatio("#2563eb", "#ffffff") >= 4.5; // true (environ 5,17 : conforme AA)
```

### `getLuminance`

| Champ          | Valeur                                          |
| -------------- | ----------------------------------------------- |
| Catégorie      | `color`                                         |
| Point d'entrée | `@etiennea20/adr-misc`                          |
| Statut         | stable                                          |
| Depuis         | 0.2.0                                           |
| Source         | `src/color/get-luminance/get-luminance.ts`      |
| Tests          | `src/color/get-luminance/get-luminance.test.ts` |

**Signature**

```ts
function getLuminance(hex: string): number;
```

**Description** : calcule la luminance relative d'une couleur au sens des WCAG 2.x, pour comparer la clarté perçue de couleurs ou calculer un contraste (voir `getContrastRatio`). L'opacité est ignorée : la couleur est considérée comme opaque.

**Paramètres**

- `hex` : couleur hexadécimale.

**Retour** : la luminance relative, de 0 (noir) à 1 (blanc).

**Erreurs** : `Error` si `hex` n'est pas une couleur hexadécimale valide.

**Exemple**

```ts
import { getLuminance } from "@etiennea20/adr-misc";

getLuminance("#ffffff"); // 1
getLuminance("#000000"); // 0
getLuminance("#2563eb"); // 0.1532… (environ)
```

### `getReadableTextColor`

| Champ          | Valeur                                                              |
| -------------- | ------------------------------------------------------------------- |
| Catégorie      | `color`                                                             |
| Point d'entrée | `@etiennea20/adr-misc`                                              |
| Statut         | stable                                                              |
| Depuis         | 0.2.0                                                               |
| Source         | `src/color/get-readable-text-color/get-readable-text-color.ts`      |
| Tests          | `src/color/get-readable-text-color/get-readable-text-color.test.ts` |

**Signature**

```ts
function getReadableTextColor(background: string, options?: IReadableTextColorOptions): string;
```

**Description** : choisit, entre une couleur de texte claire et une sombre, celle qui contraste le plus avec un fond. À utiliser quand le fond est variable (couleur d'une catégorie, avatar généré par `stringToColor`, étiquette choisie par l'utilisateur). En cas d'égalité, la couleur sombre est retenue. Le résultat n'est pas garanti conforme AA : le vérifier avec `getContrastRatio` si besoin.

**Paramètres**

- `background` : couleur de fond hexadécimale.
- `options` : couleurs candidates (voir `IReadableTextColorOptions`).

**Retour** : `options.light` ou `options.dark`, telle que fournie (par défaut `"#ffffff"` ou `"#000000"`).

**Erreurs** : `Error` si le fond ou une couleur candidate n'est pas hexadécimale.

**Exemple**

```ts
import { getReadableTextColor } from "@etiennea20/adr-misc";

getReadableTextColor("#2563eb"); // "#ffffff"
getReadableTextColor("#fde047"); // "#000000"
```

### `hexToRgb`

| Champ          | Valeur                                    |
| -------------- | ----------------------------------------- |
| Catégorie      | `color`                                   |
| Point d'entrée | `@etiennea20/adr-misc`                    |
| Statut         | stable                                    |
| Depuis         | 0.2.0                                     |
| Source         | `src/color/hex-to-rgb/hex-to-rgb.ts`      |
| Tests          | `src/color/hex-to-rgb/hex-to-rgb.test.ts` |

**Signature**

```ts
function hexToRgb(hex: string): IRgbColor;
```

**Description** : décompose une couleur hexadécimale en composantes RVB (et opacité), pour calculer sur une couleur saisie ou stockée en hexadécimal. Accepte `#rgb`, `#rgba`, `#rrggbb` et `#rrggbbaa`, en majuscules ou minuscules, avec ou sans `#`.

**Paramètres**

- `hex` : couleur hexadécimale, par exemple `"#2563eb"` ou `"#fff"`.

**Retour** : les composantes `r`, `g`, `b` (0 à 255) et `a` (0 à 1, arrondie à 3 décimales) seulement si la couleur précise une opacité.

**Erreurs** : `Error` si `hex` n'est pas une couleur hexadécimale valide.

**Exemple**

```ts
import { hexToRgb } from "@etiennea20/adr-misc";

hexToRgb("#2563eb"); // { r: 37, g: 99, b: 235 }
hexToRgb("#fff"); // { r: 255, g: 255, b: 255 }
hexToRgb("#00000080"); // { r: 0, g: 0, b: 0, a: 0.502 }
```

### `IReadableTextColorOptions`

| Champ          | Valeur                                                              |
| -------------- | ------------------------------------------------------------------- |
| Catégorie      | `color`                                                             |
| Point d'entrée | `@etiennea20/adr-misc`                                              |
| Statut         | stable                                                              |
| Depuis         | 0.2.0                                                               |
| Source         | `src/color/get-readable-text-color/get-readable-text-color.ts`      |
| Tests          | `src/color/get-readable-text-color/get-readable-text-color.test.ts` |

**Signature**

```ts
interface IReadableTextColorOptions {
  light?: string;
  dark?: string;
}
```

**Description** : options de `getReadableTextColor` : couleurs de texte candidates, claire (`light`, défaut `"#ffffff"`) et sombre (`dark`, défaut `"#000000"`), en hexadécimal. Elles sont renvoyées telles que fournies.

**Exemple**

```ts
import { getReadableTextColor, type IReadableTextColorOptions } from "@etiennea20/adr-misc";

const options: IReadableTextColorOptions = {
  light: "#f8fafc",
  dark: "#0f172a",
};
getReadableTextColor("#2563eb", options); // "#f8fafc"
```

### `IRgbColor`

| Champ          | Valeur                                    |
| -------------- | ----------------------------------------- |
| Catégorie      | `color`                                   |
| Point d'entrée | `@etiennea20/adr-misc`                    |
| Statut         | stable                                    |
| Depuis         | 0.2.0                                     |
| Source         | `src/color/hex-to-rgb/hex-to-rgb.ts`      |
| Tests          | `src/color/hex-to-rgb/hex-to-rgb.test.ts` |

**Signature**

```ts
interface IRgbColor {
  r: number;
  g: number;
  b: number;
  a?: number;
}
```

**Description** : couleur décomposée en composantes rouge, verte, bleue (0 à 255) et opacité facultative (0 à 1, absente : opaque). Format d'échange de la catégorie : produit par `hexToRgb`, consommé par `rgbToHex`.

**Exemple**

```ts
import { rgbToHex, type IRgbColor } from "@etiennea20/adr-misc";

const overlay: IRgbColor = { r: 0, g: 0, b: 0, a: 0.5 };
rgbToHex(overlay); // "#00000080"
```

### `IStringToColorOptions`

| Champ          | Valeur                                              |
| -------------- | --------------------------------------------------- |
| Catégorie      | `color`                                             |
| Point d'entrée | `@etiennea20/adr-misc`                              |
| Statut         | stable                                              |
| Depuis         | 0.2.0                                               |
| Source         | `src/color/string-to-color/string-to-color.ts`      |
| Tests          | `src/color/string-to-color/string-to-color.test.ts` |

**Signature**

```ts
interface IStringToColorOptions {
  saturation?: number;
  lightness?: number;
}
```

**Description** : options de `stringToColor` : saturation HSL (`saturation`, en pourcentage, défaut `65`) et luminosité HSL (`lightness`, en pourcentage, défaut `45`), communes à toutes les couleurs produites.

**Exemple**

```ts
import { stringToColor, type IStringToColorOptions } from "@etiennea20/adr-misc";

const pastel: IStringToColorOptions = { saturation: 60, lightness: 85 };
stringToColor("Science-fiction", pastel);
```

### `lightenColor`

| Champ          | Valeur                                          |
| -------------- | ----------------------------------------------- |
| Catégorie      | `color`                                         |
| Point d'entrée | `@etiennea20/adr-misc`                          |
| Statut         | stable                                          |
| Depuis         | 0.2.0                                           |
| Source         | `src/color/lighten-color/lighten-color.ts`      |
| Tests          | `src/color/lighten-color/lighten-color.test.ts` |

**Signature**

```ts
function lightenColor(hex: string, amount: number): string;
```

**Description** : éclaircit une couleur en la mélangeant avec du blanc. À utiliser pour dériver une teinte claire d'une couleur de thème (fond d'une étiquette, état survolé, ligne surlignée). L'opacité d'origine est conservée.

**Paramètres**

- `hex` : couleur hexadécimale à éclaircir.
- `amount` : part de blanc, de 0 (inchangée) à 1 (blanc).

**Retour** : la couleur éclaircie au format `#rrggbb` (ou `#rrggbbaa`).

**Erreurs** : `RangeError` si `amount` n'est pas entre 0 et 1 ; `Error` si `hex` n'est pas une couleur hexadécimale valide.

**Exemple**

```ts
import { lightenColor } from "@etiennea20/adr-misc";

lightenColor("#2563eb", 0.2); // "#5182ef"
lightenColor("#2563eb", 0.9); // "#e9effd"
```

### `mixColors`

| Champ          | Valeur                                    |
| -------------- | ----------------------------------------- |
| Catégorie      | `color`                                   |
| Point d'entrée | `@etiennea20/adr-misc`                    |
| Statut         | stable                                    |
| Depuis         | 0.2.0                                     |
| Source         | `src/color/mix-colors/mix-colors.ts`      |
| Tests          | `src/color/mix-colors/mix-colors.test.ts` |

**Signature**

```ts
function mixColors(first: string, second: string, weight?: number): string;
```

**Description** : mélange deux couleurs dans une proportion donnée (mélange linéaire des composantes sRGB, comme `mix()` de Sass). À utiliser pour une couleur intermédiaire ou un dégradé par paliers (jauge de retard du vert au rouge). L'opacité est mélangée si l'une des couleurs en précise une.

**Paramètres**

- `first` : première couleur hexadécimale (obtenue pour `weight = 0`).
- `second` : seconde couleur hexadécimale (obtenue pour `weight = 1`).
- `weight` : part de `second`, entre 0 et 1 (défaut `0.5`).

**Retour** : la couleur mélangée au format `#rrggbb` (ou `#rrggbbaa` si elle est translucide).

**Erreurs** : `RangeError` si `weight` n'est pas entre 0 et 1 ; `Error` si l'une des couleurs n'est pas hexadécimale.

**Exemple**

```ts
import { mixColors } from "@etiennea20/adr-misc";

mixColors("#ff0000", "#0000ff"); // "#800080"
mixColors("#16a34a", "#dc2626", 0.25); // "#488441"
```

### `rgbToHex`

| Champ          | Valeur                                    |
| -------------- | ----------------------------------------- |
| Catégorie      | `color`                                   |
| Point d'entrée | `@etiennea20/adr-misc`                    |
| Statut         | stable                                    |
| Depuis         | 0.2.0                                     |
| Source         | `src/color/rgb-to-hex/rgb-to-hex.ts`      |
| Tests          | `src/color/rgb-to-hex/rgb-to-hex.test.ts` |

**Signature**

```ts
function rgbToHex(color: IRgbColor): string;
```

**Description** : convertit des composantes RVB (et opacité) en couleur hexadécimale, pour revenir à une couleur CSS ou stockable après un calcul. Les composantes décimales sont arrondies ; l'opacité n'est écrite que si elle est inférieure à 1 une fois arrondie à l'octet.

**Paramètres**

- `color` : composantes `r`, `g`, `b` (0 à 255) et `a` facultative (0 à 1).

**Retour** : la couleur au format `#rrggbb` ou `#rrggbbaa`, en minuscules.

**Erreurs** : `RangeError` si une composante est hors limites ou n'est pas un nombre.

**Exemple**

```ts
import { rgbToHex } from "@etiennea20/adr-misc";

rgbToHex({ r: 37, g: 99, b: 235 }); // "#2563eb"
rgbToHex({ r: 0, g: 0, b: 0, a: 0.5 }); // "#00000080"
rgbToHex({ r: 255, g: 255, b: 255, a: 1 }); // "#ffffff"
```

### `stringToColor`

| Champ          | Valeur                                              |
| -------------- | --------------------------------------------------- |
| Catégorie      | `color`                                             |
| Point d'entrée | `@etiennea20/adr-misc`                              |
| Statut         | stable                                              |
| Depuis         | 0.2.0                                               |
| Source         | `src/color/string-to-color/string-to-color.ts`      |
| Tests          | `src/color/string-to-color/string-to-color.test.ts` |

**Signature**

```ts
function stringToColor(text: string, options?: IStringToColorOptions): string;
```

**Description** : dérive d'un texte une couleur stable (le même texte donne toujours la même couleur, dans tous les environnements). À utiliser pour colorer automatiquement un avatar d'adhérent, une étiquette de genre littéraire, une série de graphique. Seule la teinte dépend du texte (360 teintes possibles, des collisions sont donc possibles) ; combiner avec `getReadableTextColor` pour le texte posé dessus.

**Paramètres**

- `text` : texte source (nom, identifiant, libellé) ; la casse compte.
- `options` : saturation et luminosité (voir `IStringToColorOptions`).

**Retour** : une couleur au format `#rrggbb`.

**Erreurs** : `RangeError` si `saturation` ou `lightness` n'est pas entre 0 et 100.

**Exemple**

```ts
import { getReadableTextColor, stringToColor } from "@etiennea20/adr-misc";

const background = stringToColor("Marie Curie"); // toujours la même couleur pour ce nom
const text = getReadableTextColor(background);
stringToColor("Policier", { saturation: 60, lightness: 85 }); // variante pastel
```

### `withAlpha`

| Champ          | Valeur                                    |
| -------------- | ----------------------------------------- |
| Catégorie      | `color`                                   |
| Point d'entrée | `@etiennea20/adr-misc`                    |
| Statut         | stable                                    |
| Depuis         | 0.2.0                                     |
| Source         | `src/color/with-alpha/with-alpha.ts`      |
| Tests          | `src/color/with-alpha/with-alpha.test.ts` |

**Signature**

```ts
function withAlpha(hex: string, alpha: number): string;
```

**Description** : applique une opacité à une couleur hexadécimale, pour dériver une variante translucide d'une couleur de thème (voile d'une modale, fond d'une alerte). L'opacité éventuelle de la couleur d'origine est remplacée, et non multipliée.

**Paramètres**

- `hex` : couleur hexadécimale de départ.
- `alpha` : opacité, de 0 (transparent) à 1 (opaque).

**Retour** : la couleur au format `#rrggbbaa`, ou `#rrggbb` si `alpha` vaut 1.

**Erreurs** : `RangeError` si `alpha` n'est pas entre 0 et 1 ; `Error` si `hex` n'est pas une couleur hexadécimale valide.

**Exemple**

```ts
import { withAlpha } from "@etiennea20/adr-misc";

withAlpha("#2563eb", 0.5); // "#2563eb80"
withAlpha("#2563eb80", 1); // "#2563eb"
```
