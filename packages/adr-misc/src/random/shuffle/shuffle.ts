import { sample } from "../sample";

/**
 * Mélange une liste (algorithme de Fisher-Yates, toutes les permutations sont équiprobables).
 *
 * À utiliser pour présenter des éléments dans un ordre aléatoire (questions d'un quiz,
 * suggestions de lecture). La liste d'origine n'est **pas** modifiée. Ne pas utiliser
 * `items.sort(() => Math.random() - 0.5)`, dont le mélange est biaisé. Non adapté à un usage
 * sensible : `Math.random` n'est pas cryptographiquement sûr.
 *
 * @typeParam T - Type des éléments.
 * @param items - Liste à mélanger (non modifiée).
 * @param random - Générateur de nombres dans `[0, 1)`.
 * @defaultValue `random` : `Math.random`
 * @returns Un nouveau tableau contenant les mêmes éléments dans un ordre aléatoire.
 * @example
 * ```ts
 * shuffle([1, 2, 3, 4]); // par exemple [3, 1, 4, 2]
 * shuffle([1, 2, 3, 4], createSeededRandom(42)); // toujours le même ordre
 * ```
 * @since 0.2.0
 */
export function shuffle<T>(items: readonly T[], random: () => number = () => Math.random()): T[] {
  return sample(items, items.length, random);
}
