import { parseNumber } from "../parse-number";
import type { IParseNumberOptions } from "../parse-number";

/**
 * Convertit une saisie en nombre entier, avec les mêmes formats que `parseNumber`.
 *
 * À utiliser pour une quantité, un identifiant numérique ou un nombre d'exemplaires saisi par
 * un utilisateur : « 1 234 », « 1.234.567 », « 12,0 ». Une saisie décimale (« 12,5 ») n'est
 * pas arrondie : elle est refusée.
 *
 * @remarks
 * Convention des fonctions `parse*` : une saisie invalide renvoie `undefined` (pas d'erreur).
 * Pour une valeur par défaut : `parseInteger(saisie) ?? 1`.
 *
 * @param value - Saisie à convertir. Un `number` entier est renvoyé tel quel.
 * @param options - Séparateur décimal imposé (voir {@link IParseNumberOptions}).
 * @returns L'entier, ou `undefined` si la saisie est invalide, décimale ou hors de
 *   l'intervalle des entiers sûrs (`Number.MAX_SAFE_INTEGER`).
 * @example
 * ```ts
 * parseInteger("1 234"); // 1234
 * parseInteger("12,5"); // undefined
 * parseInteger("1.234.567"); // 1234567
 * ```
 * @since 0.2.0
 */
export function parseInteger(
  value: string | number | null | undefined,
  options: IParseNumberOptions = {},
): number | undefined {
  const parsed = parseNumber(value, options);
  return parsed !== undefined && Number.isSafeInteger(parsed) ? parsed : undefined;
}
