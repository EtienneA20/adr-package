import type { ConfigType } from "dayjs";

import { formatDateValue } from "../date-value";
import type { IFormatDateOptions } from "../format-date";

/**
 * Formate une date et son heure au format français (« 15/01/2026 10:30 » par défaut).
 *
 * À utiliser pour afficher l'horodatage d'une réservation, d'un retour ou d'une connexion. Une
 * date absente ou invalide donne une chaîne vide. L'heure est celle du fuseau local.
 *
 * @remarks
 * Avec un style `Intl` (`short`, `medium`, `long`, `full`), l'heure est ajoutée au style
 * `short` : « 15 janvier 2026 à 10:30 ». Les noms de mois d'un format dayjs suivent la locale
 * dayjs globale (voir `formatDate`).
 *
 * @param value - Date à formater : `Date`, chaîne ISO 8601, horodatage en millisecondes ou objet
 *   dayjs. `null` et `undefined` donnent `""` (et non l'instant présent).
 * @param options - Format et locale (voir {@link IFormatDateOptions}). Format par défaut :
 *   `"DD/MM/YYYY HH:mm"`.
 * @returns La date et l'heure formatées, ou `""` si la date est absente ou invalide.
 * @throws {@link RangeError} Si la locale d'un style `Intl` est invalide.
 * @example
 * ```ts
 * formatDateTime(new Date(2026, 0, 15, 10, 30)); // "15/01/2026 10:30"
 * formatDateTime(new Date(2026, 0, 15, 10, 30), { format: "long" }); // "15 janvier 2026 à 10:30"
 * formatDateTime(new Date(2026, 0, 15, 10, 30, 45), { format: "DD/MM/YYYY HH:mm:ss" });
 * // "15/01/2026 10:30:45"
 * ```
 * @since 0.2.0
 */
export function formatDateTime(value: ConfigType, options: IFormatDateOptions = {}): string {
  return formatDateValue(value, {
    format: options.format ?? "DD/MM/YYYY HH:mm",
    locale: options.locale ?? "fr-FR",
    withTime: true,
  });
}
