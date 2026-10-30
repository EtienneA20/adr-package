/**
 * Couleur décomposée en composantes rouge, verte, bleue et opacité facultative.
 *
 * Format d'échange de la catégorie `color` : produit par `hexToRgb`, consommé par
 * `rgbToHex`. Utile pour calculer sur les composantes ou pour construire une chaîne CSS
 * `rgb()`.
 *
 * @example
 * ```ts
 * const brand: IRgbColor = { r: 37, g: 99, b: 235 };
 * const overlay: IRgbColor = { r: 0, g: 0, b: 0, a: 0.5 };
 * ```
 * @since 0.2.0
 */
export interface IRgbColor {
  /** Composante rouge, de 0 à 255. */
  r: number;
  /** Composante verte, de 0 à 255. */
  g: number;
  /** Composante bleue, de 0 à 255. */
  b: number;
  /** Opacité, de 0 (transparent) à 1 (opaque). Absente : couleur opaque. */
  a?: number;
}

/** Chiffres hexadécimaux d'une couleur : 3, 4, 6 ou 8, avec ou sans `#`. */
const HEX_COLOR_PATTERN = /^#?([\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$/i;

/**
 * Décompose une couleur hexadécimale en composantes RVB (et opacité).
 *
 * À utiliser pour calculer sur une couleur saisie ou stockée en hexadécimal (thème d'une
 * catégorie de livres, couleur d'étiquette). Accepte les formats `#rgb`, `#rgba`, `#rrggbb` et
 * `#rrggbbaa`, en majuscules ou minuscules, avec ou sans `#`.
 *
 * @param hex - Couleur hexadécimale, par exemple `"#2563eb"` ou `"#fff"`.
 * @returns Les composantes `r`, `g`, `b` (0 à 255) et `a` (0 à 1, arrondie à 3 décimales)
 * seulement si la couleur précise une opacité.
 * @throws {@link Error} Si `hex` n'est pas une couleur hexadécimale valide.
 * @example
 * ```ts
 * hexToRgb("#2563eb"); // { r: 37, g: 99, b: 235 }
 * hexToRgb("#fff"); // { r: 255, g: 255, b: 255 }
 * hexToRgb("#00000080"); // { r: 0, g: 0, b: 0, a: 0.502 }
 * ```
 * @since 0.2.0
 */
export function hexToRgb(hex: string): IRgbColor {
  const digits = HEX_COLOR_PATTERN.exec(hex)?.[1];
  if (digits === undefined) {
    throw new Error(
      `Couleur hexadécimale invalide : « ${hex} » (formats acceptés : #rgb, #rgba, #rrggbb, #rrggbbaa).`,
    );
  }
  const full =
    digits.length <= 4 ? Array.from(digits, (digit) => digit.repeat(2)).join("") : digits;
  const channel = (index: number): number =>
    Number.parseInt(full.slice(index * 2, index * 2 + 2), 16);
  const color: IRgbColor = { r: channel(0), g: channel(1), b: channel(2) };
  if (full.length === 8) {
    color.a = Math.round((channel(3) / 255) * 1000) / 1000;
  }
  return color;
}
