import { randomInt } from "../random-int";

/** Alphabet par défaut : lettres ASCII majuscules et minuscules, chiffres. */
const DEFAULT_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

/**
 * Options de {@link randomString}.
 *
 * @example
 * ```ts
 * const options: IRandomStringOptions = { alphabet: "0123456789" };
 * randomString(6, options); // par exemple "402917"
 * ```
 * @since 0.2.0
 */
export interface IRandomStringOptions {
  /**
   * Caractères utilisables (chaque caractère Unicode compte pour un, les doublons augmentent
   * sa probabilité).
   *
   * @defaultValue Lettres ASCII majuscules et minuscules, chiffres (62 caractères).
   */
  alphabet?: string;
  /**
   * Générateur de nombres dans `[0, 1)`.
   *
   * @defaultValue `Math.random`
   */
  random?: () => number;
}

/**
 * Génère une chaîne aléatoire d'une longueur donnée, à partir d'un alphabet configurable.
 *
 * À utiliser pour un identifiant court et lisible (code de retrait d'une réservation, suffixe
 * de nom de fichier, données de démonstration). **Non adapté** à un secret (mot de passe,
 * jeton de réinitialisation) : le générateur par défaut n'est pas cryptographiquement sûr ;
 * utiliser `createUuid` ou une API cryptographique.
 *
 * @param length - Longueur de la chaîne (entier positif ou nul).
 * @param options - Alphabet et générateur (voir {@link IRandomStringOptions}).
 * @returns Une chaîne de `length` caractères tirés dans l'alphabet.
 * @throws {@link RangeError} Si `length` n'est pas un entier positif ou nul.
 * @throws {@link Error} Si l'alphabet est vide.
 * @example
 * ```ts
 * randomString(8); // par exemple "aZ3kP0qL"
 * // Code de retrait sans caractères ambigus (0/O, 1/I)
 * randomString(6, { alphabet: "ABCDEFGHJKLMNPQRSTUVWXYZ23456789" }); // par exemple "K7PX2M"
 * ```
 * @since 0.2.0
 */
export function randomString(length: number, options: IRandomStringOptions = {}): string {
  const { alphabet = DEFAULT_ALPHABET, random = () => Math.random() } = options;
  if (!Number.isSafeInteger(length) || length < 0) {
    throw new RangeError(`La longueur doit être un entier positif ou nul (reçu : ${length}).`);
  }
  const characters = Array.from(alphabet);
  if (characters.length === 0) {
    throw new Error("L'alphabet de randomString ne doit pas être vide.");
  }
  return Array.from({ length }, () => characters[randomInt(0, characters.length - 1, random)]).join(
    "",
  );
}
