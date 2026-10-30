import { assertRatio } from "../assert-ratio";
import { hexToRgb } from "../hex-to-rgb";
import { rgbToHex } from "../rgb-to-hex";

/**
 * Applique une opacité à une couleur hexadécimale.
 *
 * À utiliser pour dériver une variante translucide d'une couleur de thème : voile d'une
 * modale, fond d'une alerte, ombre colorée. L'opacité éventuelle de la couleur d'origine est
 * remplacée (et non multipliée).
 *
 * @param hex - Couleur hexadécimale de départ.
 * @param alpha - Opacité, de 0 (transparent) à 1 (opaque).
 * @returns La couleur au format `#rrggbbaa`, ou `#rrggbb` si `alpha` vaut 1.
 * @throws {@link RangeError} Si `alpha` n'est pas entre 0 et 1.
 * @throws {@link Error} Si `hex` n'est pas une couleur hexadécimale valide.
 * @example
 * ```ts
 * withAlpha("#2563eb", 0.5); // "#2563eb80"
 * withAlpha("#2563eb80", 1); // "#2563eb"
 * ```
 * @since 0.2.0
 */
export function withAlpha(hex: string, alpha: number): string {
  assertRatio(alpha, "alpha");
  return rgbToHex({ ...hexToRgb(hex), a: alpha });
}
