import type { ConfigType } from "dayjs";

import { createBusinessDayChecker } from "../create-business-day-checker";
import type { IPublicHolidayOptions } from "../get-public-holidays-fr";
import { parseDate } from "../parse-date";

/**
 * Indique si une date est un jour ouvré : ni samedi, ni dimanche, ni jour férié français.
 *
 * À utiliser pour valider une date de rendez-vous ou d'échéance. Les jours de fermeture propres
 * à une structure (ponts, congés) ne sont pas connus : les filtrer en plus si besoin.
 *
 * @param date - Date à tester.
 * @param options - Options des jours fériés (Alsace-Moselle).
 * @returns `true` si la date est un jour ouvré.
 * @throws {@link Error} Si la date est invalide.
 * @throws {@link RangeError} Si l'année de la date est hors de l'intervalle 1583 à 9999.
 * @example
 * ```ts
 * isBusinessDay("2026-11-02"); // true (lundi)
 * isBusinessDay("2026-11-01"); // false (dimanche, Toussaint)
 * isBusinessDay("2026-11-11"); // false (mercredi férié)
 * ```
 * @since 0.2.0
 */
export function isBusinessDay(date: ConfigType, options: IPublicHolidayOptions = {}): boolean {
  return createBusinessDayChecker(options)(parseDate(date));
}
