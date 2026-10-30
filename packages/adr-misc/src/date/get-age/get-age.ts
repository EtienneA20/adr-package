import dayjs from "dayjs";
import type { ConfigType } from "dayjs";

import { parseDate } from "../parse-date";

/**
 * Calcule l'âge en années révolues d'une personne à une date donnée.
 *
 * À utiliser pour un contrôle d'âge (adhésion, tarif, majorité) : l'anniversaire est compté
 * le jour même. Une personne née un 29 février prend un an le 1er mars des années non
 * bissextiles.
 *
 * @param birthDate - Date de naissance.
 * @param referenceDate - Date à laquelle calculer l'âge (par défaut, maintenant).
 * @returns L'âge en années entières.
 * @throws {@link Error} Si une des dates est invalide, ou si la date de naissance est
 *   postérieure à la date de référence.
 * @example
 * ```ts
 * getAge("2008-10-29", "2026-10-29"); // 18
 * getAge("2008-10-30", "2026-10-29"); // 17
 * getAge(member.birthDate) >= 18; // majeur aujourd'hui
 * ```
 * @since 0.2.0
 */
export function getAge(birthDate: ConfigType, referenceDate: ConfigType = dayjs()): number {
  const birth = parseDate(birthDate, "Date de naissance");
  const reference = parseDate(referenceDate, "Date de référence");
  if (birth.isAfter(reference, "day")) {
    throw new Error("La date de naissance est postérieure à la date de référence.");
  }
  const birthdayPassed =
    reference.month() > birth.month() ||
    (reference.month() === birth.month() && reference.date() >= birth.date());
  return reference.year() - birth.year() - (birthdayPassed ? 0 : 1);
}
