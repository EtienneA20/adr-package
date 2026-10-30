import dayjs from "dayjs";
import type { ConfigType } from "dayjs";

import { parseDate } from "../parse-date";

/** Septembre, mois de la rentrée scolaire en France (0 = janvier). */
const DEFAULT_START_MONTH = 8;

/**
 * Options de `getSchoolYear`.
 *
 * @example
 * ```ts
 * const options: ISchoolYearOptions = { startMonth: 7 }; // exercice qui commence en août
 * ```
 * @since 0.2.0
 */
export interface ISchoolYearOptions {
  /**
   * Mois de début de l'année scolaire, de 0 (janvier) à 11 (décembre), comme
   * `Date.prototype.getMonth()`.
   *
   * @defaultValue 8 (septembre)
   */
  readonly startMonth?: number;
}

/**
 * Renvoie le libellé de l'année scolaire (ou universitaire) qui contient une date, au format
 * « 2026-2027 ».
 *
 * À utiliser pour rattacher une inscription, une adhésion ou une statistique à une année
 * scolaire. L'année commence le 1er du mois `startMonth` (septembre par défaut).
 *
 * @param date - Date à situer (par défaut, maintenant).
 * @param options - Options (mois de début).
 * @returns Le libellé « AAAA-AAAA » de l'année scolaire.
 * @throws {@link Error} Si la date est invalide.
 * @throws {@link RangeError} Si `startMonth` n'est pas un entier compris entre 0 et 11.
 * @example
 * ```ts
 * getSchoolYear("2026-10-29"); // "2026-2027"
 * getSchoolYear("2026-08-31"); // "2025-2026"
 * getSchoolYear("2026-08-31", { startMonth: 7 }); // "2026-2027"
 * ```
 * @since 0.2.0
 */
export function getSchoolYear(
  date: ConfigType = dayjs(),
  options: ISchoolYearOptions = {},
): string {
  const { startMonth = DEFAULT_START_MONTH } = options;
  if (!Number.isInteger(startMonth) || startMonth < 0 || startMonth > 11) {
    throw new RangeError(
      "Le mois de rentrée doit être un entier compris entre 0 (janvier) et 11 (décembre).",
    );
  }
  const day = parseDate(date);
  const startYear = day.month() >= startMonth ? day.year() : day.year() - 1;
  return `${startYear}-${startYear + 1}`;
}
