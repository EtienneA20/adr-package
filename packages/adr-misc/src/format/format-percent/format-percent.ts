import { formatFiniteNumber } from "../finite-number";

/**
 * Options de {@link formatPercent}.
 *
 * @example
 * ```ts
 * const options: IFormatPercentOptions = { minimumFractionDigits: 2 };
 * formatPercent(0.5, options); // "50,00 %"
 * ```
 * @since 0.2.0
 */
export interface IFormatPercentOptions {
  /**
   * Locale BCP 47.
   *
   * @defaultValue `"fr-FR"`
   */
  readonly locale?: string;
  /**
   * Nombre minimal de décimales du pourcentage (complété par des zéros).
   *
   * @defaultValue `0`
   */
  readonly minimumFractionDigits?: number;
  /**
   * Nombre maximal de décimales du pourcentage.
   *
   * @defaultValue `1`, ou `minimumFractionDigits` s'il est plus grand
   */
  readonly maximumFractionDigits?: number;
}

/**
 * Formate un ratio en pourcentage, au format français (« 12,5 % »).
 *
 * À utiliser pour afficher un taux (taux de retour des livres, part des adhérents actifs…).
 * La valeur est un **ratio** : `0.125` donne « 12,5 % », comme le renvoie `parseNumber`
 * pour « 12,5 % ».
 *
 * @param ratio - Ratio à formater (`1` = 100 %).
 * @param options - Locale et décimales (voir {@link IFormatPercentOptions}).
 * @returns Le pourcentage formaté (espace insécable U+00A0 avant `%`), ou `""` si `ratio` est
 *   `null`, `undefined`, `NaN` ou infini.
 * @throws {@link RangeError} Si la locale est invalide ou si le nombre de décimales est hors de
 *   l'intervalle 0 à 100 (ou si le minimum dépasse le maximum).
 * @example
 * ```ts
 * formatPercent(0.125); // "12,5 %"
 * formatPercent(0.4567); // "45,7 %"
 * formatPercent(1); // "100 %"
 * ```
 * @since 0.2.0
 */
export function formatPercent(
  ratio: number | null | undefined,
  options: IFormatPercentOptions = {},
): string {
  const minimumFractionDigits = options.minimumFractionDigits ?? 0;
  return formatFiniteNumber(ratio, options.locale ?? "fr-FR", {
    style: "percent",
    minimumFractionDigits,
    maximumFractionDigits: options.maximumFractionDigits ?? Math.max(1, minimumFractionDigits),
  });
}
