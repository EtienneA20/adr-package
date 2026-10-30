import { assertRatio } from "../assert-ratio";
import { hexToRgb } from "../hex-to-rgb";
import { mixRgb } from "../mix-rgb";
import { rgbToHex } from "../rgb-to-hex";

/**
 * Éclaircit une couleur en la mélangeant avec du blanc.
 *
 * À utiliser pour dériver une teinte claire d'une couleur de thème : fond d'une étiquette,
 * état survolé, ligne surlignée d'un tableau. L'opacité de la couleur d'origine est
 * conservée.
 *
 * @param hex - Couleur hexadécimale à éclaircir.
 * @param amount - Part de blanc, de 0 (couleur inchangée) à 1 (blanc).
 * @returns La couleur éclaircie au format `#rrggbb` (ou `#rrggbbaa`).
 * @throws {@link RangeError} Si `amount` n'est pas entre 0 et 1.
 * @throws {@link Error} Si `hex` n'est pas une couleur hexadécimale valide.
 * @example
 * ```ts
 * lightenColor("#2563eb", 0.2); // "#5182ef"
 * lightenColor("#2563eb", 0.9); // "#e9effd"
 * ```
 * @since 0.2.0
 */
export function lightenColor(hex: string, amount: number): string {
  assertRatio(amount, "amount");
  const color = hexToRgb(hex);
  return rgbToHex(mixRgb(color, { r: 255, g: 255, b: 255, a: color.a }, amount));
}
