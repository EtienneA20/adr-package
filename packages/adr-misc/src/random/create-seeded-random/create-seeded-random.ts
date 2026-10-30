/**
 * Convertit un texte en graine entière 32 bits (hachage FNV-1a sur les unités UTF-16).
 *
 * @param text - Texte à hacher.
 * @returns Un entier non signé 32 bits.
 */
function hashSeed(text: string): number {
  let hash = 0x81_1c_9d_c5;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 0x01_00_01_93);
  }
  return hash >>> 0;
}

/**
 * Crée un générateur pseudo-aléatoire **déterministe** (algorithme mulberry32) à partir d'une
 * graine : la même graine produit toujours la même suite de nombres.
 *
 * À utiliser pour des tests, des démos ou des données de démonstration reproductibles, en le
 * passant comme paramètre `random` des autres fonctions de la catégorie. **Non adapté** à un
 * usage sensible : la suite est prévisible par construction.
 *
 * @param seed - Graine : un nombre (tronqué en entier 32 bits) ou un texte (haché).
 * @returns Une fonction qui renvoie à chaque appel le nombre suivant de la suite, dans `[0, 1)`.
 * @throws {@link RangeError} Si `seed` est un nombre non fini (`NaN`, `Infinity`).
 * @example
 * ```ts
 * const random = createSeededRandom(42);
 * random(); // toujours la même valeur pour la graine 42
 * shuffle(["a", "b", "c"], createSeededRandom("démo")); // toujours le même ordre
 * ```
 * @since 0.2.0
 */
export function createSeededRandom(seed: number | string): () => number {
  if (typeof seed === "number" && !Number.isFinite(seed)) {
    throw new RangeError(`La graine doit être un nombre fini ou un texte (reçu : ${seed}).`);
  }
  let state = typeof seed === "number" ? seed >>> 0 : hashSeed(seed);
  return () => {
    state = (state + 0x6d_2b_79_f5) >>> 0;
    let mixed = Math.imul(state ^ (state >>> 15), state | 1);
    mixed ^= mixed + Math.imul(mixed ^ (mixed >>> 7), mixed | 61);
    return ((mixed ^ (mixed >>> 14)) >>> 0) / 4_294_967_296;
  };
}
