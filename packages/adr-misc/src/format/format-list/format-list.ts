/**
 * Options de {@link formatList}.
 *
 * @example
 * ```ts
 * const options: IFormatListOptions = { type: "disjunction" };
 * formatList(["broché", "poche"], options); // "broché ou poche"
 * ```
 * @since 0.2.0
 */
export interface IFormatListOptions {
  /**
   * Liaison : `conjunction` (« et »), `disjunction` (« ou ») ou `unit` (simple énumération,
   * pour des mesures : « 1 h, 30 min »).
   *
   * @defaultValue `"conjunction"`
   */
  readonly type?: "conjunction" | "disjunction" | "unit";
  /**
   * Longueur de la liaison (`long`, `short` ou `narrow`), qui ne change rien en français pour
   * `conjunction` et `disjunction`.
   *
   * @defaultValue `"long"`
   */
  readonly style?: "long" | "short" | "narrow";
  /**
   * Locale BCP 47.
   *
   * @defaultValue `"fr-FR"`
   */
  readonly locale?: string;
}

/**
 * Formate une liste en français courant : « Zola, Hugo et Balzac ».
 *
 * À utiliser pour énumérer des auteurs, des genres ou des exemplaires dans une phrase. Les
 * éléments vides (ou composés d'espaces) sont ignorés, ce qui permet de passer des champs
 * facultatifs sans les filtrer.
 *
 * @param items - Éléments à énumérer, dans l'ordre.
 * @param options - Liaison, style et locale (voir {@link IFormatListOptions}).
 * @returns La liste formatée, ou `""` si aucun élément n'est renseigné.
 * @throws {@link RangeError} Si la locale est invalide.
 * @example
 * ```ts
 * formatList(["Zola", "Hugo", "Balzac"]); // "Zola, Hugo et Balzac"
 * formatList(["Zola", "", "Hugo"]); // "Zola et Hugo"
 * formatList(["roman", "essai"], { type: "disjunction" }); // "roman ou essai"
 * ```
 * @since 0.2.0
 */
export function formatList(items: readonly string[], options: IFormatListOptions = {}): string {
  return new Intl.ListFormat(options.locale ?? "fr-FR", {
    type: options.type ?? "conjunction",
    style: options.style ?? "long",
  }).format(items.filter((item) => item.trim() !== ""));
}
