/**
 * Génère une suite de nombres de `start` (inclus) à `end` (exclu), avec un pas donné, comme
 * `range` en Python.
 *
 * À utiliser pour construire des listes de nombres (années d'un sélecteur, numéros de page,
 * créneaux…). Un pas négatif produit une suite décroissante ; si le pas ne va pas de `start`
 * vers `end`, le résultat est vide (`range(5, 0)` renvoie `[]`, comme en Python). Chaque valeur
 * est calculée par `start + index * step` pour limiter l'accumulation d'erreurs d'arrondi.
 *
 * @param start - Première valeur (incluse).
 * @param end - Borne de fin (exclue).
 * @param step - Écart entre deux valeurs, positif ou négatif, non nul.
 * @returns Un nouveau tableau de nombres, éventuellement vide.
 * @throws {@link RangeError} Si `step` vaut `0`, ou si `start`, `end` ou `step` n'est pas un
 * nombre fini.
 * @example
 * ```ts
 * range(0, 5); // [0, 1, 2, 3, 4]
 * range(2020, 2030, 5); // [2020, 2025]
 * range(5, 0, -2); // [5, 3, 1]
 * ```
 * @since 0.2.0
 */
export function range(start: number, end: number, step = 1): number[] {
  if (![start, end, step].every((value) => Number.isFinite(value))) {
    throw new RangeError("Les bornes et le pas de range doivent être des nombres finis.");
  }
  if (step === 0) {
    throw new RangeError("Le pas de range ne doit pas être nul.");
  }
  const length = Math.max(Math.ceil((end - start) / step), 0);
  return Array.from({ length }, (_, index) => start + index * step);
}
