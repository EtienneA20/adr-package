import { getLuminance } from "../get-luminance";

/**
 * Calcule le rapport de contraste entre deux couleurs, au sens des WCAG 2.x.
 *
 * À utiliser pour vérifier l'accessibilité d'un couple texte / fond : le niveau AA exige au
 * moins 4,5 pour un texte courant et 3 pour un grand texte ; le niveau AAA exige 7 et 4,5.
 * L'ordre des couleurs est indifférent et l'opacité est ignorée.
 *
 * @param first - Première couleur hexadécimale.
 * @param second - Seconde couleur hexadécimale.
 * @returns Le rapport de contraste, de 1 (couleurs identiques) à 21 (noir sur blanc), non
 * arrondi.
 * @throws {@link Error} Si l'une des couleurs n'est pas hexadécimale.
 * @example
 * ```ts
 * getContrastRatio("#000000", "#ffffff"); // 21
 * getContrastRatio("#2563eb", "#ffffff"); // 5.17 (environ) : conforme AA
 * ```
 * @since 0.2.0
 */
export function getContrastRatio(first: string, second: string): number {
  const firstLuminance = getLuminance(first);
  const secondLuminance = getLuminance(second);
  return (
    (Math.max(firstLuminance, secondLuminance) + 0.05) /
    (Math.min(firstLuminance, secondLuminance) + 0.05)
  );
}
