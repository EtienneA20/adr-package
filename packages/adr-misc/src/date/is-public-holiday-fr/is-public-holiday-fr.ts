import type { ConfigType } from "dayjs";

import { getPublicHolidaysFr } from "../get-public-holidays-fr";
import type { IPublicHolidayOptions } from "../get-public-holidays-fr";
import { parseDate } from "../parse-date";

/**
 * Indique si une date est un jour férié légal en France métropolitaine.
 *
 * À utiliser pour signaler un jour de fermeture ou refuser une date d'échéance. L'heure de la
 * date est ignorée : seul le jour compte (heure locale).
 *
 * @param date - Date à tester.
 * @param options - Options (Alsace-Moselle).
 * @returns `true` si la date tombe un jour férié.
 * @throws {@link Error} Si la date est invalide.
 * @throws {@link RangeError} Si l'année de la date est hors de l'intervalle 1583 à 9999.
 * @example
 * ```ts
 * isPublicHolidayFr("2026-07-14"); // true
 * isPublicHolidayFr("2026-12-26"); // false
 * isPublicHolidayFr("2026-12-26", { alsaceMoselle: true }); // true
 * ```
 * @since 0.2.0
 */
export function isPublicHolidayFr(date: ConfigType, options: IPublicHolidayOptions = {}): boolean {
  const day = parseDate(date);
  return getPublicHolidaysFr(day.year(), options).some((holiday) =>
    holiday.date.isSame(day, "day"),
  );
}
