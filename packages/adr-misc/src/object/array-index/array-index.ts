/** Index de tableau : entier positif écrit sans zéro de tête (`"0"`, `"12"`, mais pas `"01"`). */
const ARRAY_INDEX_PATTERN = /^(?:0|[1-9]\d*)$/;

/**
 * Indique si un segment de chemin désigne un index de tableau. Sert à choisir entre un tableau
 * et un objet lors de la création d'un conteneur intermédiaire (`"items.0.title"`).
 *
 * @param segment - Segment de chemin.
 * @returns `true` si le segment est un index de tableau.
 * @internal
 */
export function isArrayIndex(segment: string): boolean {
  return ARRAY_INDEX_PATTERN.test(segment);
}
