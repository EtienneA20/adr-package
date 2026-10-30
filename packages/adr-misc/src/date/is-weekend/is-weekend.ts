import type { ConfigType } from "dayjs";

import { parseDate } from "../parse-date";

/**
 * Indique si une date tombe un samedi ou un dimanche (heure locale).
 *
 * À utiliser pour griser les week-ends d'un calendrier ou refuser une date de rendez-vous.
 * Pour exclure aussi les jours fériés, utiliser `isBusinessDay`.
 *
 * @param date - Date à tester.
 * @returns `true` le samedi et le dimanche.
 * @throws {@link Error} Si la date est invalide.
 * @example
 * ```ts
 * isWeekend("2026-10-31"); // true (samedi)
 * isWeekend("2026-11-02"); // false (lundi)
 * ```
 * @since 0.2.0
 */
export function isWeekend(date: ConfigType): boolean {
  const weekDay = parseDate(date).day();
  return weekDay === 0 || weekDay === 6;
}
