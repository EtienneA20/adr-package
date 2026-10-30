/**
 * Jours de la semaine, numérotés comme `Date.prototype.getDay()` et `dayjs().day()`
 * (dimanche = 0).
 *
 * À utiliser à la place des nombres magiques quand on compare ou stocke un jour de la semaine
 * (jours d'ouverture, récurrences). Les libellés français sont dans `WEEK_DAY_LABELS`.
 *
 * @example
 * ```ts
 * EWeekDay.MONDAY; // 1
 * new Date(2026, 9, 31).getDay() === EWeekDay.SATURDAY; // true
 * ```
 * @since 0.2.0
 */
export const EWeekDay = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
} as const;

/** Valeur possible de {@link EWeekDay}. */
export type EWeekDay = (typeof EWeekDay)[keyof typeof EWeekDay];
