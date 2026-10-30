import { assertRatio } from "../assert-ratio";
import { hexToRgb } from "../hex-to-rgb";
import { mixRgb } from "../mix-rgb";
import { rgbToHex } from "../rgb-to-hex";

/**
 * Mélange deux couleurs hexadécimales dans une proportion donnée.
 *
 * À utiliser pour une couleur intermédiaire : nuance entre deux couleurs de thème, dégradé
 * par paliers (état d'une jauge de retard du vert au rouge). Le mélange est linéaire sur les
 * composantes sRGB, comme `mix()` de Sass ; l'opacité est mélangée si l'une des couleurs en
 * précise une.
 *
 * @param first - Première couleur hexadécimale (obtenue pour `weight = 0`).
 * @param second - Seconde couleur hexadécimale (obtenue pour `weight = 1`).
 * @param weight - Part de `second` dans le mélange, entre 0 et 1.
 * @defaultValue `weight` : `0.5`
 * @returns La couleur mélangée au format `#rrggbb` (ou `#rrggbbaa` si elle est translucide).
 * @throws {@link RangeError} Si `weight` n'est pas entre 0 et 1.
 * @throws {@link Error} Si l'une des couleurs n'est pas hexadécimale.
 * @example
 * ```ts
 * mixColors("#ff0000", "#0000ff"); // "#800080"
 * mixColors("#16a34a", "#dc2626", 0.25); // "#488441"
 * ```
 * @since 0.2.0
 */
export function mixColors(first: string, second: string, weight = 0.5): string {
  assertRatio(weight, "weight");
  return rgbToHex(mixRgb(hexToRgb(first), hexToRgb(second), weight));
}
