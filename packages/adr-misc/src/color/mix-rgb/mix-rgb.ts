import type { IRgbColor } from "../hex-to-rgb";

/**
 * Mélange deux couleurs composante par composante (interpolation linéaire en sRGB).
 *
 * L'opacité n'est calculée que si l'une des couleurs en précise une (une opacité absente
 * vaut 1) : deux couleurs opaques donnent une couleur sans `a`, que `rgbToHex` écrit en
 * `#rrggbb`.
 *
 * @param first - Couleur obtenue pour `weight = 0`.
 * @param second - Couleur obtenue pour `weight = 1`.
 * @param weight - Part de `second` dans le mélange, entre 0 et 1 (non vérifiée ici).
 * @returns Les composantes mélangées, non arrondies.
 * @internal
 */
export function mixRgb(first: IRgbColor, second: IRgbColor, weight: number): IRgbColor {
  const mix = (from: number, to: number): number => from + (to - from) * weight;
  const color: IRgbColor = {
    r: mix(first.r, second.r),
    g: mix(first.g, second.g),
    b: mix(first.b, second.b),
  };
  if (first.a !== undefined || second.a !== undefined) {
    color.a = mix(first.a ?? 1, second.a ?? 1);
  }
  return color;
}
