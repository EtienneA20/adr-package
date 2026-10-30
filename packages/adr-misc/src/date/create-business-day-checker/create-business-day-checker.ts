import type { Dayjs } from "dayjs";

import { getPublicHolidaysFr } from "../get-public-holidays-fr";
import type { IPublicHolidayOptions } from "../get-public-holidays-fr";
import { isWeekend } from "../is-weekend";

const DAY_KEY_FORMAT = "YYYY-MM-DD";

/**
 * Crée un test « jour ouvré » (ni samedi, ni dimanche, ni jour férié français).
 *
 * Les jours fériés sont calculés une seule fois par année rencontrée : les fonctions qui
 * parcourent une période jour par jour (`addBusinessDays`, `countBusinessDays`) évitent ainsi
 * de recalculer la date de Pâques pour chaque jour.
 *
 * @param options - Options des jours fériés (Alsace-Moselle).
 * @returns Une fonction qui indique si une date est un jour ouvré.
 * @internal
 */
export function createBusinessDayChecker(
  options: IPublicHolidayOptions = {},
): (date: Dayjs) => boolean {
  const holidaysByYear = new Map<number, Set<string>>();

  const getHolidays = (year: number): Set<string> => {
    const cached = holidaysByYear.get(year);
    if (cached) {
      return cached;
    }
    const holidays = new Set(
      getPublicHolidaysFr(year, options).map((holiday) => holiday.date.format(DAY_KEY_FORMAT)),
    );
    holidaysByYear.set(year, holidays);
    return holidays;
  };

  return (date) => !isWeekend(date) && !getHolidays(date.year()).has(date.format(DAY_KEY_FORMAT));
}
