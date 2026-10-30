import { removeAccents } from "../remove-accents";

/**
 * Options de {@link slugify}.
 *
 * @example
 * ```ts
 * const options: ISlugifyOptions = { separator: "_" };
 * slugify("Le Petit Prince", options); // "le_petit_prince"
 * ```
 * @since 0.2.0
 */
export interface ISlugifyOptions {
  /**
   * Séparateur placé entre les mots.
   *
   * @defaultValue `"-"`
   */
  separator?: string;
  /**
   * Met le résultat en minuscules.
   *
   * @defaultValue `true`
   */
  lowercase?: boolean;
}

/**
 * Transforme un texte libre en « slug » utilisable dans une URL ou un nom de fichier.
 *
 * À utiliser pour construire une URL lisible à partir d'un titre (`/livres/le-petit-prince`)
 * ou un nom de fichier d'export. Les accents sont retirés et les ligatures décomposées
 * (« œ » → « oe »), puis toute suite de caractères autres que `a-z` et `0-9` (espaces,
 * apostrophes, ponctuation, symboles) devient un séparateur unique ; les séparateurs de tête et
 * de fin sont supprimés.
 *
 * @remarks
 * Les caractères non latins (cyrillique, chinois, emoji…) sont supprimés : un texte qui n'en
 * contient pas d'autres donne une chaîne vide, à prévoir côté appelant.
 *
 * @param value - Texte à transformer.
 * @param options - Options : `separator` et `lowercase`.
 * @returns Le slug, éventuellement vide.
 * @example
 * ```ts
 * slugify("L’Île mystérieuse : tome 2"); // "l-ile-mysterieuse-tome-2"
 * slugify("Œuvres complètes", { separator: "_" }); // "oeuvres_completes"
 * slugify("Rapport Annuel 2026", { lowercase: false }); // "Rapport-Annuel-2026"
 * ```
 * @since 0.2.0
 */
export function slugify(value: string, options: ISlugifyOptions = {}): string {
  const { separator = "-", lowercase = true } = options;
  const ascii = removeAccents(value);
  return (lowercase ? ascii.toLowerCase() : ascii)
    .split(/[^a-zA-Z0-9]+/)
    .filter((word) => word !== "")
    .join(separator);
}
