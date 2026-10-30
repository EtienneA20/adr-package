/* eslint-disable max-params -- une fonction par étape : un objet d'options n'aurait pas de sens pour une composition. */
/**
 * Compose des fonctions de gauche à droite : la fonction renvoyée appelle `ab` avec ses
 * arguments, puis passe chaque résultat à la fonction suivante.
 *
 * À utiliser pour décrire une transformation comme une suite d'étapes lisibles dans l'ordre
 * d'exécution (normaliser, filtrer, formater…), plutôt que des appels imbriqués
 * `format(filter(normalize(value)))`. Les types sont vérifiés d'une étape à l'autre, jusqu'à
 * six fonctions (de 1 à 6) ; la première peut recevoir plusieurs arguments, les suivantes un seul.
 *
 * @typeParam A - Types des arguments de la première fonction (et de la fonction composée).
 * @typeParam B - Type du résultat de `ab`.
 * @typeParam C - Type du résultat de `bc`.
 * @typeParam D - Type du résultat de `cd`.
 * @typeParam E - Type du résultat de `de`.
 * @typeParam F - Type du résultat de `ef`.
 * @typeParam G - Type du résultat de `fg`.
 * @param ab - Première fonction, appelée avec les arguments de la fonction composée.
 * @param bc - Deuxième fonction, appelée avec le résultat de `ab`.
 * @param cd - Troisième fonction, appelée avec le résultat de `bc`.
 * @param de - Quatrième fonction, appelée avec le résultat de `cd`.
 * @param ef - Cinquième fonction, appelée avec le résultat de `de`.
 * @param fg - Sixième fonction, appelée avec le résultat de `ef`.
 * @returns Une fonction qui reçoit les arguments de `ab` et renvoie le résultat de la dernière
 *   fonction.
 * @example
 * ```ts
 * const toSlug = pipe(
 *   (title: string) => title.trim().toLowerCase(),
 *   (title) => title.normalize("NFD").replace(/\p{Diacritic}/gu, ""),
 *   (title) => title.replace(/[^a-z0-9]+/g, "-"),
 * );
 *
 * toSlug("  Les Misérables "); // "les-miserables"
 * ```
 * @since 0.2.0
 */
export function pipe<A extends unknown[], B, C, D, E, F, G>(
  ab: (...args: A) => B,
  bc: (value: B) => C,
  cd: (value: C) => D,
  de: (value: D) => E,
  ef: (value: E) => F,
  fg: (value: F) => G,
): (...args: A) => G;
export function pipe<A extends unknown[], B, C, D, E, F>(
  ab: (...args: A) => B,
  bc: (value: B) => C,
  cd: (value: C) => D,
  de: (value: D) => E,
  ef: (value: E) => F,
): (...args: A) => F;
/* eslint-enable max-params */
export function pipe<A extends unknown[], B, C, D, E>(
  ab: (...args: A) => B,
  bc: (value: B) => C,
  cd: (value: C) => D,
  de: (value: D) => E,
): (...args: A) => E;
export function pipe<A extends unknown[], B, C, D>(
  ab: (...args: A) => B,
  bc: (value: B) => C,
  cd: (value: C) => D,
): (...args: A) => D;
export function pipe<A extends unknown[], B, C>(
  ab: (...args: A) => B,
  bc: (value: B) => C,
): (...args: A) => C;
export function pipe<A extends unknown[], B>(ab: (...args: A) => B): (...args: A) => B;
export function pipe(
  ab: (...args: unknown[]) => unknown,
  ...rest: ((value: unknown) => unknown)[]
): (...args: unknown[]) => unknown {
  return (...args) => rest.reduce((value, fn) => fn(value), ab(...args));
}
