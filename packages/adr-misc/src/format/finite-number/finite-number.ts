/**
 * Formate un nombre avec `Intl.NumberFormat`, ou renvoie une chaîne vide s'il est absent ou non
 * fini.
 *
 * Centralise la convention des fonctions `format*` de nombres : une valeur absente ou invalide
 * s'affiche comme une cellule vide plutôt que « NaN » ou « ∞ », sans lever d'erreur.
 *
 * @param value - Nombre à formater.
 * @param locale - Locale BCP 47 (`fr-FR`…).
 * @param options - Options transmises à `Intl.NumberFormat`.
 * @returns Le nombre formaté, ou `""` si `value` est `null`, `undefined`, `NaN` ou infini.
 * @throws {@link RangeError} Si la locale ou les options sont refusées par `Intl.NumberFormat`.
 * @internal
 */
export function formatFiniteNumber(
  value: number | null | undefined,
  locale: string,
  options: Intl.NumberFormatOptions,
): string {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return "";
  }
  return new Intl.NumberFormat(locale, options).format(value);
}
