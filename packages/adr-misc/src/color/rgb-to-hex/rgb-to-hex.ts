import type { IRgbColor } from "../hex-to-rgb";

/**
 * Convertit une composante en octet hexadécimal à deux chiffres.
 *
 * @param value - Composante à convertir.
 * @param max - Valeur maximale de la composante (255 pour r, g, b ; 1 pour l'opacité).
 * @returns L'octet hexadécimal correspondant, en minuscules.
 * @throws {@link RangeError} Si la composante n'est pas un nombre entre 0 et `max`.
 */
function toHexByte(value: number, max: number): string {
  if (!(value >= 0 && value <= max)) {
    throw new RangeError(
      `Composante de couleur hors limites : ${value} (attendue entre 0 et ${max}).`,
    );
  }
  return Math.round((value / max) * 255)
    .toString(16)
    .padStart(2, "0");
}

/**
 * Convertit des composantes RVB (et opacité) en couleur hexadécimale.
 *
 * À utiliser pour revenir à une couleur CSS ou stockable après un calcul sur les composantes.
 * Les composantes décimales sont arrondies. L'opacité n'est écrite (format `#rrggbbaa`) que si
 * elle est inférieure à 1 une fois arrondie à l'octet : une couleur opaque donne toujours
 * `#rrggbb`.
 *
 * @param color - Composantes `r`, `g`, `b` (0 à 255) et `a` facultative (0 à 1).
 * @returns La couleur au format `#rrggbb` ou `#rrggbbaa`, en minuscules.
 * @throws {@link RangeError} Si une composante est hors limites ou n'est pas un nombre.
 * @example
 * ```ts
 * rgbToHex({ r: 37, g: 99, b: 235 }); // "#2563eb"
 * rgbToHex({ r: 0, g: 0, b: 0, a: 0.5 }); // "#00000080"
 * rgbToHex({ r: 255, g: 255, b: 255, a: 1 }); // "#ffffff"
 * ```
 * @since 0.2.0
 */
export function rgbToHex(color: IRgbColor): string {
  const { r, g, b, a } = color;
  const rgb = [r, g, b].map((value) => toHexByte(value, 255)).join("");
  const alpha = a === undefined ? "" : toHexByte(a, 1);
  return `#${rgb}${alpha === "ff" ? "" : alpha}`;
}
