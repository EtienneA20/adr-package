---
name: adr-misc
description: "À utiliser pour développer ou utiliser @etiennea20/adr-misc : utilitaires TypeScript partagés entre front (navigateur) et back (Node, NestJS) : assertions et gestion d'erreurs, gardes et types utilitaires, fonctions asynchrones (retry, debounce, timeout), tableaux, objets, chaînes et casse, calculs, aléatoire, parsing (nombres, dates avec dayjs, durées, CSV), formatage français, dates (jours fériés, jours ouvrés), énumérations, validation (email, SIRET, IBAN, NIR), URL, fichiers et couleurs. Donne l'inventaire des fonctions, types et énumérations publics, leur signature, leurs erreurs et un exemple d'utilisation."
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
- Conventions : fonctions pures et immuables, formats français par défaut (`fr-FR`, `EUR`,
  `DD/MM/YYYY`), date de référence et générateur aléatoire injectables pour les tests.
- Avant d'écrire un helper générique dans un projet consommateur, chercher ici un équivalent.

## Catégories

- [core](reference.md#core) : assertions et gestion d'erreurs (`assertDefined`, `assertNever`, `getErrorMessage`, `invariant`, `Result`, `toError`, `tryCatch`, `tryCatchAsync`)
- [guards](reference.md#guards) : gardes de type (`isBoolean`, `isDefined`, `isEmpty`, `isFunction`, `isKeyOf`, `isNil`, `isNonEmptyArray`, `isNonEmptyString`, `isNumber`, `isObject`, `isPlainObject`, `isPromiseLike`, `isString`, `isValidDate`)
- [types](reference.md#types) : types utilitaires (`Brand`, `DeepPartial`, `DeepReadonly`, `KeysOfType`, `Maybe`, `MaybePromise`, `Mutable`, `NonEmptyArray`, `Nullable`, `PartialBy`, `Prettify`, `Primitive`, `RequiredBy`, `ValueOf`)
- [function](reference.md#function) : fonctions d'ordre supérieur (`identity`, `IMemoizedFunction`, `IMemoizeOptions`, `memoize`, `negate`, `noop`, `once`, `pipe`)
- [async](reference.md#async) : promesses, minuteries et concurrence (`createDeferred`, `debounce`, `IDebouncedFunction`, `IDeferred`, `IRetryOptions`, `IThrottledFunction`, `IWaitUntilOptions`, `mapConcurrent`, `retry`, `sleep`, `throttle`, `TimeoutError`, `waitUntil`, `withTimeout`)
- [array](reference.md#array) : tableaux (`chunk`, `compact`, `countBy`, `difference`, `groupBy`, `intersection`, `ISortByCriterion`, `keyBy`, `moveItem`, `partition`, `range`, `sortBy`, `SortByCriterion`, `SortByValue`, `toggleItem`, `unique`, `uniqueBy`, `zip`)
- [object](reference.md#object) : objets (`deepClone`, `deepMerge`, `DeepMergePatch`, `flattenObject`, `getPath`, `invert`, `IRemoveUndefinedOptions`, `isEqual`, `mapValues`, `ObjectEntry`, `omit`, `omitBy`, `PathValue`, `pick`, `pickBy`, `removeUndefined`, `setPath`, `typedEntries`, `unflattenObject`)
- [string](reference.md#string) : chaînes de caractères (`IGetInitialsOptions`, `IHighlightSegment`, `IInterpolateOptions`, `IMaskStringOptions`, `IPluralizeOptions`, `ISlugifyOptions`, `ITruncateOptions`, `InterpolateValues`, `compareStrings`, `countWords`, `escapeHtml`, `escapeRegExp`, `getInitials`, `highlightMatches`, `interpolate`, `maskString`, `matchesSearch`, `normalizeWhitespace`, `pluralize`, `removeAccents`, `slugify`, `truncate`, `unescapeHtml`)
- [case](reference.md#case) : changement de casse (`ICapitalizeOptions`, `IToTitleCaseOptions`, `capitalize`, `toCamelCase`, `toConstantCase`, `toKebabCase`, `toPascalCase`, `toSnakeCase`, `toTitleCase`, `uncapitalize`)
- [math](reference.md#math) : calculs numériques (`average`, `clamp`, `inRange`, `lerp`, `maxBy`, `median`, `minBy`, `percentage`, `round`, `roundToStep`, `sum`, `sumBy`)
- [random](reference.md#random) : aléatoire et identifiants (`createSeededRandom`, `createUuid`, `IRandomStringOptions`, `randomFloat`, `randomInt`, `randomItem`, `randomString`, `sample`, `shuffle`)
- [parsing](reference.md#parsing) : lecture de saisies : nombres, booléens, dates, durées, JSON, CSV (`IParseCsvOptions`, `IParseNumberOptions`, `IToCsvOptions`, `parseBoolean`, `parseCsv`, `parseDate`, `parseDuration`, `parseInteger`, `parseNumber`, `safeJsonParse`, `toCsv`)
- [format](reference.md#format) : formatage français : nombres, monnaie, dates, durées, tailles (`IFormatBytesOptions`, `IFormatCurrencyOptions`, `IFormatDateOptions`, `IFormatDurationOptions`, `IFormatFullNameOptions`, `IFormatIbanOptions`, `IFormatListOptions`, `IFormatNumberOptions`, `IFormatOrdinalOptions`, `IFormatPercentOptions`, `IFormatPhoneNumberOptions`, `IFormatRelativeTimeOptions`, `IPersonName`, `formatBytes`, `formatCurrency`, `formatDate`, `formatDateTime`, `formatDuration`, `formatFullName`, `formatIban`, `formatList`, `formatNumber`, `formatOrdinal`, `formatPercent`, `formatPhoneNumber`, `formatRelativeTime`)
- [date](reference.md#date) : calculs de dates : jours fériés, jours ouvrés, semaines, âge (`addBusinessDays`, `countBusinessDays`, `getAge`, `getDateRange`, `getEasterDate`, `getIsoWeek`, `getPublicHolidaysFr`, `getSchoolYear`, `IDateBetweenOptions`, `IPublicHoliday`, `IPublicHolidayOptions`, `isBusinessDay`, `ISchoolYearOptions`, `isDateBetween`, `isPublicHolidayFr`, `isWeekend`, `toIsoDate`)
- [enums](reference.md#enums) : énumérations et helpers associés (`EDurationMs`, `EHttpMethod`, `EHttpStatus`, `EMimeType`, `EMonth`, `ESortDirection`, `EWeekDay`, `getEnumKey`, `getEnumKeys`, `getEnumValues`, `isEnumValue`, `MONTH_LABELS`, `WEEK_DAY_LABELS`)
- [validation](reference.md#validation) : validation : email, téléphone, SIRET, IBAN, NIR, mot de passe (`EPasswordCriterion`, `getPasswordStrength`, `IIsUrlOptions`, `IPasswordRules`, `IPasswordStrength`, `isEmail`, `isFrenchVatNumber`, `isHexColor`, `isIban`, `isIpv4`, `isLuhnValid`, `isNir`, `isPhoneNumberFr`, `isPostalCodeFr`, `isSiren`, `isSiret`, `isStrongPassword`, `isUrl`, `isUuid`)
- [url](reference.md#url) : URL et query strings (`buildQueryString`, `buildUrl`, `getUrlParts`, `IBuildQueryStringOptions`, `isAbsoluteUrl`, `IUrlParts`, `joinUrl`, `ParsedQueryString`, `parseQueryString`, `QueryParams`, `QueryParamValue`)
- [file](reference.md#file) : noms de fichiers et types MIME (`changeFileExtension`, `getFileBaseName`, `getFileExtension`, `getFileName`, `getMimeType`, `ISanitizeFileNameOptions`, `isImageFile`, `sanitizeFileName`)
- [color](reference.md#color) : couleurs et contraste (`darkenColor`, `getContrastRatio`, `getLuminance`, `getReadableTextColor`, `hexToRgb`, `IReadableTextColorOptions`, `IRgbColor`, `IStringToColorOptions`, `lightenColor`, `mixColors`, `rgbToHex`, `stringToColor`, `withAlpha`)

## Retrouver un élément

- L'inventaire complet est dans [reference.md](reference.md) : une entrée
  `` ### `NomExporté` `` par élément public (signature, paramètres, retour, erreurs, exemple,
  point d'entrée, statut, version d'introduction, fichiers source et test).
- Importer uniquement depuis le « Point d'entrée » indiqué, jamais depuis un chemin interne.
- Les chemins « Source » et « Tests » sont relatifs au package (`packages/adr-misc/`
  dans le monorepo adr-package).
- Pour modifier le package : lire d'abord `packages/adr-misc/CLAUDE.md` et le
  `CLAUDE.md` racine du monorepo.
