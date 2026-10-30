import { EMonth } from "../month";

/**
 * Libellés français des mois, indexés par la valeur de {@link EMonth} (et donc par
 * `Date.prototype.getMonth()`).
 *
 * À utiliser pour afficher un mois sans dépendre de la locale dayjs configurée. Les libellés
 * sont en minuscules, selon l'usage typographique français : mettre la majuscule à
 * l'affichage si besoin.
 *
 * @example
 * ```ts
 * MONTH_LABELS[EMonth.AUGUST]; // "août"
 * `${MONTH_LABELS[date.month() as EMonth]} ${date.year()}`; // "octobre 2026"
 * ```
 * @since 0.2.0
 */
export const MONTH_LABELS: Readonly<Record<EMonth, string>> = {
  [EMonth.JANUARY]: "janvier",
  [EMonth.FEBRUARY]: "février",
  [EMonth.MARCH]: "mars",
  [EMonth.APRIL]: "avril",
  [EMonth.MAY]: "mai",
  [EMonth.JUNE]: "juin",
  [EMonth.JULY]: "juillet",
  [EMonth.AUGUST]: "août",
  [EMonth.SEPTEMBER]: "septembre",
  [EMonth.OCTOBER]: "octobre",
  [EMonth.NOVEMBER]: "novembre",
  [EMonth.DECEMBER]: "décembre",
};
