const INVARIABLE_ENDING = /[sxz]$/i;
const X_ENDING = /(?:au|eu)$/i;
// Exceptions en -au / -eu qui prennent un « s ».
const S_EXCEPTIONS = new Set(["bleu", "émeu", "landau", "pneu", "sarrau"]);
// Les sept noms en -ou qui prennent un « x ».
const X_EXCEPTIONS = new Set(["bijou", "caillou", "chou", "genou", "hibou", "joujou", "pou"]);

/**
 * Options de {@link pluralize}.
 *
 * @example
 * ```ts
 * const options: IPluralizeOptions = { plural: "chevaux", includeCount: true };
 * pluralize(3, "cheval", options); // "3 chevaux" (espace insécable)
 * ```
 * @since 0.2.0
 */
export interface IPluralizeOptions {
  /**
   * Forme plurielle, pour les pluriels irréguliers (« cheval » → « chevaux ») et les
   * expressions de plusieurs mots.
   *
   * @defaultValue le pluriel régulier déduit du singulier (voir {@link pluralize})
   */
  plural?: string;
  /**
   * Fait précéder le mot du nombre, formaté selon `locale` et suivi d'une espace insécable
   * (U+00A0) : « 3 livres », « 1 500 livres ».
   *
   * @defaultValue `false`
   */
  includeCount?: boolean;
  /**
   * Locale utilisée pour formater le nombre avec `Intl.NumberFormat` quand `includeCount` est
   * vrai.
   *
   * @defaultValue `"fr-FR"`
   */
  locale?: string;
}

/**
 * Indique si un mot est entièrement en majuscules (et contient au moins une lettre).
 *
 * @param word - Mot à tester.
 * @returns `true` pour « LIVRE », `false` pour « Livre » ou « 42 ».
 */
function isUpperCase(word: string): boolean {
  return word === word.toUpperCase() && word !== word.toLowerCase();
}

/**
 * Construit le pluriel régulier français d'un mot.
 *
 * @param singular - Mot au singulier.
 * @returns Le mot au pluriel.
 */
function regularPlural(singular: string): string {
  if (INVARIABLE_ENDING.test(singular)) {
    return singular;
  }
  const lower = singular.toLowerCase();
  const takesX = X_ENDING.test(lower) ? !S_EXCEPTIONS.has(lower) : X_EXCEPTIONS.has(lower);
  const suffix = takesX ? "x" : "s";
  return singular + (isUpperCase(singular) ? suffix.toUpperCase() : suffix);
}

/**
 * Accorde un mot au singulier ou au pluriel selon un nombre, avec la règle française.
 *
 * À utiliser pour les libellés dynamiques : « 1 livre », « 3 livres », « 0 retard ». En
 * français, le singulier s'emploie quand la valeur absolue du nombre est inférieure à 2
 * (0, 1, 1,5, -1) ; le pluriel à partir de 2. Sans forme plurielle fournie, le pluriel
 * régulier est déduit : mots en -s, -x, -z invariables (« prix », « nez »), -au / -eau / -eu
 * → -x (« bateaux », « jeux ») sauf bleu, émeu, landau, pneu, sarrau, et les sept noms en -ou
 * en -oux (« bijoux », « genoux ») ; sinon « s ». Un mot en majuscules reçoit un suffixe en
 * majuscules.
 *
 * @remarks
 * Seul le dernier mot est accordé par la règle régulière : pour un pluriel irrégulier
 * (« cheval » → « chevaux ») ou une expression (« livre emprunté »), fournir le pluriel.
 *
 * @param count - Nombre qui détermine l'accord.
 * @param singular - Mot ou expression au singulier.
 * @param pluralOrOptions - Forme plurielle, ou options (`plural`, `includeCount`, `locale`).
 * @returns Le mot accordé, éventuellement précédé du nombre.
 * @throws {@link RangeError} Si `count` vaut `NaN`.
 * @example
 * ```ts
 * pluralize(1, "livre"); // "livre"
 * pluralize(0, "retard"); // "retard"
 * pluralize(2, "livre"); // "livres"
 * pluralize(2, "cheval", "chevaux"); // "chevaux"
 * pluralize(1500, "livre", { includeCount: true }); // "1 500 livres" (espaces insécables)
 * ```
 * @since 0.2.0
 */
export function pluralize(
  count: number,
  singular: string,
  pluralOrOptions: string | IPluralizeOptions = {},
): string {
  if (Number.isNaN(count)) {
    throw new RangeError("Le nombre utilisé pour accorder le mot doit être un nombre valide.");
  }
  const options =
    typeof pluralOrOptions === "string" ? { plural: pluralOrOptions } : pluralOrOptions;
  const { plural, includeCount = false, locale = "fr-FR" } = options;
  const word = Math.abs(count) < 2 ? singular : (plural ?? regularPlural(singular));
  return includeCount ? `${new Intl.NumberFormat(locale).format(count)}\u00a0${word}` : word;
}
