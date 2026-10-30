import dayjs from "dayjs";
import type { Dayjs } from "dayjs";

import { getEasterDate } from "../get-easter-date";

/**
 * Jour férié français renvoyé par `getPublicHolidaysFr`.
 *
 * @example
 * ```ts
 * const holiday: IPublicHoliday = { date: dayjs("2026-07-14"), name: "Fête nationale" };
 * ```
 * @since 0.2.0
 */
export interface IPublicHoliday {
  /** Date du jour férié, à minuit (heure locale). */
  readonly date: Dayjs;
  /** Nom usuel en français (« Lundi de Pâques », « Fête nationale »…). */
  readonly name: string;
}

/**
 * Options communes aux fonctions qui tiennent compte des jours fériés français
 * (`getPublicHolidaysFr`, `isPublicHolidayFr`, `isBusinessDay`, `addBusinessDays`,
 * `countBusinessDays`).
 *
 * @example
 * ```ts
 * const options: IPublicHolidayOptions = { alsaceMoselle: true };
 * isBusinessDay("2026-12-26", options); // false (Saint-Étienne, et samedi)
 * ```
 * @since 0.2.0
 */
export interface IPublicHolidayOptions {
  /**
   * Ajoute les deux jours fériés propres à l'Alsace et à la Moselle : le Vendredi saint et la
   * Saint-Étienne (26 décembre).
   *
   * @defaultValue false
   */
  readonly alsaceMoselle?: boolean;
}

/** Jours fériés à date fixe : mois (0 = janvier), jour du mois, nom. */
const FIXED_HOLIDAYS: readonly (readonly [number, number, string])[] = [
  [0, 1, "Jour de l'an"],
  [4, 1, "Fête du Travail"],
  [4, 8, "Victoire 1945"],
  [6, 14, "Fête nationale"],
  [7, 15, "Assomption"],
  [10, 1, "Toussaint"],
  [10, 11, "Armistice 1918"],
  [11, 25, "Noël"],
];

/** Fêtes mobiles : écart en jours par rapport au dimanche de Pâques, nom. */
const EASTER_HOLIDAYS: readonly (readonly [number, string])[] = [
  [1, "Lundi de Pâques"],
  [39, "Ascension"],
  [50, "Lundi de Pentecôte"],
];

/**
 * Liste les jours fériés légaux de France métropolitaine pour une année, dans l'ordre
 * chronologique.
 *
 * À utiliser pour afficher un calendrier de fermeture ou alimenter un calcul de jours ouvrés.
 * Les 11 jours fériés nationaux sont renvoyés (les fêtes mobiles sont dérivées de Pâques) ;
 * l'option `alsaceMoselle` ajoute le Vendredi saint et la Saint-Étienne.
 *
 * @remarks
 * Deux jours fériés peuvent tomber le même jour (l'Ascension et le 1er mai en 2008) : ils sont
 * alors renvoyés tous les deux. Les jours fériés propres aux départements et régions d'outre-mer
 * (abolition de l'esclavage…) ne sont pas inclus.
 *
 * @param year - Année, entière, de 1583 à 9999.
 * @param options - Options (Alsace-Moselle).
 * @returns Les jours fériés de l'année, triés par date, à minuit (heure locale).
 * @throws {@link RangeError} Si l'année n'est pas un entier compris entre 1583 et 9999.
 * @example
 * ```ts
 * getPublicHolidaysFr(2026).map(({ date, name }) => `${date.format("DD/MM")} ${name}`);
 * // ["01/01 Jour de l'an", "06/04 Lundi de Pâques", "01/05 Fête du Travail", …]
 * getPublicHolidaysFr(2026, { alsaceMoselle: true }).length; // 13
 * ```
 * @since 0.2.0
 */
export function getPublicHolidaysFr(
  year: number,
  options: IPublicHolidayOptions = {},
): IPublicHoliday[] {
  const easter = getEasterDate(year);
  const fixed = FIXED_HOLIDAYS.map(([month, day, name]) => ({
    date: dayjs(new Date(year, month, day)),
    name,
  }));
  const movable = EASTER_HOLIDAYS.map(([offset, name]) => ({
    date: easter.add(offset, "day"),
    name,
  }));
  const regional =
    options.alsaceMoselle === true
      ? [
          { date: easter.subtract(2, "day"), name: "Vendredi saint" },
          { date: dayjs(new Date(year, 11, 26)), name: "Saint-Étienne" },
        ]
      : [];
  return [...fixed, ...movable, ...regional].sort(
    (first, second) => first.date.valueOf() - second.date.valueOf(),
  );
}
