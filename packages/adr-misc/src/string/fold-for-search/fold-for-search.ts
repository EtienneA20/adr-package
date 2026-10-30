import { removeAccents } from "../remove-accents";

// Un caractère de base suivi de ses diacritiques combinants (texte NFD), ou des diacritiques
// isolés en tête de texte : chaque unité est repliée d'un bloc pour garder la correspondance
// des positions avec le texte d'origine.
const FOLD_UNIT = /\P{M}\p{M}*|\p{M}+/gu;
const TYPOGRAPHIC_APOSTROPHES = /[‘’ʼ]/gu;

/**
 * Texte replié pour la recherche, avec la position de chaque caractère dans le texte d'origine.
 *
 * @internal
 */
export interface IFoldedText {
  /** Texte replié : minuscules, sans accents, espaces simples, apostrophes droites. */
  value: string;
  /** Pour chaque caractère de `value`, position de début de son unité dans le texte d'origine. */
  starts: number[];
  /** Pour chaque caractère de `value`, position de fin (exclue) de son unité dans l'origine. */
  ends: number[];
}

/**
 * Replie un fragment de texte : minuscules, sans accents ni ligatures, toute espace devient une
 * espace simple, les apostrophes typographiques deviennent droites.
 *
 * Utilisé par `matchesSearch` et `highlightMatches` pour qu'une recherche « l'ile » trouve
 * « L’Île » et qu'une recherche « 1 500 » trouve « 1 500 » écrit avec une fine insécable.
 *
 * @param text - Texte à replier.
 * @returns Le texte replié.
 * @internal
 */
export function foldText(text: string): string {
  // Minuscules d'abord : « İ » donne « i » + point combinant, que removeAccents retire ensuite.
  return removeAccents(text.toLowerCase())
    .replace(/\s/gu, " ")
    .replace(TYPOGRAPHIC_APOSTROPHES, "'");
}

/**
 * Replie un texte comme {@link foldText} en gardant, pour chaque caractère replié, la position
 * de l'unité d'origine dont il provient (un « œ » donne « oe », deux caractères qui pointent
 * vers le même « œ »).
 *
 * @param text - Texte à replier.
 * @returns Le texte replié et la table de correspondance des positions.
 * @internal
 */
export function foldTextWithOffsets(text: string): IFoldedText {
  const folded: IFoldedText = { value: "", starts: [], ends: [] };
  for (const match of text.matchAll(FOLD_UNIT)) {
    const unit = match[0];
    const start = match.index;
    const foldedUnit = foldText(unit);
    // Une entrée par unité de code UTF-16 du texte replié (mêmes indices que `value`).
    const count = foldedUnit.length;
    folded.starts.push(...new Array<number>(count).fill(start));
    folded.ends.push(...new Array<number>(count).fill(start + unit.length));
    folded.value += foldedUnit;
  }
  return folded;
}
