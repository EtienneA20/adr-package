/**
 * Options de {@link formatOrdinal}.
 *
 * @example
 * ```ts
 * const options: IFormatOrdinalOptions = { gender: "feminine" };
 * formatOrdinal(1, options); // "1re"
 * ```
 * @since 0.2.0
 */
export interface IFormatOrdinalOptions {
  /**
   * Genre du nom qualifié, qui ne change que « 1er » / « 1re » : `masculine` (le 1er tome) ou
   * `feminine` (la 1re édition).
   *
   * @defaultValue `"masculine"`
   */
  readonly gender?: "masculine" | "feminine";
}

/**
 * Formate un nombre ordinal selon l'usage typographique français : « 1er », « 1re », « 2e »,
 * « 21e ».
 *
 * À utiliser pour un rang, un numéro d'édition, un étage ou un siècle. Suit les
 * recommandations de l'Imprimerie nationale : « 2e » et non « 2ème » ni « 2nd ».
 *
 * @param value - Rang, entier positif ou nul.
 * @param options - Genre (voir {@link IFormatOrdinalOptions}).
 * @returns L'ordinal abrégé, sans exposant (« 1er », « 3e »).
 * @throws {@link RangeError} Si `value` n'est pas un entier positif ou nul.
 * @example
 * ```ts
 * formatOrdinal(1); // "1er"
 * formatOrdinal(1, { gender: "feminine" }); // "1re"
 * formatOrdinal(21); // "21e"
 * ```
 * @since 0.2.0
 */
export function formatOrdinal(value: number, options: IFormatOrdinalOptions = {}): string {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new RangeError(`Rang invalide : ${value}. Un entier positif ou nul est attendu.`);
  }
  if (value !== 1) {
    return `${value}e`;
  }
  return options.gender === "feminine" ? "1re" : "1er";
}
