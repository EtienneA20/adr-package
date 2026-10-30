import { getContrastRatio } from "../get-contrast-ratio";

/**
 * Options de {@link getReadableTextColor}.
 *
 * @example
 * ```ts
 * const options: IReadableTextColorOptions = { light: "#f8fafc", dark: "#0f172a" };
 * getReadableTextColor("#2563eb", options); // "#f8fafc"
 * ```
 * @since 0.2.0
 */
export interface IReadableTextColorOptions {
  /**
   * Couleur de texte claire candidate (hexadécimale).
   *
   * @defaultValue `"#ffffff"`
   */
  light?: string;
  /**
   * Couleur de texte sombre candidate (hexadécimale).
   *
   * @defaultValue `"#000000"`
   */
  dark?: string;
}

/**
 * Choisit, entre une couleur de texte claire et une sombre, celle qui contraste le plus avec
 * un fond.
 *
 * À utiliser quand le fond est variable (couleur d'une catégorie, avatar généré par
 * `stringToColor`, étiquette choisie par l'utilisateur) pour garantir un texte lisible. En
 * cas d'égalité, la couleur sombre est retenue. Le résultat n'est pas garanti conforme AA :
 * le vérifier avec `getContrastRatio` si besoin.
 *
 * @param background - Couleur de fond hexadécimale.
 * @param options - Couleurs candidates (voir {@link IReadableTextColorOptions}).
 * @returns `options.light` ou `options.dark`, telle que fournie.
 * @throws {@link Error} Si le fond ou une couleur candidate n'est pas hexadécimale.
 * @example
 * ```ts
 * getReadableTextColor("#2563eb"); // "#ffffff"
 * getReadableTextColor("#fde047"); // "#000000"
 * ```
 * @since 0.2.0
 */
export function getReadableTextColor(
  background: string,
  options: IReadableTextColorOptions = {},
): string {
  const { light = "#ffffff", dark = "#000000" } = options;
  return getContrastRatio(background, dark) >= getContrastRatio(background, light) ? dark : light;
}
