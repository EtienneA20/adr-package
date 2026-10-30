import dayjs from "dayjs";
import type { ConfigType, Dayjs } from "dayjs";

/**
 * Convertit une entrée en date dayjs et vérifie qu'elle est valide.
 *
 * Centralise la validation et le message d'erreur des fonctions de la catégorie `date` : une
 * date invalide (`null`, chaîne non reconnue, `new Date(Number.NaN)`) ferait sinon renvoyer
 * `NaN` ou « Invalid Date » sans prévenir.
 *
 * @param value - Date à convertir (tout ce qu'accepte `dayjs()` ; `undefined` désigne
 *   l'instant présent).
 * @param label - Libellé de la date dans le message d'erreur (« Date de naissance »…).
 * @returns La date dayjs, valide.
 * @throws {@link Error} Si la date est invalide.
 * @internal
 */
export function parseDate(value: ConfigType, label = "Date"): Dayjs {
  const date = dayjs(value);
  if (!date.isValid()) {
    throw new Error(`${label} invalide.`);
  }
  return date;
}
