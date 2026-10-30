const WHITESPACE_RUN = /\s+/u;
const ALPHANUMERIC = /[\p{L}\p{N}]/u;

/**
 * Compte les mots d'un texte.
 *
 * À utiliser pour afficher la longueur d'un résumé ou d'un commentaire, ou pour limiter une
 * saisie en nombre de mots. Un mot est une suite de caractères sans espace contenant au moins
 * une lettre ou un chiffre : la ponctuation isolée (« — », « : », « « ») n'est pas comptée,
 * un mot composé ou élidé (« Jean-Pierre », « l’école ») compte pour un, comme dans la plupart
 * des traitements de texte. Toutes les espaces séparent les mots, insécables comprises.
 *
 * @param text - Texte à analyser.
 * @returns Le nombre de mots (`0` pour un texte vide ou blanc).
 * @example
 * ```ts
 * countWords("Le Petit Prince"); // 3
 * countWords("« Bonjour », dit-il — l’air las."); // 4
 * ```
 * @since 0.2.0
 */
export function countWords(text: string): number {
  return text.split(WHITESPACE_RUN).filter((token) => ALPHANUMERIC.test(token)).length;
}
