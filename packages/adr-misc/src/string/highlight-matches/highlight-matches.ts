import { foldText, foldTextWithOffsets } from "../fold-for-search";
import type { IFoldedText } from "../fold-for-search";

/**
 * Segment de texte renvoyé par {@link highlightMatches} : un morceau du texte d'origine, à
 * surligner ou non.
 *
 * @example
 * ```ts
 * const segment: IHighlightSegment = { text: "Hugo", match: true };
 * ```
 * @since 0.2.0
 */
export interface IHighlightSegment {
  /** Morceau du texte d'origine, tel quel (casse et accents conservés). */
  text: string;
  /** `true` si le morceau correspond à un mot de la recherche et doit être surligné. */
  match: boolean;
}

/** Intervalle `[début, fin[` de positions dans un texte. */
type Range = readonly [start: number, end: number];

/**
 * Trouve les occurrences d'un mot dans le texte replié et les convertit en positions du texte
 * d'origine.
 *
 * @param folded - Texte replié et table des positions d'origine.
 * @param word - Mot replié à chercher (non vide).
 * @returns Les intervalles des occurrences dans le texte d'origine.
 */
function findRanges(folded: IFoldedText, word: string): Range[] {
  const ranges: Range[] = [];
  let index = folded.value.indexOf(word);
  while (index !== -1) {
    const end = index + word.length;
    // Positions toujours définies : `index` et `end - 1` désignent des caractères du texte replié.
    ranges.push([folded.starts[index] ?? 0, folded.ends[end - 1] ?? 0]);
    index = folded.value.indexOf(word, end);
  }
  return ranges;
}

/**
 * Trie et fusionne les intervalles qui se chevauchent ou se touchent.
 *
 * @param ranges - Intervalles à fusionner.
 * @returns Les intervalles fusionnés, triés et disjoints.
 */
function mergeRanges(ranges: readonly Range[]): Range[] {
  const merged: [number, number][] = [];
  for (const [start, end] of [...ranges].sort((a, b) => a[0] - b[0])) {
    const last = merged.at(-1);
    if (last !== undefined && start <= last[1]) {
      last[1] = Math.max(last[1], end);
    } else {
      merged.push([start, end]);
    }
  }
  return merged;
}

/**
 * Découpe un texte en segments à surligner ou non selon une recherche, pour afficher un
 * résultat de recherche dans une interface.
 *
 * À utiliser avec `matchesSearch` : filtrer la liste, puis surligner dans chaque résultat les
 * passages trouvés (`<mark>` en React). Chaque mot de la requête est cherché comme dans
 * `matchesSearch` (insensible à la casse, aux accents, aux ligatures, aux types d'espaces et
 * d'apostrophes) ; toutes ses occurrences sont marquées, et les passages qui se chevauchent ou
 * se touchent sont fusionnés. Les segments reprennent le texte d'origine tel quel : leur
 * concaténation redonne exactement `text`.
 *
 * @param text - Texte à découper (titre, nom…).
 * @param query - Recherche saisie par l'utilisateur.
 * @returns Les segments dans l'ordre du texte, sans segment vide : un seul segment non marqué
 * si rien ne correspond, un tableau vide si `text` est vide.
 * @example
 * ```ts
 * highlightMatches("Les Misérables", "mise");
 * // [{ text: "Les ", match: false }, { text: "Misé", match: true }, { text: "rables", match: false }]
 *
 * // Dans un composant React :
 * // highlightMatches(book.title, query).map((segment, index) =>
 * //   segment.match ? <mark key={index}>{segment.text}</mark> : segment.text)
 * ```
 * @since 0.2.0
 */
export function highlightMatches(text: string, query: string): IHighlightSegment[] {
  const folded = foldTextWithOffsets(text);
  const words = foldText(query)
    .split(" ")
    .filter((word) => word !== "");
  const segments: IHighlightSegment[] = [];
  let cursor = 0;
  for (const [start, end] of mergeRanges(words.flatMap((word) => findRanges(folded, word)))) {
    if (start > cursor) {
      segments.push({ text: text.slice(cursor, start), match: false });
    }
    segments.push({ text: text.slice(start, end), match: true });
    cursor = end;
  }
  if (cursor < text.length) {
    segments.push({ text: text.slice(cursor), match: false });
  }
  return segments;
}
