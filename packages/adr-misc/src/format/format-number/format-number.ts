import { formatFiniteNumber } from "../finite-number";

/**
 * Options de {@link formatNumber}.
 *
 * @example
 * ```ts
 * const options: IFormatNumberOptions = { maximumFractionDigits: 1, signDisplay: "exceptZero" };
 * formatNumber(2.345, options); // "+2,3"
 * ```
 * @since 0.2.0
 */
export interface IFormatNumberOptions {
  /**
   * Locale BCP 47.
   *
   * @defaultValue `"fr-FR"`
   */
  readonly locale?: string;
  /**
   * Nombre minimal de décimales (complété par des zéros).
   *
   * @defaultValue `0`
   */
  readonly minimumFractionDigits?: number;
  /**
   * Nombre maximal de décimales (arrondi au plus proche).
   *
   * @defaultValue `3`, ou `minimumFractionDigits` s'il est plus grand
   */
  readonly maximumFractionDigits?: number;
  /**
   * Affichage du signe : `auto` (négatifs seulement), `always`, `exceptZero` (utile pour une
   * variation : « +3 », « -2 », « 0 ») ou `never`.
   *
   * @defaultValue `"auto"`
   */
  readonly signDisplay?: "auto" | "always" | "exceptZero" | "never";
}

/**
 * Formate un nombre au format français : espace fine insécable entre les milliers (U+202F) et
 * virgule décimale.
 *
 * À utiliser pour afficher une quantité, un total ou une statistique. Une valeur absente ou non
 * finie donne une chaîne vide, pour afficher une cellule vide plutôt que « NaN ».
 *
 * @param value - Nombre à formater.
 * @param options - Locale, décimales et signe (voir {@link IFormatNumberOptions}).
 * @returns Le nombre formaté, ou `""` si `value` est `null`, `undefined`, `NaN` ou infini.
 * @throws {@link RangeError} Si la locale est invalide ou si le nombre de décimales est hors de
 *   l'intervalle 0 à 100 (ou si le minimum dépasse le maximum).
 * @example
 * ```ts
 * formatNumber(1234567.891); // "1 234 567,891"
 * formatNumber(1234.5, { minimumFractionDigits: 2 }); // "1 234,50"
 * formatNumber(Number.NaN); // ""
 * ```
 * @since 0.2.0
 */
export function formatNumber(
  value: number | null | undefined,
  options: IFormatNumberOptions = {},
): string {
  return formatFiniteNumber(value, options.locale ?? "fr-FR", {
    minimumFractionDigits: options.minimumFractionDigits,
    maximumFractionDigits: options.maximumFractionDigits,
    signDisplay: options.signDisplay,
  });
}
