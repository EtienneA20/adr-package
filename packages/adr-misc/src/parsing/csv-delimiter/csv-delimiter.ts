/**
 * Vérifie qu'un séparateur CSV est utilisable par `parseCsv` et `toCsv`.
 *
 * Un séparateur de plusieurs caractères, le guillemet ou un retour à la ligne rendraient le
 * fichier impossible à relire sans ambiguïté : c'est une erreur de programmation, d'où
 * l'exception (et non un résultat `undefined` comme pour une saisie invalide).
 *
 * @param delimiter - Séparateur à vérifier.
 * @throws {@link RangeError} Si le séparateur n'est pas un caractère unique, ou s'il s'agit du
 *   guillemet ou d'un retour à la ligne.
 * @internal
 */
export function assertCsvDelimiter(delimiter: string): void {
  if (delimiter.length !== 1 || delimiter === '"' || delimiter === "\r" || delimiter === "\n") {
    throw new RangeError(
      `Séparateur CSV invalide : « ${delimiter} ». Un caractère unique est attendu, différent du guillemet et des retours à la ligne.`,
    );
  }
}
