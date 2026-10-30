// `\s` couvre aussi les espaces insécables (U+00A0, U+202F), fines et cadratins, et les
// retours à la ligne.
const WHITESPACE_RUN = /\s+/gu;

/**
 * Remplace toute suite d'espaces par une espace simple et supprime les espaces de tête et de
 * fin.
 *
 * À utiliser pour nettoyer une saisie ou un texte copié-collé avant de le comparer, de le
 * rechercher ou de l'enregistrer : espaces multiples, tabulations, retours à la ligne, espaces
 * insécables (U+00A0) et fines insécables (U+202F, utilisées par `Intl.NumberFormat` en
 * français) deviennent tous une espace simple.
 *
 * @remarks
 * Supprime aussi les espaces insécables de la typographie française (avant « : », « ! »,
 * « ? », dans les guillemets) : ne pas l'appliquer à un texte destiné à l'affichage qui doit
 * les conserver.
 *
 * @param value - Texte à nettoyer.
 * @returns Le texte avec des espaces simples, sans espace de tête ni de fin.
 * @example
 * ```ts
 * normalizeWhitespace("  Le   Petit\tPrince\n"); // "Le Petit Prince"
 * normalizeWhitespace("1\u202f500\u00a0€"); // "1 500 €"
 * ```
 * @since 0.2.0
 */
export function normalizeWhitespace(value: string): string {
  return value.replace(WHITESPACE_RUN, " ").trim();
}
