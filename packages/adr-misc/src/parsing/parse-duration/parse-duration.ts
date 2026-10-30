const SECOND_MS = 1000;
const MINUTE_MS = 60 * SECOND_MS;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;
const WEEK_MS = 7 * DAY_MS;

/** Durée en millisecondes de chaque unité reconnue (français et anglais, en minuscules). */
const UNIT_MS: Readonly<Record<string, number>> = {
  ms: 1,
  milliseconde: 1,
  millisecondes: 1,
  s: SECOND_MS,
  sec: SECOND_MS,
  seconde: SECOND_MS,
  secondes: SECOND_MS,
  second: SECOND_MS,
  seconds: SECOND_MS,
  m: MINUTE_MS,
  mn: MINUTE_MS,
  min: MINUTE_MS,
  minute: MINUTE_MS,
  minutes: MINUTE_MS,
  h: HOUR_MS,
  heure: HOUR_MS,
  heures: HOUR_MS,
  hour: HOUR_MS,
  hours: HOUR_MS,
  j: DAY_MS,
  jour: DAY_MS,
  jours: DAY_MS,
  d: DAY_MS,
  day: DAY_MS,
  days: DAY_MS,
  sem: WEEK_MS,
  semaine: WEEK_MS,
  semaines: WEEK_MS,
  w: WEEK_MS,
  week: WEEK_MS,
  weeks: WEEK_MS,
};

/** Unité implicite d'un nombre final sans unité : « 1h30 » (minutes), « 2min30 » (secondes). */
const IMPLICIT_NEXT_UNIT_MS: ReadonlyMap<number, number> = new Map([
  [HOUR_MS, MINUTE_MS],
  [MINUTE_MS, SECOND_MS],
]);

/** Un terme « nombre + unité », précédé éventuellement de « et ». */
const TERM_PATTERN = /(?:et\s+)?(\d+(?:[.,]\d+)?)\s*([a-zé]*)\s*/y;

/** Horloge `H:mm` ou `H:mm:ss`. */
const CLOCK_PATTERN = /^(\d+):([0-5]\d)(?::([0-5]\d))?$/;

/** Durée ISO 8601 limitée aux semaines, jours, heures, minutes et secondes. */
const ISO_PATTERN =
  /^P(?:([\d.,]+)W)?(?:([\d.,]+)D)?(?:T(?:([\d.,]+)H)?(?:([\d.,]+)M)?(?:([\d.,]+)S)?)?$/;

/** Multiplicateur de chaque groupe de {@link ISO_PATTERN}, dans l'ordre. */
const ISO_GROUP_MS = [WEEK_MS, DAY_MS, HOUR_MS, MINUTE_MS, SECOND_MS] as const;

/**
 * Convertit un nombre au format décimal français ou anglais (`1,5` ou `1.5`).
 *
 * @param text - Chiffres avec au plus un séparateur décimal.
 * @returns Le nombre, ou `NaN` s'il est mal formé.
 */
function toAmount(text: string): number {
  return /^\d+(?:[.,]\d+)?$/.test(text) ? Number(text.replace(",", ".")) : Number.NaN;
}

/**
 * Lit une durée ISO 8601 (`PT1H30M`, `P2DT3H`, `P1W`).
 *
 * @param text - Saisie en majuscules.
 * @returns La durée en millisecondes, ou `undefined` si elle est invalide.
 */
function parseIsoDuration(text: string): number | undefined {
  const match = ISO_PATTERN.exec(text);
  if (match === null || text === "P" || text.endsWith("T")) {
    return undefined;
  }
  const total = ISO_GROUP_MS.reduce((sum, unitMs, index) => {
    const amount = match[index + 1];
    return amount === undefined ? sum : sum + toAmount(amount) * unitMs;
  }, 0);
  return Number.isNaN(total) ? undefined : total;
}

