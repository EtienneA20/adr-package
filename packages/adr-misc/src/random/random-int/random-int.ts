/**
 * Tire un entier au hasard entre deux bornes **incluses**.
 *
 * À utiliser pour un tirage simple (numéro de place, dé, index). Le générateur est injectable
 * pour rendre le tirage reproductible (voir `createSeededRandom`). Non adapté à un usage
 * sensible (jeton, mot de passe) : `Math.random` n'est pas cryptographiquement sûr.
 *
 * @param min - Borne inférieure (incluse), entier.
 * @param max - Borne supérieure (incluse), entier.
 * @param random - Générateur de nombres dans `[0, 1)`.
 * @defaultValue `random` : `Math.random`
 * @returns Un entier `n` tel que `min ≤ n ≤ max`.
 * @throws {@link RangeError} Si `min` ou `max` n'est pas un entier sûr, ou si `min > max`.
 * @example
 * ```ts
 * randomInt(1, 6); // 1, 2, 3, 4, 5 ou 6
 * randomInt(1, 6, createSeededRandom(42)); // toujours le même résultat
 * ```
 * @since 0.2.0
 */
export function randomInt(
  min: number,
  max: number,
  random: () => number = () => Math.random(),
): number {
  if (!Number.isSafeInteger(min) || !Number.isSafeInteger(max) || min > max) {
    throw new RangeError(
      `Bornes invalides : deux entiers tels que min ≤ max sont attendus (reçu : ${min} et ${max}).`,
    );
  }
  // `Math.min` protège d'un générateur qui renverrait exactement 1.
  return Math.min(min + Math.floor(random() * (max - min + 1)), max);
}
