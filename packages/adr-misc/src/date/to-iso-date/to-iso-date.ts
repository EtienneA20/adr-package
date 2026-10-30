import type { ConfigType } from "dayjs";

import { parseDate } from "../parse-date";

/**
 * Formate une date au format ISO 8601 court « YYYY-MM-DD » (jour local, sans heure ni fuseau).
 *
 * À utiliser pour envoyer une date « calendaire » à une API, la stocker dans une colonne `date`
 * ou remplir un champ `<input type="date">`. Contrairement à `Date.prototype.toISOString()`, le
 * jour n'est pas décalé par la conversion en UTC.
 *
 * @param date - Date à formater.
 * @returns La date au format « YYYY-MM-DD ».
 * @throws {@link Error} Si la date est invalide.
 * @example
 * ```ts
 * toIsoDate(new Date(2026, 9, 29, 23, 30)); // "2026-10-29"
 * toIsoDate(dayjs("2026-10-29T08:00:00")); // "2026-10-29"
 * ```
 * @since 0.2.0
 */
export function toIsoDate(date: ConfigType): string {
  return parseDate(date).format("YYYY-MM-DD");
}
