import { EWeekDay } from "../week-day";

/**
 * Libellés français des jours de la semaine, indexés par la valeur de {@link EWeekDay}
 * (et donc par `Date.prototype.getDay()`).
 *
 * À utiliser pour afficher un jour sans dépendre de la locale dayjs configurée. Les libellés
 * sont en minuscules, selon l'usage typographique français : mettre la majuscule à
 * l'affichage si besoin (début de phrase, en-tête de colonne).
 *
 * @example
 * ```ts
 * WEEK_DAY_LABELS[EWeekDay.MONDAY]; // "lundi"
 * WEEK_DAY_LABELS[new Date(2026, 9, 31).getDay() as EWeekDay]; // "samedi"
 * ```
 * @since 0.2.0
 */
export const WEEK_DAY_LABELS: Readonly<Record<EWeekDay, string>> = {
  [EWeekDay.SUNDAY]: "dimanche",
  [EWeekDay.MONDAY]: "lundi",
  [EWeekDay.TUESDAY]: "mardi",
  [EWeekDay.WEDNESDAY]: "mercredi",
  [EWeekDay.THURSDAY]: "jeudi",
  [EWeekDay.FRIDAY]: "vendredi",
  [EWeekDay.SATURDAY]: "samedi",
};
