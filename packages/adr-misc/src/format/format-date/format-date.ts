import type { ConfigType } from "dayjs";

import { formatDateValue } from "../date-value";

/**
 * Options de {@link formatDate} et de `formatDateTime`.
 *
 * @example
 * ```ts
 * const options: IFormatDateOptions = { format: "long" };
 * formatDate(new Date(2026, 0, 15), options); // "15 janvier 2026"
 * ```
 * @since 0.2.0
 */
export interface IFormatDateOptions {
  /**
   * Format de sortie : soit un format dayjs (`DD/MM/YYYY`, `YYYY-MM-DD`, `HH:mm`…), soit un
   * style `Intl.DateTimeFormat` traduit selon `locale` : `short` (« 15/01/2026 »), `medium`
   * (« 15 janv. 2026 »), `long` (« 15 janvier 2026 ») ou `full` (« jeudi 15 janvier 2026 »).
   *
   * @defaultValue `"DD/MM/YYYY"` pour `formatDate`, `"DD/MM/YYYY HH:mm"` pour `formatDateTime`
   */
  readonly format?: string;
  /**
   * Locale BCP 47 des styles `short`, `medium`, `long` et `full`. Sans effet sur un format
   * dayjs, qui suit la locale dayjs globale.
   *
   * @defaultValue `"fr-FR"`
   */
  readonly locale?: string;
}

/**
 * Formate une date au format français (« 15/01/2026 » par défaut).
 *
 * À utiliser pour afficher une date d'emprunt, de retour ou de naissance. Accepte tout ce que
 * dayjs accepte ; une date absente ou invalide donne une chaîne vide.
 *
 * @remarks
 * Pour les noms de mois et de jours en français, utiliser les styles `long` ou `full` (via
 * `Intl`) : avec un format dayjs (`D MMMM YYYY`), ils suivent la locale dayjs globale, en
 * anglais tant que le projet n'a pas chargé `dayjs/locale/fr`. Une chaîne est lue par dayjs
 * (ISO 8601) : pour une saisie au format français, la lire d'abord avec `parseDate`.
 *
 * @param value - Date à formater : `Date`, chaîne ISO 8601, horodatage en millisecondes ou objet
 *   dayjs. `null` et `undefined` donnent `""` (et non la date du jour).
 * @param options - Format et locale (voir {@link IFormatDateOptions}).
 * @returns La date formatée, ou `""` si elle est absente ou invalide.
 * @throws {@link RangeError} Si la locale d'un style `Intl` est invalide.
 * @example
 * ```ts
 * formatDate(new Date(2026, 0, 15)); // "15/01/2026"
 * formatDate("2026-01-15", { format: "full" }); // "jeudi 15 janvier 2026"
 * formatDate(new Date(2026, 0, 15), { format: "YYYY-MM-DD" }); // "2026-01-15"
 * formatDate(null); // ""
 * ```
 * @since 0.2.0
 */
export function formatDate(value: ConfigType, options: IFormatDateOptions = {}): string {
  return formatDateValue(value, {
    format: options.format ?? "DD/MM/YYYY",
    locale: options.locale ?? "fr-FR",
    withTime: false,
  });
}
