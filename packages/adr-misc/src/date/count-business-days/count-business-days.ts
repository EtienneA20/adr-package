import type { ConfigType } from "dayjs";

import { createBusinessDayChecker } from "../create-business-day-checker";
import { getDateRange } from "../get-date-range";
import type { IPublicHolidayOptions } from "../get-public-holidays-fr";

/**
 * Compte les jours ouvrés (ni week-end, ni jour férié français) entre deux dates, bornes
 * incluses.
 *
 * À utiliser pour mesurer un délai en jours ouvrés (durée d'un retard, d'un traitement). Les
 * heures sont ignorées : seuls les jours comptent (heure locale).
 *
 * @param start - Premier jour de la période (inclus).
 * @param end - Dernier jour de la période (inclus).
 * @param options - Options des jours fériés (Alsace-Moselle).
 * @returns Le nombre de jours ouvrés de la période.
 * @throws {@link Error} Si une borne est invalide, ou si `start` est postérieur à `end`.
 * @throws {@link RangeError} Si la période touche une année hors de l'intervalle 1583 à 9999.
 * @example
 * ```ts
 * countBusinessDays("2026-11-02", "2026-11-06"); // 5 (du lundi au vendredi)
 * countBusinessDays("2026-11-09", "2026-11-13"); // 4 (mercredi 11 novembre férié)
 * ```
 * @since 0.2.0
 */
export function countBusinessDays(
  start: ConfigType,
  end: ConfigType,
  options: IPublicHolidayOptions = {},
): number {
  return getDateRange(start, end).filter(createBusinessDayChecker(options)).length;
}
