/**
 * Vérifie qu'une durée en millisecondes est un nombre fini positif ou nul.
 *
 * Partagé par les fonctions de la catégorie pour produire le même message d'erreur ; une durée
 * négative ou `NaN` serait sinon silencieusement ramenée à 0 par `setTimeout`.
 *
 * @param value - Durée à vérifier.
 * @param name - Nom du paramètre, repris dans le message d'erreur.
 * @throws {@link RangeError} Si `value` est négative, infinie ou `NaN`.
 * @internal
 */
export function assertDelay(value: number, name: string): void {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError(`${name} doit être un nombre fini positif ou nul (reçu : ${value}).`);
  }
}
