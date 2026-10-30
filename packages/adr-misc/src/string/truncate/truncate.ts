// Ponctuation et espaces à ne pas laisser juste avant le suffixe (« Bonjour, … »).
const TRAILING_SEPARATORS = /[\s,;:\-–—]+$/u;
const WHITESPACE = /\s/u;

/**
 * Options de {@link truncate}.
 *
 * @example
 * ```ts
 * const options: ITruncateOptions = { wordBoundary: true, suffix: " [...]" };
 * truncate("Vingt mille lieues sous les mers", 20, options); // "Vingt mille [...]"
 * ```
 * @since 0.2.0
 */
export interface ITruncateOptions {
  /**
   * Texte ajouté à la fin d'un texte tronqué, compté dans `maxLength`.
   *
   * @defaultValue `"…"` (points de suspension typographiques, un seul caractère)
   */
  suffix?: string;
  /**
   * Coupe à la fin du dernier mot complet plutôt qu'au milieu d'un mot (sauf si le premier mot
   * dépasse à lui seul la longueur disponible).
   *
   * @defaultValue `false`
   */
  wordBoundary?: boolean;
}

/**
 * Indique si l'unité de code UTF-16 est la première moitié d'une paire de substitution
 * (emoji, caractère rare) : couper juste après produirait un caractère invalide.
 *
 * @param code - Unité de code UTF-16.
 * @returns `true` pour une première moitié de paire.
 */
function isHighSurrogate(code: number): boolean {
  return code >= 0xd800 && code <= 0xdbff;
}

/**
 * Calcule la position de coupe, en reculant au début du mot coupé si demandé.
 *
 * @param text - Texte à tronquer.
 * @param available - Nombre maximal d'unités de code conservées.
 * @param wordBoundary - Couper entre deux mots.
 * @returns La position de coupe.
 */
function cutIndex(text: string, available: number, wordBoundary: boolean): number {
  let index = available;
  if (wordBoundary && !WHITESPACE.test(text.charAt(index))) {
    const lastSpace = text.slice(0, index).search(/\s\S*$/u);
    index = lastSpace > 0 ? lastSpace : index;
  }
  return index > 0 && isHighSurrogate(text.charCodeAt(index - 1)) ? index - 1 : index;
}

/**
 * Tronque un texte trop long et y ajoute un suffixe (`…` par défaut).
 *
 * À utiliser pour afficher un résumé, un titre ou une description dans un espace limité
 * (carte, liste, notification). Le résultat, suffixe compris, ne dépasse jamais `maxLength`.
 * Un texte assez court est renvoyé tel quel. Les espaces et la ponctuation (`,`, `;`, `:`,
 * tirets) qui précéderaient le suffixe sont retirés. Une paire de substitution (emoji) n'est
 * jamais coupée en deux.
 *
 * @remarks
 * Les longueurs sont comptées en unités de code UTF-16 (`string.length`), comme les attributs
 * `maxlength` HTML et la plupart des bases de données.
 *
 * @param text - Texte à tronquer.
 * @param maxLength - Longueur maximale du résultat, suffixe compris (entier positif ou nul).
 * @param options - Options : `suffix` et `wordBoundary`.
 * @returns Le texte, tronqué et suffixé s'il dépassait `maxLength`.
 * @throws {@link RangeError} Si `maxLength` n'est pas un entier positif ou nul.
 * @example
 * ```ts
 * truncate("Le Comte de Monte-Cristo", 15); // "Le Comte de Mo…"
 * truncate("Le Comte de Monte-Cristo", 15, { wordBoundary: true }); // "Le Comte de…"
 * truncate("Court", 15); // "Court"
 * ```
 * @since 0.2.0
 */
export function truncate(text: string, maxLength: number, options: ITruncateOptions = {}): string {
  if (!Number.isInteger(maxLength) || maxLength < 0) {
    throw new RangeError(
      `La longueur maximale doit être un entier positif ou nul (reçu : ${maxLength}).`,
    );
  }
  if (text.length <= maxLength) {
    return text;
  }
  const { suffix = "…", wordBoundary = false } = options;
  const available = maxLength - suffix.length;
  if (available <= 0) {
    return suffix.slice(0, maxLength);
  }
  const kept = text.slice(0, cutIndex(text, available, wordBoundary));
  return kept.replace(TRAILING_SEPARATORS, "") + suffix;
}
