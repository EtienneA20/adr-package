import dayjs from "dayjs";
import type { ConfigType } from "dayjs";

/** Styles `Intl.DateTimeFormat` acceptés à la place d'un format dayjs. */
type DateStyle = "short" | "medium" | "long" | "full";

/** Réglages résolus de {@link formatDateValue}. */
interface IDateValueSettings {
  /** Format dayjs (`DD/MM/YYYY`…) ou style `Intl` (`short`, `medium`, `long`, `full`). */
  readonly format: string;
  /** Locale BCP 47 utilisée pour les styles `Intl`. */
  readonly locale: string;
  /** Ajoute l'heure (style `short`) aux styles `Intl`. */
  readonly withTime: boolean;
}

/** Valeurs de {@link DateStyle}. */
const DATE_STYLES: ReadonlySet<string> = new Set(["short", "medium", "long", "full"]);

/**
 * Indique si un format est un style `Intl` plutôt qu'un format dayjs.
 *
 * @param format - Format demandé.
 * @returns `true` pour `short`, `medium`, `long` ou `full`.
 */
function isDateStyle(format: string): format is DateStyle {
  return DATE_STYLES.has(format);
}

/**
 * Formate une date pour `formatDate` et `formatDateTime`.
 *
 * Les styles passent par `Intl.DateTimeFormat` car les formats dayjs ne traduisent les noms de
 * mois et de jours qu'avec une locale dayjs chargée, ce que le package s'interdit (aucun effet
 * de bord à l'import).
 *
 * @param value - Date à formater. `null` et `undefined` donnent `""` (et non l'instant présent).
 * @param settings - Format, locale et présence de l'heure.
 * @returns La date formatée, ou `""` si elle est absente ou invalide.
 * @throws {@link RangeError} Si la locale est refusée par `Intl.DateTimeFormat`.
 * @internal
 */
export function formatDateValue(value: ConfigType, settings: IDateValueSettings): string {
  if (value === null || value === undefined) {
    return "";
  }
  const date = dayjs(value);
  if (!date.isValid()) {
    return "";
  }
  if (!isDateStyle(settings.format)) {
    return date.format(settings.format);
  }
  const options: Intl.DateTimeFormatOptions = settings.withTime
    ? { dateStyle: settings.format, timeStyle: "short" }
    : { dateStyle: settings.format };
  return new Intl.DateTimeFormat(settings.locale, options).format(date.toDate());
}
