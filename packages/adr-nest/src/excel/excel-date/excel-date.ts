const MS_PER_DAY = 86_400_000;
/** Numéro de série Excel du 1970-01-01 (origine du système 1900 : 1899-12-30). */
const UNIX_EPOCH_SERIAL = 25_569;
/**
 * Premier numéro de série fiable : avant le 1900-03-01, Excel compte un 29 février 1900 qui
 * n'existe pas, et il ne connaît pas les dates antérieures à 1900.
 */
const FIRST_RELIABLE_SERIAL = 61;

const formatters = new Map<string, Intl.DateTimeFormat>();

function partsFormatter(timeZone: string): Intl.DateTimeFormat {
  let formatter = formatters.get(timeZone);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat("en-US", {
      timeZone,
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hourCycle: "h23",
    });
    formatters.set(timeZone, formatter);
  }
  return formatter;
}

/**
 * Convertit une date en numéro de série Excel (jours depuis 1899-12-30, heure en fraction),
 * selon l'heure murale du fuseau donné : une cellule datée affiche l'heure de Paris, pas l'UTC.
 *
 * @param date - Date à convertir.
 * @param timeZone - Fuseau horaire (`Europe/Paris`…).
 * @returns Le numéro de série, ou `undefined` pour une date antérieure au 1900-03-01 (non
 * représentable correctement : à écrire en texte).
 * @example
 * ```ts
 * toExcelSerial(new Date("2026-01-31T23:00:00Z"), "Europe/Paris"); // 46054 (1er février, 0 h)
 * ```
 * @internal
 */
export function toExcelSerial(date: Date, timeZone: string): number | undefined {
  const parts = Object.fromEntries(
    partsFormatter(timeZone)
      .formatToParts(date)
      .map((part) => [part.type, Number(part.value)]),
  ) as Record<"year" | "month" | "day" | "hour" | "minute" | "second", number>;
  const wallClock = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
  );
  const serial = wallClock / MS_PER_DAY + UNIX_EPOCH_SERIAL;
  return serial >= FIRST_RELIABLE_SERIAL ? serial : undefined;
}
