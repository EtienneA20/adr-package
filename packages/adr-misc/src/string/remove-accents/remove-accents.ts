// Bloc Unicode des diacritiques combinants (accent aigu, grave, cédille, tréma…). Limité à ce
// bloc pour ne pas abîmer les écritures où les signes combinants font partie de la lettre.
const COMBINING_DIACRITICS = /[\u0300-\u036f]/g;
// Lettres latines que la décomposition NFD ne sépare pas de leur « accent ».
const SPECIAL_LETTERS: readonly (readonly [letter: string, replacement: string])[] = [
  ["œ", "oe"],
  ["Œ", "OE"],
  ["æ", "ae"],
  ["Æ", "AE"],
  ["ß", "ss"],
  ["ø", "o"],
  ["Ø", "O"],
  ["ł", "l"],
  ["Ł", "L"],
  ["đ", "d"],
  ["Đ", "D"],
];

/**
 * Retire les accents et les diacritiques d'un texte, et décompose les ligatures.
 *
 * À utiliser pour comparer ou rechercher sans tenir compte des accents, ou pour produire un
 * texte ASCII (identifiant, nom de fichier). Les lettres accentuées perdent leur accent
 * (« é » → « e », « ç » → « c »), les ligatures sont décomposées (« œ » → « oe »,
 * « æ » → « ae ») ainsi que quelques lettres latines particulières (« ß » → « ss »,
 * « ø » → « o », « ł » → « l », « đ » → « d »). La casse est conservée.
 *
 * @remarks
 * Seuls les diacritiques combinants génériques (bloc Unicode U+0300 à U+036F : latin, grec,
 * cyrillique) sont retirés : les signes propres aux autres écritures (arabe, hindi…) sont
 * conservés, et le coréen ou le japonais ressortent inchangés.
 *
 * @param value - Texte à transformer (composé NFC ou décomposé NFD).
 * @returns Le texte sans accents, recomposé en NFC.
 * @example
 * ```ts
 * removeAccents("Élève à l’école"); // "Eleve a l’ecole"
 * removeAccents("Cœur d’Œdipe, ex æquo"); // "Coeur d’OEdipe, ex aequo"
 * ```
 * @since 0.2.0
 */
export function removeAccents(value: string): string {
  let result = value.normalize("NFD").replace(COMBINING_DIACRITICS, "");
  for (const [letter, replacement] of SPECIAL_LETTERS) {
    result = result.replaceAll(letter, replacement);
  }
  return result.normalize("NFC");
}
