import type { ConfigType, OpUnitType } from "dayjs";

import { parseDate } from "../parse-date";
import { parseDateRange } from "../parse-date-range";

/**
 * Options de `isDateBetween`.
 *
 * @example
 * ```ts
 * const options: IDateBetweenOptions = { inclusive: false, unit: "month" };
 * ```
 * @since 0.2.0
 */
export interface IDateBetweenOptions {
  /**
   * Inclut les bornes : une date égale à `start` ou à `end` (à la granularité près) est
   * considérée comme comprise.
   *
   * @defaultValue true
   */
  readonly inclusive?: boolean;
  /**
   * Granularité de la comparaison (`"day"`, `"month"`, `"hour"`, `"millisecond"`…) : les
   * unités plus fines sont ignorées.
   *
   * @defaultValue "day"
   */
  readonly unit?: OpUnitType;
}

/**
 * Indique si une date est comprise dans une période.
 *
 * À utiliser pour savoir si un emprunt, une adhésion ou une promotion est en cours. Par défaut,
 * les bornes sont incluses et la comparaison se fait au jour près (l'heure est ignorée), sans
 * dépendre du plugin dayjs `isBetween`.
 *
 * @param date - Date à tester.
 * @param start - Début de la période.
 * @param end - Fin de la période.
 * @param options - Inclusion des bornes et granularité.
 * @returns `true` si la date est dans la période.
 * @throws {@link Error} Si une des dates est invalide, ou si `start` est postérieur à `end`.
 * @example
 * ```ts
 * isDateBetween("2026-10-31T18:00", "2026-10-01", "2026-10-31"); // true (jour inclus)
 * isDateBetween("2026-10-31", "2026-10-01", "2026-10-31", { inclusive: false }); // false
 * isDateBetween("2026-10-15", "2026-09-30", "2026-11-01", { unit: "month" }); // true
 * ```
 * @since 0.2.0
 */
export function isDateBetween(
  date: ConfigType,
  start: ConfigType,
  end: ConfigType,
  options: IDateBetweenOptions = {},
): boolean {
  const { inclusive = true, unit = "day" } = options;
  const [startDate, endDate] = parseDateRange(start, end, unit);
  const value = parseDate(date);
  if (inclusive) {
    return !value.isBefore(startDate, unit) && !value.isAfter(endDate, unit);
  }
  return value.isAfter(startDate, unit) && value.isBefore(endDate, unit);
}
