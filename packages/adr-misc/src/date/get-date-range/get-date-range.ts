import type { ConfigType, Dayjs } from "dayjs";

import { parseDateRange } from "../parse-date-range";

/**
 * Liste les jours (ou les mois, ou les années) compris entre deux dates, bornes incluses.
 *
 * À utiliser pour construire les colonnes d'un planning, les lignes d'un rapport mensuel ou
 * parcourir une période jour par jour. Chaque élément est le début de l'unité (minuit pour un
 * jour, le 1er du mois pour un mois), en heure locale.
 *
 * @param start - Début de la période (inclus).
 * @param end - Fin de la période (incluse).
 * @param unit - Pas de la liste : `"day"` (par défaut), `"month"` ou `"year"`.
 * @returns Les débuts d'unité, du premier au dernier, dans l'ordre chronologique.
 * @throws {@link Error} Si une borne est invalide, ou si `start` est postérieur à `end` (à
 *   l'unité près).
 * @example
 * ```ts
 * getDateRange("2026-10-30", "2026-11-02").map((day) => day.format("DD/MM"));
 * // ["30/10", "31/10", "01/11", "02/11"]
 * getDateRange("2026-09-15", "2026-12-01", "month").map((month) => month.format("MM/YYYY"));
 * // ["09/2026", "10/2026", "11/2026", "12/2026"]
 * ```
 * @since 0.2.0
 */
export function getDateRange(
  start: ConfigType,
  end: ConfigType,
  unit: "day" | "month" | "year" = "day",
): Dayjs[] {
  const [startDate, endDate] = parseDateRange(start, end, unit);
  const last = endDate.startOf(unit);
  const dates: Dayjs[] = [];
  for (
    let current = startDate.startOf(unit);
    !current.isAfter(last);
    current = current.add(1, unit)
  ) {
    dates.push(current);
  }
  return dates;
}
