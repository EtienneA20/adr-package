import type { ConfigType, Dayjs, OpUnitType } from "dayjs";

import { parseDate } from "../parse-date";

/**
 * Convertit et valide les deux bornes d'une période, dans l'ordre chronologique.
 *
 * Partagé par les fonctions qui parcourent ou comparent une période, pour qu'elles lèvent
 * toutes les mêmes erreurs.
 *
 * @param start - Début de la période.
 * @param end - Fin de la période.
 * @param unit - Granularité de la comparaison des bornes (deux heures du même jour sont dans
 *   l'ordre à la granularité `"day"`).
 * @returns Les deux bornes, converties en dates dayjs.
 * @throws {@link Error} Si une borne est invalide, ou si le début est postérieur à la fin.
 * @internal
 */
export function parseDateRange(
  start: ConfigType,
  end: ConfigType,
  unit: OpUnitType,
): readonly [Dayjs, Dayjs] {
  const startDate = parseDate(start, "Date de début");
  const endDate = parseDate(end, "Date de fin");
  if (startDate.isAfter(endDate, unit)) {
    throw new Error("La date de début est postérieure à la date de fin.");
  }
  return [startDate, endDate];
}
