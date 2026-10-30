/**
 * Paires d'objets en cours de comparaison : une paire déjà rencontrée est supposée égale, ce qui
 * permet de comparer des structures circulaires sans boucle infinie.
 */
type VisitedPairs = Map<object, Set<object>>;

/**
 * Compare deux tableaux élément par élément.
 *
 * @param left - Premier tableau.
 * @param right - Second tableau.
 * @param visited - Paires en cours de comparaison.
 * @returns `true` si les tableaux sont égaux en profondeur.
 */
function equalArrays(
  left: readonly unknown[],
  right: readonly unknown[],
  visited: VisitedPairs,
): boolean {
  return (
    left.length === right.length &&
    left.every((item, index) => equalValues(item, right[index], visited))
  );
}

/**
 * Compare deux `Map` : mêmes clés (par identité), valeurs égales en profondeur.
 *
 * @param left - Première `Map`.
 * @param right - Seconde `Map`.
 * @param visited - Paires en cours de comparaison.
 * @returns `true` si les `Map` sont égales.
 */
function equalMaps(
  left: ReadonlyMap<unknown, unknown>,
  right: ReadonlyMap<unknown, unknown>,
  visited: VisitedPairs,
): boolean {
  return (
    left.size === right.size &&
    [...left].every(([key, value]) => right.has(key) && equalValues(value, right.get(key), visited))
  );
}

/**
 * Compare deux `Set` : chaque élément de l'un est présent (par identité) ou a un équivalent
 * profond dans l'autre.
 *
 * @param left - Premier `Set`.
 * @param right - Second `Set`.
 * @param visited - Paires en cours de comparaison.
 * @returns `true` si les `Set` sont égaux.
 */
function equalSets(
  left: ReadonlySet<unknown>,
  right: ReadonlySet<unknown>,
  visited: VisitedPairs,
): boolean {
  return (
    left.size === right.size &&
    [...left].every(
      (item) =>
        right.has(item) || [...right].some((candidate) => equalValues(item, candidate, visited)),
    )
  );
}

/**
 * Compare les propriétés propres, énumérables et à clé chaîne de deux objets.
 *
 * @param left - Premier objet.
 * @param right - Second objet.
 * @param visited - Paires en cours de comparaison.
 * @returns `true` si les objets ont les mêmes clés et des valeurs égales.
 */
function equalRecords(left: object, right: object, visited: VisitedPairs): boolean {
  const leftKeys = Object.keys(left);
  return (
    leftKeys.length === Object.keys(right).length &&
    leftKeys.every(
      (key) =>
        Object.hasOwn(right, key) &&
        equalValues(
          (left as Record<string, unknown>)[key],
          (right as Record<string, unknown>)[key],
          visited,
        ),
    )
  );
}

/**
 * Compare deux objets de même prototype selon leur nature.
 *
 * @param left - Premier objet.
 * @param right - Second objet, de même prototype.
 * @param visited - Paires en cours de comparaison.
 * @returns `true` si les objets sont égaux en profondeur.
 */
function equalObjects(left: object, right: object, visited: VisitedPairs): boolean {
  if (left instanceof Date) {
    return Object.is(left.getTime(), (right as Date).getTime());
  }
  if (left instanceof RegExp) {
    const other = right as RegExp;
    return left.source === other.source && left.flags === other.flags;
  }
  if (Array.isArray(left)) {
    return equalArrays(left, right as unknown[], visited);
  }
  if (left instanceof Map) {
    return equalMaps(left, right as Map<unknown, unknown>, visited);
  }
  if (left instanceof Set) {
    return equalSets(left, right as Set<unknown>, visited);
  }
  return equalRecords(left, right, visited);
}

/**
 * Compare deux valeurs quelconques en mémorisant les paires d'objets visitées.
 *
 * @param left - Première valeur.
 * @param right - Seconde valeur.
 * @param visited - Paires en cours de comparaison.
 * @returns `true` si les valeurs sont égales en profondeur.
 */
function equalValues(left: unknown, right: unknown, visited: VisitedPairs): boolean {
  if (left === right || Object.is(left, right)) {
    return true;
  }
  if (typeof left !== "object" || typeof right !== "object" || left === null || right === null) {
    return false;
  }
  if (Object.getPrototypeOf(left) !== Object.getPrototypeOf(right)) {
    return false;
  }
  const pairs = visited.get(left) ?? new Set<object>();
  if (pairs.has(right)) {
    return true;
  }
  visited.set(left, pairs.add(right));
  return equalObjects(left, right, visited);
}

/**
 * Indique si deux valeurs sont égales en profondeur.
 *
 * À utiliser pour détecter une modification (formulaire modifié, état inchangé avant un appel
 * réseau, comparaison de filtres…). Gère les primitives (`NaN` égal à `NaN`, `0` égal à `-0`),
 * `Date` (même instant), `RegExp` (même motif et mêmes options), tableaux, objets simples
 * (propriétés propres, énumérables et à clé chaîne, ordre indifférent), `Map` (clés comparées
 * par identité) et `Set`, ainsi que les références circulaires. Deux objets de prototypes
 * différents ne sont jamais égaux ; deux fonctions ne sont égales que si c'est la même.
 *
 * @param left - Première valeur.
 * @param right - Seconde valeur.
 * @returns `true` si les deux valeurs sont égales en profondeur.
 * @example
 * ```ts
 * isEqual({ genres: ["roman"], since: new Date(2026, 0, 1) }, { since: new Date(2026, 0, 1), genres: ["roman"] }); // true
 * isEqual([1, 2], [2, 1]); // false
 * ```
 * @since 0.2.0
 */
export function isEqual(left: unknown, right: unknown): boolean {
  return equalValues(left, right, new Map());
}
