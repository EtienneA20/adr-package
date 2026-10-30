import type { ConfigType } from "dayjs";

import { parseDate } from "../parse-date";

/** Nombre de jours dans une semaine. */
const DAYS_PER_WEEK = 7;

/**
 * Renvoie le numéro de semaine ISO 8601 d'une date (de 1 à 53).
 *
 * À utiliser pour les plannings et rapports hebdomadaires en France, où les semaines commencent
 * le lundi et où la semaine 1 est celle qui contient le premier jeudi de l'année. Les premiers
 * jours de janvier peuvent donc appartenir à la semaine 52 ou 53 de l'année précédente, et les
 * derniers jours de décembre à la semaine 1 de l'année suivante.
 *
 * @remarks
 * Calculé sans le plugin dayjs `isoWeek` : la fonction ne modifie pas l'instance dayjs du projet
 * et ne dépend pas de la locale configurée.
 *
 * @param date - Date dont on veut la semaine (heure locale).
 * @returns Le numéro de semaine ISO, de 1 à 53.
 * @throws {@link Error} Si la date est invalide.
 * @example
 * ```ts
 * getIsoWeek("2026-10-29"); // 44
 * getIsoWeek("2027-01-01"); // 53 (semaine 53 de 2026)
 * getIsoWeek("2024-12-30"); // 1 (semaine 1 de 2025)
 * ```
 * @since 0.2.0
 */
export function getIsoWeek(date: ConfigType): number {
  const day = parseDate(date).startOf("day");
  // Le jeudi de la même semaine (lundi à dimanche) détermine l'année et le numéro ISO.
  const daysSinceMonday = (day.day() + 6) % DAYS_PER_WEEK;
  const thursday = day.add(3 - daysSinceMonday, "day");
  const dayOfYear = thursday.diff(thursday.startOf("year"), "day");
  return Math.floor(dayOfYear / DAYS_PER_WEEK) + 1;
}
