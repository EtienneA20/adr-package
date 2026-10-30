// Frontière minuscule (ou chiffre) → majuscule : « userName » → « user Name ».
const LOWER_TO_UPPER = /([\p{Ll}\p{N}])(\p{Lu})/gu;
// Fin d'un sigle suivi d'un mot : « XMLHttp » → « XML Http ».
const ACRONYM_END = /(\p{Lu})(\p{Lu}\p{Ll})/gu;
// Tout ce qui n'est ni lettre, ni signe diacritique combinant, ni chiffre sépare deux mots.
const SEPARATORS = /[^\p{L}\p{M}\p{N}]+/u;

/**
 * Découpe un texte en mots, quelle que soit sa casse d'origine.
 *
 * Partagé par toutes les fonctions de changement de casse pour qu'elles découpent les mots de
 * la même façon. Les séparateurs sont tous les caractères qui ne sont ni des lettres (accents
 * compris), ni des chiffres : espaces, tirets, underscores, points, apostrophes… Les chiffres
 * restent collés au mot qui les précède (`base64Encode` → `base64`, `Encode`).
 *
 * @param value - Texte à découper (`camelCase`, `PascalCase`, `kebab-case`, phrase…).
 * @returns Les mots, dans leur casse d'origine, sans chaîne vide.
 * @internal
 */
export function splitWords(value: string): string[] {
  return value
    .replace(LOWER_TO_UPPER, "$1 $2")
    .replace(ACRONYM_END, "$1 $2")
    .split(SEPARATORS)
    .filter((word) => word !== "");
}
