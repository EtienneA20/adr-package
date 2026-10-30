/**
 * Mois de l'année, numérotés comme `Date.prototype.getMonth()` et `dayjs().month()`
 * (janvier = 0).
 *
 * À utiliser à la place des nombres magiques, source classique d'erreurs « à un mois près »
 * avec le constructeur `Date`. Les libellés français sont dans `MONTH_LABELS`.
 *
 * @example
 * ```ts
 * EMonth.SEPTEMBER; // 8
 * new Date(2026, EMonth.OCTOBER, 29); // 29 octobre 2026
 * ```
 * @since 0.2.0
 */
export const EMonth = {
  JANUARY: 0,
  FEBRUARY: 1,
  MARCH: 2,
  APRIL: 3,
  MAY: 4,
  JUNE: 5,
  JULY: 6,
  AUGUST: 7,
  SEPTEMBER: 8,
  OCTOBER: 9,
  NOVEMBER: 10,
  DECEMBER: 11,
} as const;

/** Valeur possible de {@link EMonth}. */
export type EMonth = (typeof EMonth)[keyof typeof EMonth];
