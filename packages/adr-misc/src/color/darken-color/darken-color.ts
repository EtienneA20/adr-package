import { assertRatio } from "../assert-ratio";
import { hexToRgb } from "../hex-to-rgb";
import { mixRgb } from "../mix-rgb";
import { rgbToHex } from "../rgb-to-hex";

/**
 * Assombrit une couleur en la mélangeant avec du noir.
 *
 * À utiliser pour dériver une teinte foncée d'une couleur de thème : bordure, état actif
 * d'un bouton, texte sur un fond clair de la même teinte. L'opacité de la couleur d'origine
 * est conservée.
 *
 * @param hex - Couleur hexadécimale à assombrir.
 * @param amount - Part de noir, de 0 (couleur inchangée) à 1 (noir).
 * @returns La couleur assombrie au format `#rrggbb` (ou `#rrggbbaa`).
 * @throws {@link RangeError} Si `amount` n'est pas entre 0 et 1.
 * @throws {@link Error} Si `hex` n'est pas une couleur hexadécimale valide.
 * @example
 * ```ts
 * darkenColor("#2563eb", 0.2); // "#1e4fbc"
 * darkenColor("#2563eb", 1); // "#000000"
 * ```
 * @since 0.2.0
 */
export function darkenColor(hex: string, amount: number): string {
  assertRatio(amount, "amount");
  const color = hexToRgb(hex);
  return rgbToHex(mixRgb(color, { r: 0, g: 0, b: 0, a: color.a }, amount));
}
