import { randomInt } from "../random-int";

/**
 * Choisit un élément au hasard dans une liste.
 *
 * À utiliser pour une suggestion ou un tirage au sort (livre du jour, adhérent gagnant d'un
 * concours). Le générateur est injectable pour rendre le tirage reproductible. Non adapté à
 * un usage sensible : `Math.random` n'est pas cryptographiquement sûr.
 *
 * @typeParam T - Type des éléments.
 * @param items - Liste dans laquelle choisir (non modifiée).
 * @param random - Générateur de nombres dans `[0, 1)`.
 * @defaultValue `random` : `Math.random`
 * @returns Un élément de la liste, ou `undefined` si elle est vide.
 * @example
 * ```ts
 * randomItem(["Germinal", "Nana", "L'Assommoir"]); // l'un des trois titres
 * randomItem([]); // undefined
 * ```
 * @since 0.2.0
 */
export function randomItem<T>(
  items: readonly T[],
  random: () => number = () => Math.random(),
): T | undefined {
  return items.length === 0 ? undefined : items[randomInt(0, items.length - 1, random)];
}
