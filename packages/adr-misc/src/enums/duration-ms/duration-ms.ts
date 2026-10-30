/**
 * Durées usuelles exprimées en millisecondes.
 *
 * À utiliser pour les délais, durées de cache et intervalles (`staleTime`, `setTimeout`, TTL)
 * plutôt que des produits comme `24 * 60 * 60 * 1000`. Pour un calcul calendaire (ajouter un
 * jour à une date), préférer dayjs : un jour civil ne dure pas toujours 24 heures (changement
 * d'heure).
 *
 * @example
 * ```ts
 * const staleTime = 5 * EDurationMs.MINUTE; // 300000
 * EDurationMs.DAY; // 86400000
 * ```
 * @since 0.2.0
 */
export const EDurationMs = {
  SECOND: 1000,
  MINUTE: 60_000,
  HOUR: 3_600_000,
  DAY: 86_400_000,
  WEEK: 604_800_000,
} as const;

/** Valeur possible de {@link EDurationMs}. */
export type EDurationMs = (typeof EDurationMs)[keyof typeof EDurationMs];