/**
 * Lit une durée au format horloge (`1:30` ou `1:30:00`).
 *
 * @param text - Saisie sans espaces autour.
 * @returns La durée en millisecondes, ou `undefined` si elle est invalide.
 */
function parseClockDuration(text: string): number | undefined {
  const match = CLOCK_PATTERN.exec(text);
  if (match === null) {
    return undefined;
  }
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  const seconds = Number(match[3] ?? 0);
  return hours * HOUR_MS + minutes * MINUTE_MS + seconds * SECOND_MS;
}

/**
 * Lit une suite de termes « nombre + unité » (`1h30`, `2 j 3 h`, `1 heure et 30 minutes`).
 *
 * @param text - Saisie en minuscules, sans espaces autour.
 * @returns La durée en millisecondes, ou `undefined` si un terme est invalide.
 */
function parseUnitDuration(text: string): number | undefined {
  const pattern = new RegExp(TERM_PATTERN.source, TERM_PATTERN.flags);
  let total = 0;
  let previousUnitMs: number | undefined;
  while (pattern.lastIndex < text.length) {
    const match = pattern.exec(text);
    const unitName = match?.[2] ?? "";
    const isLastTerm = pattern.lastIndex >= text.length;
    const unitMs =
      unitName === "" && isLastTerm && previousUnitMs !== undefined
        ? IMPLICIT_NEXT_UNIT_MS.get(previousUnitMs)
        : UNIT_MS[unitName];
    if (match === null || unitMs === undefined) {
      return undefined;
    }
    total += toAmount(match[1] ?? "") * unitMs;
    previousUnitMs = unitMs;
  }
  return total;
}

/**
 * Convertit une durée saisie en texte en millisecondes.
 *
 * À utiliser pour lire une durée d'emprunt, un temps passé ou un délai saisi librement par un
 * utilisateur ou lu dans un fichier. Formats acceptés, sans tenir compte de la casse :
 *
 * - unités françaises ou anglaises : « 45s », « 90min », « 1h30 », « 1 h 30 min »,
 *   « 2j 3h », « 1,5 h », « 1 heure et 30 minutes », « 2 semaines » (`ms`, `s`, `min`/`mn`/`m`,
 *   `h`, `j`/`d`, `sem`/`w` et leurs formes longues) ; un nombre final sans unité après `h` ou
 *   `min` vaut respectivement des minutes ou des secondes ;
 * - horloge : « 1:30 » (heures et minutes), « 1:30:00 » (heures, minutes, secondes) ;
 * - ISO 8601 : « PT1H30M », « P2DT3H », « P1W » (ni années ni mois, de durée variable).
 *
 * @remarks
 * Convention des fonctions `parse*` : une saisie invalide renvoie `undefined` (pas d'erreur).
 * Un nombre seul (« 90 ») est refusé car son unité est ambiguë. Les durées négatives ne sont
 * pas acceptées.
 *
 * @param text - Durée à convertir.
 * @returns La durée en millisecondes (arrondie à l'entier), ou `undefined` si la saisie est
 *   vide ou invalide.
 * @example
 * ```ts
 * parseDuration("1h30"); // 5_400_000
 * parseDuration("2j 3h"); // 183_600_000
 * parseDuration("PT1H30M"); // 5_400_000
 * parseDuration("1:30:00"); // 5_400_000
 * parseDuration("90"); // undefined
 * ```
 * @since 0.2.0
 */
export function parseDuration(text: string | null | undefined): number | undefined {
  const trimmed = (text ?? "").trim();
  if (trimmed === "") {
    return undefined;
  }
  let duration: number | undefined;
  if (/^p/i.test(trimmed)) {
    duration = parseIsoDuration(trimmed.toUpperCase());
  } else if (trimmed.includes(":")) {
    duration = parseClockDuration(trimmed);
  } else {
    duration = parseUnitDuration(trimmed.toLowerCase());
  }
  return duration === undefined || Number.isNaN(duration) ? undefined : Math.round(duration);
}
