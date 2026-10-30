import dayjs from "dayjs";
import type { ConfigType, Dayjs } from "dayjs";

/**
 * Options de {@link formatRelativeTime}.
 *
 * @example
 * ```ts
 * const options: IFormatRelativeTimeOptions = { now: new Date(2026, 0, 15), numeric: "always" };
 * formatRelativeTime(new Date(2026, 0, 14), options); // "il y a 1 jour"
 * ```
 * @since 0.2.0
 */
export interface IFormatRelativeTimeOptions {
  /**
   * Instant de référence. À fournir pour un résultat reproductible (tests, rendu serveur).
   *
   * @defaultValue l'instant présent
   */
  readonly now?: ConfigType;
  /**
   * Locale BCP 47.
   *
   * @defaultValue `"fr-FR"`
   */
  readonly locale?: string;
  /**
   * `auto` utilise les expressions usuelles (« hier », « demain », « maintenant »), `always`
   * toujours un nombre (« il y a 1 jour »).
   *
   * @defaultValue `"auto"`
   */
  readonly numeric?: "auto" | "always";
}

/** Unités courtes et valeur absolue à partir de laquelle on passe à l'unité suivante. */
const SMALL_UNITS: readonly (readonly ["second" | "minute" | "hour" | "day", number])[] = [
  ["second", 60],
  ["minute", 60],
  ["hour", 24],
  ["day", 7],
];

/**
 * Arrondit une quantité en évitant `-0`, que `Intl.RelativeTimeFormat` traiterait comme un
 * instant passé avec `numeric: "always"`.
 *
 * @param amount - Quantité décimale.
 * @returns L'entier le plus proche, `0` positif compris.
 */
function roundAmount(amount: number): number {
  return Math.round(amount) + 0;
}

/**
 * Choisit l'unité la plus parlante pour l'écart entre deux dates : secondes, minutes, heures et
 * jours tant que la valeur arrondie reste sous le seuil, puis semaines sous un mois, mois sous
 * un an, et années.
 *
 * @param date - Date à situer.
 * @param now - Instant de référence.
 * @returns La quantité signée (négative dans le passé) et son unité.
 */
function selectUnit(date: Dayjs, now: Dayjs): [number, Intl.RelativeTimeFormatUnit] {
  for (const [unit, limit] of SMALL_UNITS) {
    const amount = roundAmount(date.diff(now, unit, true));
    if (Math.abs(amount) < limit) {
      return [amount, unit];
    }
  }
  const months = date.diff(now, "month", true);
  if (Math.abs(Math.trunc(months)) < 1) {
    return [roundAmount(date.diff(now, "week", true)), "week"];
  }
  if (Math.abs(Math.trunc(months)) < 12) {
    return [roundAmount(months), "month"];
  }
  return [roundAmount(date.diff(now, "year", true)), "year"];
}

/**
 * Formate l'écart entre une date et maintenant en langage courant : « il y a 3 jours »,
 * « dans 2 heures », « hier », « le mois dernier ».
 *
 * À utiliser pour une date récente ou proche dont l'ordre de grandeur compte plus que la
 * valeur exacte : dernière connexion, retour attendu, ajout au catalogue. L'unité est choisie
 * automatiquement (secondes, minutes, heures, jours, semaines, mois, années).
 *
 * @param value - Date à situer : `Date`, chaîne ISO 8601, horodatage ou objet dayjs.
 * @param options - Instant de référence, locale et style (voir
 *   {@link IFormatRelativeTimeOptions}).
 * @returns L'écart formaté, ou `""` si la date ou l'instant de référence est absent ou invalide.
 * @throws {@link RangeError} Si la locale est invalide.
 * @example
 * ```ts
 * const now = new Date(2026, 0, 15, 12, 0);
 * formatRelativeTime(new Date(2026, 0, 12, 12, 0), { now }); // "il y a 3 jours"
 * formatRelativeTime(new Date(2026, 0, 15, 14, 0), { now }); // "dans 2 heures"
 * formatRelativeTime(new Date(2026, 0, 14, 12, 0), { now }); // "hier"
 * ```
 * @since 0.2.0
 */
export function formatRelativeTime(
  value: ConfigType,
  options: IFormatRelativeTimeOptions = {},
): string {
  if (value === null || value === undefined) {
    return "";
  }
  const date = dayjs(value);
  const now = dayjs(options.now ?? new Date());
  if (!date.isValid() || !now.isValid()) {
    return "";
  }
  const [amount, unit] = selectUnit(date, now);
  return new Intl.RelativeTimeFormat(options.locale ?? "fr-FR", {
    numeric: options.numeric ?? "auto",
  }).format(amount, unit);
}
