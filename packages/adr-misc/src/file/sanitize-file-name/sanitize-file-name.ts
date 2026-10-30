import { splitFilePath } from "../split-file-path";

/** Caractères interdits dans un nom de fichier sous Windows (et `/` partout). */
const FORBIDDEN_CHARACTERS = '<>:"/\\|?*';

/** Longueur maximale par défaut d'un nom de fichier, en caractères. */
const DEFAULT_MAX_LENGTH = 255;

// Noms de périphériques réservés par Windows, avec ou sans extension (`CON`, `nul.txt`…).
const RESERVED_WINDOWS_NAME = /^(?:CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i;

/**
 * Options de {@link sanitizeFileName}.
 *
 * @example
 * ```ts
 * const options: ISanitizeFileNameOptions = { replacement: "-", maxLength: 100 };
 * ```
 * @since 0.2.0
 */
export interface ISanitizeFileNameOptions {
  /**
   * Texte qui remplace chaque caractère interdit ; `""` les supprime.
   *
   * @defaultValue `"_"`
   */
  replacement?: string;
  /**
   * Longueur maximale du nom renvoyé, en caractères ; l'extension est conservée si possible.
   *
   * @defaultValue `255`
   */
  maxLength?: number;
}

function isForbiddenCharacter(character: string): boolean {
  const code = character.charCodeAt(0);
  return code < 32 || code === 127 || FORBIDDEN_CHARACTERS.includes(character);
}

// Tronque en points de code (et non en unités UTF-16) pour ne jamais couper un emoji en deux,
// en gardant l'extension quand elle laisse de la place au radical.
function truncateFileName(name: string, maxLength: number): string {
  const characters = Array.from(name);
  if (characters.length <= maxLength) {
    return name;
  }
  const { stem, extension } = splitFilePath(name);
  const suffix = extension === undefined ? "" : `.${extension}`;
  const suffixLength = Array.from(suffix).length;
  if (suffixLength === 0 || suffixLength >= maxLength) {
    return characters.slice(0, maxLength).join("");
  }
  const truncatedStem = Array.from(stem)
    .slice(0, maxLength - suffixLength)
    .join("");
  return `${truncatedStem}${suffix}`;
}

/**
 * Transforme un texte libre en nom de fichier valide sous Windows, macOS et Linux.
 *
 * À utiliser pour nommer un fichier exporté à partir d'une donnée saisie (titre d'un livre,
 * nom d'un adhérent) ou pour assainir le nom d'un fichier téléversé avant de l'enregistrer.
 * Remplace les caractères interdits (`< > : " / \ | ? *` et caractères de contrôle), retire
 * les espaces de début et de fin ainsi que les points et espaces finaux, préfixe d'un `_` les
 * noms réservés par Windows (`CON`, `NUL`, `COM1`…) et limite la longueur en conservant
 * l'extension. Les accents et les autres caractères Unicode sont conservés.
 *
 * @param fileName - Nom de fichier ou texte libre à assainir (pas un chemin : les barres
 *   obliques et obliques inverses sont remplacées).
 * @param options - Caractère de remplacement et longueur maximale.
 * @returns Le nom assaini, ou `""` s'il ne reste aucun caractère utilisable.
 * @throws {@link RangeError} Si `replacement` contient un caractère interdit, ou si
 *   `maxLength` n'est pas un entier strictement positif.
 * @example
 * ```ts
 * sanitizeFileName('Rapport : "Retards" 2026/10.pdf'); // "Rapport _ _Retards_ 2026_10.pdf"
 * sanitizeFileName("Qui a peur ?.txt", { replacement: "" }); // "Qui a peur .txt"
 * sanitizeFileName("  notes.  "); // "notes"
 * sanitizeFileName("CON.txt"); // "_CON.txt"
 * ```
 * @since 0.2.0
 */
export function sanitizeFileName(fileName: string, options: ISanitizeFileNameOptions = {}): string {
  const { replacement = "_", maxLength = DEFAULT_MAX_LENGTH } = options;
  if (Array.from(replacement).some(isForbiddenCharacter)) {
    throw new RangeError(
      `Le caractère de remplacement « ${replacement} » est interdit dans un nom de fichier`,
    );
  }
  if (!Number.isInteger(maxLength) || maxLength <= 0) {
    throw new RangeError(
      `La longueur maximale doit être un entier strictement positif (reçu : ${maxLength})`,
    );
  }
  const replaced = Array.from(fileName)
    .map((character) => (isForbiddenCharacter(character) ? replacement : character))
    .join("");
  const trimmed = replaced.trim().replace(/[. ]+$/, "");
  const firstSegment = trimmed.replace(/\..*$/s, "");
  const unreserved = RESERVED_WINDOWS_NAME.test(firstSegment) ? `_${trimmed}` : trimmed;
  return truncateFileName(unreserved, maxLength).replace(/[. ]+$/, "");
}
