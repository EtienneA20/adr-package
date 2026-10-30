// Particules de noms de famille ignorées (« Charles de Gaulle » → « CG »).
const PARTICLES = new Set([
  "d",
  "da",
  "de",
  "del",
  "della",
  "den",
  "der",
  "des",
  "di",
  "du",
  "la",
  "le",
  "les",
  "van",
  "von",
]);
// Particule élidée collée au nom : « d’Ormesson » → « Ormesson ».
const ELIDED_PARTICLE = /^[dl]['’]/i;
const ALPHANUMERIC = /[\p{L}\p{N}]/u;

/**
 * Options de {@link getInitials}.
 *
 * @example
 * ```ts
 * const options: IGetInitialsOptions = { maxLetters: 2 };
 * getInitials("Jean-Pierre Dupont", options); // "JD"
 * ```
 * @since 0.2.0
 */
export interface IGetInitialsOptions {
  /**
   * Nombre maximal d'initiales. Au-delà, on garde les premières et la dernière (initiale du
   * nom de famille) : « Jean-Pierre Dupont » donne « JD » avec 2. Avec 1, seule la première
   * initiale est gardée. Entier supérieur ou égal à 1.
   *
   * @defaultValue aucune limite
   */
  maxLetters?: number;
  /**
   * Compte chaque partie d'un nom composé (« Jean-Pierre » → « JP »). À `false`, un nom
   * composé ne donne qu'une initiale (« Jean-Pierre » → « J »).
   *
   * @defaultValue `true`
   */
  splitHyphens?: boolean;
}

/**
 * Extrait les mots significatifs d'un nom : sans particule élidée ni mot vide, et sans
 * particule (« de », « van »…) sauf si le nom n'est fait que de particules.
 *
 * @param fullName - Nom complet.
 * @param splitHyphens - Découper les noms composés.
 * @returns Les mots dont on prend l'initiale.
 */
function significantWords(fullName: string, splitHyphens: boolean): string[] {
  const words = fullName
    .split(splitHyphens ? /[\s\-‐–]+/u : /\s+/u)
    .map((word) => word.replace(ELIDED_PARTICLE, ""))
    .filter((word) => ALPHANUMERIC.test(word));
  const withoutParticles = words.filter((word) => !PARTICLES.has(word.toLowerCase()));
  return withoutParticles.length > 0 ? withoutParticles : words;
}

/**
 * Calcule les initiales d'un nom de personne, en majuscules.
 *
 * À utiliser pour un avatar sans photo, une signature courte ou une colonne étroite. Chaque
 * mot donne sa première lettre (accents conservés : « Émile Zola » → « ÉZ ») ; les parties
 * d'un nom composé comptent chacune (option `splitHyphens`), les particules (« de », « du »,
 * « van »…) et les élisions (« d’Ormesson ») sont ignorées.
 *
 * @param fullName - Nom complet (prénom(s) puis nom).
 * @param options - Options : `maxLetters` et `splitHyphens`.
 * @returns Les initiales en majuscules, ou une chaîne vide si le nom ne contient aucune lettre.
 * @throws {@link RangeError} Si `maxLetters` n'est pas un entier supérieur ou égal à 1.
 * @example
 * ```ts
 * getInitials("Jean-Pierre Dupont"); // "JPD"
 * getInitials("Jean-Pierre Dupont", { maxLetters: 2 }); // "JD"
 * getInitials("Jean-Pierre Dupont", { splitHyphens: false }); // "JD"
 * getInitials("Charles de Gaulle"); // "CG"
 * ```
 * @since 0.2.0
 */
export function getInitials(fullName: string, options: IGetInitialsOptions = {}): string {
  const { maxLetters, splitHyphens = true } = options;
  if (maxLetters !== undefined && (!Number.isInteger(maxLetters) || maxLetters < 1)) {
    throw new RangeError(
      `Le nombre maximal d'initiales doit être un entier supérieur ou égal à 1 (reçu : ${maxLetters}).`,
    );
  }
  const initials = significantWords(fullName, splitHyphens).map((word) =>
    word.charAt(word.search(ALPHANUMERIC)).toUpperCase(),
  );
  if (maxLetters === undefined || initials.length <= maxLetters) {
    return initials.join("");
  }
  if (maxLetters === 1) {
    return initials.slice(0, 1).join("");
  }
  return [...initials.slice(0, maxLetters - 1), ...initials.slice(-1)].join("");
}
