import { formatFiniteNumber } from "../finite-number";

/**
 * Options de {@link formatCurrency}.
 *
 * @example
 * ```ts
 * const options: IFormatCurrencyOptions = { currency: "USD", fractionDigits: 0 };
 * formatCurrency(1234.5, options); // "1 235 $US"
 * ```
 * @since 0.2.0
 */
export interface IFormatCurrencyOptions {
  /**
   * Code de devise ISO 4217.
   *
   * @defaultValue `"EUR"`
   */
  readonly currency?: string;
  /**
   * Locale BCP 47.
   *
   * @defaultValue `"fr-FR"`
   */
  readonly locale?: string;
  /**
   * Nombre exact de décimales.
   *
   * @defaultValue celui de la devise (2 pour l'euro)
   */
  readonly fractionDigits?: number;
}

/**
 * Formate un montant avec sa devise, au format français par défaut (« 1 234,50 € »).
 *
 * À utiliser pour afficher un prix, une pénalité de retard ou un total de facture. Une valeur
 * absente ou non finie donne une chaîne vide.
 *
 * @remarks
 * Le résultat contient des espaces insécables (U+202F entre les milliers, U+00A0 avant le
 * symbole) : en tenir compte dans les comparaisons de chaînes.
 *
 * @param value - Montant à formater, dans l'unité de la devise (euros, pas centimes).
 * @param options - Devise, locale et décimales (voir {@link IFormatCurrencyOptions}).
 * @returns Le montant formaté, ou `""` si `value` est `null`, `undefined`, `NaN` ou infini.
 * @throws {@link RangeError} Si le code de devise ou la locale est invalide, ou si
 *   `fractionDigits` est hors de l'intervalle 0 à 100.
 * @example
 * ```ts
 * formatCurrency(1234.5); // "1 234,50 €"
 * formatCurrency(-3, { fractionDigits: 0 }); // "-3 €"
 * formatCurrency(1234.5, { currency: "USD", locale: "en-US" }); // "$1,234.50"
 * ```
 * @since 0.2.0
 */
export function formatCurrency(
  value: number | null | undefined,
  options: IFormatCurrencyOptions = {},
): string {
  return formatFiniteNumber(value, options.locale ?? "fr-FR", {
    style: "currency",
    currency: options.currency ?? "EUR",
    minimumFractionDigits: options.fractionDigits,
    maximumFractionDigits: options.fractionDigits,
  });
}
