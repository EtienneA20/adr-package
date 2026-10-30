import type { ConfigType, Dayjs } from "dayjs";

import { createBusinessDayChecker } from "../create-business-day-checker";
import type { IPublicHolidayOptions } from "../get-public-holidays-fr";
import { parseDate } from "../parse-date";

/**
 * Ajoute (ou retire) un nombre de jours ouvrés à une date, en sautant les week-ends et les
 * jours fériés français.
 *
 * À utiliser pour calculer une échéance (« sous 5 jours ouvrés »). Le jour de départ n'est
 * jamais compté ; avec `days` à 0, la date est renvoyée telle quelle, même si elle n'est pas
 * ouvrée. L'heure de la date de départ est conservée.
 *
 * @param date - Date de départ.
 * @param days - Nombre de jours ouvrés à ajouter, entier ; négatif pour reculer.
 * @param options - Options des jours fériés (Alsace-Moselle).
 * @returns La date obtenue, toujours un jour ouvré si `days` est non nul.
 * @throws {@link Error} Si la date est invalide.
 * @throws {@link RangeError} Si `days` n'est pas un entier, ou si le calcul atteint une année
 *   hors de l'intervalle 1583 à 9999.
 * @example
 * ```ts
 * addBusinessDays("2026-10-30", 1).format("YYYY-MM-DD"); // "2026-11-02" (week-end sauté)
 * addBusinessDays("2026-11-10", 1).format("YYYY-MM-DD"); // "2026-11-12" (11 novembre sauté)
 * addBusinessDays("2026-11-02", -1).format("YYYY-MM-DD"); // "2026-10-30"
 * ```
 * @since 0.2.0
 */
export function addBusinessDays(
  date: ConfigType,
  days: number,
  options: IPublicHolidayOptions = {},
): Dayjs {
  let current = parseDate(date);
  if (!Number.isInteger(days)) {
    throw new RangeError("Le nombre de jours ouvrés doit être un entier.");
  }
  const isBusinessDay = createBusinessDayChecker(options);
  const step = days < 0 ? -1 : 1;
  let remaining = Math.abs(days);
  while (remaining > 0) {
    current = current.add(step, "day");
    if (isBusinessDay(current)) {
      remaining -= 1;
    }
  }
  return current;
}
