import type { IRgbColor } from "../hex-to-rgb";
import { rgbToHex } from "../rgb-to-hex";

/**
 * Options de {@link stringToColor}.
 *
 * @example
 * ```ts
 * const pastel: IStringToColorOptions = { saturation: 60, lightness: 85 };
 * stringToColor("Science-fiction", pastel);
 * ```
 * @since 0.2.0
 */
export interface IStringToColorOptions {
  /**
   * Saturation HSL, en pourcentage (0 : gris, 100 : couleur vive).
   *
   * @defaultValue `65`
   */
  saturation?: number;
  /**
   * Luminosité HSL, en pourcentage (0 : noir, 100 : blanc).
   *
   * @defaultValue `45`
   */
  lightness?: number;
}

/**
 * Hache un texte en entier 32 bits non signé (FNV-1a sur les unités UTF-16).
 *
 * @param text - Texte à hacher.
 * @returns Le hachage, stable d'un environnement à l'autre.
 */
function hashText(text: string): number {
  let hash = 0x81_1c_9d_c5;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 0x01_00_01_93);
  }
  return hash >>> 0;
}

/**
 * Convertit une couleur HSL en composantes RVB entières.
 *
 * @param hue - Teinte, en degrés (0 à 359).
 * @param saturation - Saturation, en pourcentage.
 * @param lightness - Luminosité, en pourcentage.
 * @returns Les composantes RVB, arrondies à l'entier.
 */
function hslToRgb(hue: number, saturation: number, lightness: number): IRgbColor {
  const light = lightness / 100;
  const chroma = (saturation / 100) * Math.min(light, 1 - light);
  const channel = (offset: number): number => {
    const sector = (offset + hue / 30) % 12;
    return Math.round(255 * (light - chroma * Math.max(-1, Math.min(sector - 3, 9 - sector, 1))));
  };
  return { r: channel(0), g: channel(8), b: channel(4) };
}

/**
 * Vérifie qu'un pourcentage est compris entre 0 et 100.
 *
 * @param value - Pourcentage à vérifier.
 * @param name - Nom de l'option, cité dans le message d'erreur.
 * @throws {@link RangeError} Si `value` n'est pas entre 0 et 100.
 */
function assertPercent(value: number, name: string): void {
  if (!(value >= 0 && value <= 100)) {
    throw new RangeError(
      `L'option « ${name} » doit être un pourcentage entre 0 et 100 (reçu : ${value}).`,
    );
  }
}

/**
 * Dérive d'un texte une couleur stable : le même texte donne toujours la même couleur.
 *
 * À utiliser pour colorer automatiquement un élément identifié par un texte : avatar d'un
 * adhérent (à partir de son nom), étiquette d'un genre littéraire, série d'un graphique. Seule
 * la teinte dépend du texte ; saturation et luminosité sont fixes, ce qui donne des couleurs
 * homogènes. Combiner avec `getReadableTextColor` pour le texte posé dessus. Deux textes
 * différents peuvent donner la même teinte (360 teintes possibles).
 *
 * @param text - Texte source (nom, identifiant, libellé). La casse compte.
 * @param options - Saturation et luminosité (voir {@link IStringToColorOptions}).
 * @returns Une couleur au format `#rrggbb`.
 * @throws {@link RangeError} Si `saturation` ou `lightness` n'est pas entre 0 et 100.
 * @example
 * ```ts
 * const background = stringToColor("Marie Curie"); // toujours la même couleur pour ce nom
 * const text = getReadableTextColor(background);
 * stringToColor("Policier", { saturation: 60, lightness: 85 }); // variante pastel
 * ```
 * @since 0.2.0
 */
export function stringToColor(text: string, options: IStringToColorOptions = {}): string {
  const { saturation = 65, lightness = 45 } = options;
  assertPercent(saturation, "saturation");
  assertPercent(lightness, "lightness");
  return rgbToHex(hslToRgb(hashText(text) % 360, saturation, lightness));
}
