import { hexToRgb } from "../hex-to-rgb";

/**
 * Convertit une composante sRGB (0 à 255) en valeur linéaire (0 à 1).
 *
 * @param channel - Composante sRGB.
 * @returns La composante linéarisée.
 */
function toLinear(channel: number): number {
  const value = channel / 255;
  return value <= 0.040_45 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

/**
 * Calcule la luminance relative d'une couleur, au sens des WCAG 2.x.
 *
 * À utiliser pour comparer la clarté perçue de couleurs ou pour calculer un contraste (voir
 * `getContrastRatio`). L'opacité éventuelle est ignorée : la couleur est considérée comme
 * opaque.
 *
 * @remarks
 * Seuil de linéarisation de la norme sRGB (0,04045) ; les WCAG citent 0,03928, ce qui ne
 * change aucun résultat sur des composantes entières.
 *
 * @param hex - Couleur hexadécimale.
 * @returns La luminance relative, de 0 (noir) à 1 (blanc).
 * @throws {@link Error} Si `hex` n'est pas une couleur hexadécimale valide.
 * @example
 * ```ts
 * getLuminance("#ffffff"); // 1
 * getLuminance("#000000"); // 0
 * getLuminance("#2563eb"); // 0.1531… (environ)
 * ```
 * @since 0.2.0
 */
export function getLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}
