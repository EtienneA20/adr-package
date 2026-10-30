import { randomInt } from "../random-int";

/**
 * Échange deux éléments d'un tableau en place.
 *
 * Passe par `splice` plutôt que par `array[i]` : avec `noUncheckedIndexedAccess`, un accès
 * indexé est typé `T | undefined` et imposerait une assertion de type.
 *
 * @param items - Tableau modifié.
 * @param first - Index du premier élément.
 * @param second - Index du second élément.
 */
function swapItems(items: unknown[], first: number, second: number): void {
  items.splice(first, 1, ...items.splice(second, 1, ...items.slice(first, first + 1)));
}

/**
 * Tire plusieurs éléments distincts au hasard dans une liste (tirage **sans remise**).
 *
 * À utiliser pour une sélection aléatoire (trois livres mis en avant, jury tiré au sort).
 * Chaque élément de la liste ne peut sortir qu'une fois ; si `count` dépasse la taille de la
 * liste, tous les éléments sont renvoyés dans un ordre aléatoire. La liste n'est pas modifiée.
 * Non adapté à un usage sensible : `Math.random` n'est pas cryptographiquement sûr.
 *
 * @typeParam T - Type des éléments.
 * @param items - Liste dans laquelle tirer (non modifiée).
 * @param count - Nombre d'éléments voulus (entier positif ou nul).
 * @param random - Générateur de nombres dans `[0, 1)`.
 * @defaultValue `random` : `Math.random`
 * @returns Un nouveau tableau de `min(count, items.length)` éléments, dans l'ordre du tirage.
 * @throws {@link RangeError} Si `count` n'est pas un entier positif ou nul.
 * @example
 * ```ts
 * sample(["Germinal", "Nana", "L'Assommoir", "Au Bonheur des Dames"], 2);
 * // par exemple ["Nana", "Germinal"]
 * ```
 * @since 0.2.0
 */
export function sample<T>(
  items: readonly T[],
  count: number,
  random: () => number = () => Math.random(),
): T[] {
  if (!Number.isSafeInteger(count) || count < 0) {
    throw new RangeError(
      `Le nombre d'éléments doit être un entier positif ou nul (reçu : ${count}).`,
    );
  }
  const pool = [...items];
  const size = Math.min(count, pool.length);
  // Fisher-Yates partiel : seules les `size` premières positions sont tirées.
  for (let index = 0; index < size; index += 1) {
    swapItems(pool, index, randomInt(index, pool.length - 1, random));
  }
  return pool.slice(0, size);
}
