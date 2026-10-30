const WORD = /[\p{L}\p{M}\p{N}]+/gu;
const FIRST_WORD_CHAR = /[\p{L}\p{M}\p{N}]/u;
const LAST_WORD = /[\p{L}\p{M}\p{N}]+$/u;
const APOSTROPHES = new Set(["'", "’"]);
// Mots élidés devant une apostrophe : le mot qui suit est un vrai mot (« l’Île », « d’Artagnan »).
const ELISIONS = new Set([
  "c",
  "d",
  "j",
  "l",
  "m",
  "n",
  "s",
  "t",
  "qu",
  "jusqu",
  "lorsqu",
  "puisqu",
  "quoiqu",
]);
const FRENCH_MINOR_WORDS: readonly string[] = [
  "à",
  "au",
  "aux",
  "avec",
  "d",
  "dans",
  "de",
  "des",
  "du",
  "en",
  "et",
  "l",
  "la",
  "le",
  "les",
  "ni",
  "ou",
  "par",
  "pour",
  "sans",
  "sous",
  "sur",
  "un",
  "une",
];

/**
 * Options de {@link toTitleCase}.
 *
 * @example
 * ```ts
 * const options: IToTitleCaseOptions = { lowercaseMinorWords: true };
 * toTitleCase("le comte de monte-cristo", options); // "Le Comte de Monte-Cristo"
 * ```
 * @since 0.2.0
 */
export interface IToTitleCaseOptions {
  /**
   * Laisse les petits mots (articles, prépositions, conjonctions) en minuscules, sauf s'ils
   * ouvrent le texte.
   *
   * @defaultValue `false`
   */
  lowercaseMinorWords?: boolean;
  /**
   * Liste des petits mots laissés en minuscules quand `lowercaseMinorWords` est vrai
   * (comparaison insensible à la casse).
   *
   * @defaultValue les petits mots français : à, au, aux, avec, d, dans, de, des, du, en, et, l,
   * la, le, les, ni, ou, par, pour, sans, sous, sur, un, une
   */
  minorWords?: readonly string[];
}

/**
 * Indique si un mot prolonge le mot précédent après une apostrophe qui n'est pas une élision
 * (« aujourd’hui », « prud’hommes ») : il ne doit alors pas prendre de majuscule.
 *
 * @param value - Texte complet.
 * @param offset - Position du mot dans le texte.
 * @returns `true` si le mot prolonge le mot précédent.
 */
function continuesPreviousWord(value: string, offset: number): boolean {
  if (!APOSTROPHES.has(value.charAt(offset - 1))) {
    return false;
  }
  const previous = LAST_WORD.exec(value.slice(0, offset - 1));
  return previous !== null && !ELISIONS.has(previous[0].toLowerCase());
}

/**
 * Met une majuscule au début de chaque mot d'un titre, en respectant les usages français.
 *
 * À utiliser pour afficher un titre d'ouvrage, un nom de rubrique ou un nom composé saisi
 * sans soin. Chaque mot (suite de lettres et de chiffres) prend une majuscule initiale et le
 * reste passe en minuscules ; la ponctuation et les espaces d'origine sont conservés. Les mots
 * composés prennent une majuscule à chaque partie (« Monte-Cristo »), les élisions sont
 * respectées (« L’Île », mais « Aujourd’hui »). Avec `lowercaseMinorWords`, les articles,
 * prépositions et conjonctions restent en minuscules, sauf en tête du texte.
 *
 * @remarks
 * Les sigles perdent leurs majuscules (« SNCF » devient « Sncf ») : ne pas l'appliquer à un
 * texte qui en contient.
 *
 * @param value - Texte à transformer.
 * @param options - Options : `lowercaseMinorWords` et `minorWords`.
 * @returns Le texte avec une majuscule au début de chaque mot.
 * @example
 * ```ts
 * toTitleCase("le petit prince"); // "Le Petit Prince"
 * toTitleCase("vingt mille lieues sous les mers", { lowercaseMinorWords: true });
 * // "Vingt Mille Lieues sous les Mers"
 * toTitleCase("l’île mystérieuse"); // "L’Île Mystérieuse"
 * ```
 * @since 0.2.0
 */
export function toTitleCase(value: string, options: IToTitleCaseOptions = {}): string {
  const { lowercaseMinorWords = false, minorWords = FRENCH_MINOR_WORDS } = options;
  const minor = new Set(lowercaseMinorWords ? minorWords.map((word) => word.toLowerCase()) : []);
  const firstIndex = value.search(FIRST_WORD_CHAR);
  return value.replace(WORD, (word: string, offset: number) => {
    const lower = word.toLowerCase();
    const keepLower =
      offset !== firstIndex && (continuesPreviousWord(value, offset) || minor.has(lower));
    return keepLower ? lower : lower.charAt(0).toUpperCase() + lower.slice(1);
  });
}
