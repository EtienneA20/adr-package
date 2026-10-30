import dayjs from "dayjs";
import type { ConfigType, Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";

/** Formats français essayés après l'ISO 8601 quand aucun format n'est fourni. */
const DEFAULT_FORMATS: readonly string[] = ["DD/MM/YYYY", "DD/MM/YYYY HH:mm", "D/M/YYYY"];

/**
 * Date ISO 8601 : `YYYY-MM-DD`, suivie éventuellement de l'heure (`T` ou espace), des
 * secondes, des fractions de seconde et d'un décalage (`Z` ou `±HH:mm`).
 */
const ISO_PATTERN =
  /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.\d{1,9})?)?(?:Z|[+-]\d{2}:\d{2})?)?$/;

/**
 * Vérifie qu'une date ISO désigne un jour et une heure qui existent. Nécessaire car
 * `new Date("2026-02-30")` (utilisé par dayjs) reporte silencieusement au 2 mars.
 *
 * @param match - Résultat de {@link ISO_PATTERN}.
 * @returns `true` si le mois, le jour, l'heure, les minutes et les secondes sont valides.
 */
function isIsoCalendarValid(match: RegExpExecArray): boolean {
  const [year = 0, month = 0, day = 0, hour = 0, minute = 0, second = 0] = [1, 2, 3, 4, 5, 6].map(
    (group) => Number(match[group] ?? 0),
  );
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const ranges: readonly (readonly [number, number, number])[] = [
    [month, 1, 12],
    [day, 1, daysInMonth],
    [hour, 0, 23],
    [minute, 0, 59],
    [second, 0, 59],
  ];
  return ranges.every(([part, min, max]) => part >= min && part <= max);
}

/**
 * Lit une chaîne ISO 8601 stricte.
 *
 * @param text - Chaîne sans espaces autour.
 * @returns La date, ou `undefined` si la chaîne n'est pas une date ISO valide.
 */
function parseIso(text: string): Dayjs | undefined {
  const match = ISO_PATTERN.exec(text);
  if (match === null || !isIsoCalendarValid(match)) {
    return undefined;
  }
  const date = dayjs(text);
  return date.isValid() ? date : undefined;
}

/**
 * Convertit une saisie en date dayjs, en ISO 8601 ou dans un format français.
 *
 * À utiliser pour lire une date saisie par un utilisateur, importée d'un fichier CSV ou reçue
 * d'une API. Une chaîne est d'abord lue en ISO 8601 strict (`2026-01-15`,
 * `2026-01-15T10:30:00Z`…), puis avec chacun des `formats` en mode strict, dans l'ordre. Une
 * date impossible (« 31/02/2026 ») est refusée au lieu d'être reportée au mois suivant.
 *
 * @remarks
 * Active le plugin dayjs `customParseFormat` (`dayjs.extend` est idempotent) sur l'instance
 * dayjs partagée avec le projet consommateur.
 *
 * Convention des fonctions `parse*` : une saisie invalide renvoie `undefined` (pas d'erreur).
 * Les dates sans décalage horaire sont lues dans le fuseau local.
 *
 * @param value - Saisie à convertir : chaîne, `Date`, horodatage en millisecondes ou objet
 *   dayjs. `null`, `undefined` et la chaîne vide donnent `undefined` (et non l'instant
 *   présent, contrairement à `dayjs()`).
 * @param formats - Formats dayjs essayés après l'ISO 8601, en mode strict. Par défaut :
 *   `["DD/MM/YYYY", "DD/MM/YYYY HH:mm", "D/M/YYYY"]`.
 * @returns La date dayjs, ou `undefined` si la saisie est vide ou invalide.
 * @example
 * ```ts
 * parseDate("15/01/2026")?.format("YYYY-MM-DD"); // "2026-01-15"
 * parseDate("2026-01-15T10:30:00Z")?.toISOString(); // "2026-01-15T10:30:00.000Z"
 * parseDate("31/02/2026"); // undefined
 * parseDate("01-15-2026", ["MM-DD-YYYY"])?.date(); // 15
 * ```
 * @since 0.2.0
 */
export function parseDate(
  value: ConfigType,
  formats: readonly string[] = DEFAULT_FORMATS,
): Dayjs | undefined {
  if (value === null || value === undefined) {
    return undefined;
  }
  if (typeof value !== "string") {
    const date = dayjs(value);
    return date.isValid() ? date : undefined;
  }
  const text = value.trim();
  if (text === "") {
    return undefined;
  }
  dayjs.extend(customParseFormat);
  return (
    parseIso(text) ??
    formats.map((format) => dayjs(text, format, true)).find((date) => date.isValid())
  );
}
