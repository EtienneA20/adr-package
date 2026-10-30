/**
 * Vérifie qu'un coefficient (quantité, poids, opacité) est compris entre 0 et 1 inclus.
 *
 * Partagé par `lightenColor`, `darkenColor`, `mixColors` et `withAlpha` pour qu'ils
 * valident leurs paramètres et formulent l'erreur de la même façon.
 *
 * @param value - Coefficient à vérifier.
 * @param name - Nom du paramètre, cité dans le message d'erreur.
 * @throws {@link RangeError} Si `value` n'est pas un nombre entre 0 et 1 (`NaN` compris).
 * @internal
 */
export function assertRatio(value: number, name: string): void {
  if (!(value >= 0 && value <= 1)) {
    throw new RangeError(
      `Le paramètre « ${name} » doit être un nombre entre 0 et 1 (reçu : ${value}).`,
    );
  }
}
