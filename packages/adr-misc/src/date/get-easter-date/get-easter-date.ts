import dayjs from "dayjs";
import type { Dayjs } from "dayjs";

const MIN_YEAR = 1583;
const MAX_YEAR = 9999;

/**
 * Calcule la date du dimanche de Pâques (calendrier grégorien) d'une année.
 *
 * À utiliser pour dériver les fêtes mobiles (lundi de Pâques, Ascension, Pentecôte). Le calcul
 * suit l'algorithme de Meeus/Jones/Butcher, exact pour toute année grégorienne.
 *
 * @param year - Année, entière, de 1583 (première année complète du calendrier grégorien) à
 *   9999.
 * @returns Le dimanche de Pâques, à minuit (heure locale).
 * @throws {@link RangeError} Si l'année n'est pas un entier compris entre 1583 et 9999.
 * @example
 * ```ts
 * getEasterDate(2026).format("DD/MM/YYYY"); // "05/04/2026"
 * getEasterDate(2027).format("DD/MM/YYYY"); // "28/03/2027"
 * ```
 * @since 0.2.0
 */
export function getEasterDate(year: number): Dayjs {
  if (!Number.isInteger(year) || year < MIN_YEAR || year > MAX_YEAR) {
    throw new RangeError(`L'année doit être un entier compris entre ${MIN_YEAR} et ${MAX_YEAR}.`);
  }
  // Correspondance avec les lettres de Meeus : a = golden, b = century, c = yearOfCentury,
  // f = correction, g = lunarCorrection, h = epact, l = weekDayOffset, m = adjustment.
  const golden = year % 19;
  const century = Math.floor(year / 100);
  const yearOfCentury = year % 100;
  const correction = Math.floor((century + 8) / 25);
  const lunarCorrection = Math.floor((century - correction + 1) / 3);
  const epact = (19 * golden + century - Math.floor(century / 4) - lunarCorrection + 15) % 30;
  const weekDayOffset =
    (32 + 2 * (century % 4) + 2 * Math.floor(yearOfCentury / 4) - epact - (yearOfCentury % 4)) % 7;
  const adjustment = Math.floor((golden + 11 * epact + 22 * weekDayOffset) / 451);
  const total = epact + weekDayOffset - 7 * adjustment + 114;
  const month = Math.floor(total / 31);
  const day = (total % 31) + 1;
  return dayjs(new Date(year, month - 1, day));
}
