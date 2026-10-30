/**
 * Crée une fonction qui n'exécute `fn` qu'au premier appel et renvoie ensuite le résultat
 * mémorisé.
 *
 * À utiliser pour une initialisation paresseuse (connexion, lecture de configuration, calcul
 * coûteux) ou pour garantir qu'une action ne s'exécute qu'une fois (inscription d'un écouteur,
 * message d'avertissement). Les arguments des appels suivants sont ignorés. Si `fn` lève une
 * erreur, rien n'est mémorisé : l'appel suivant exécute à nouveau `fn`.
 *
 * @typeParam TArgs - Types des arguments de `fn`.
 * @typeParam TResult - Type du résultat de `fn`.
 * @param fn - Fonction à n'exécuter qu'une fois.
 * @returns Une fonction de même signature qui renvoie toujours le résultat du premier appel réussi.
 * @example
 * ```ts
 * const loadCatalog = once(() => fetchCatalog());
 *
 * await loadCatalog(); // appelle fetchCatalog
 * await loadCatalog(); // renvoie la même promesse, sans nouvel appel
 * ```
 * @since 0.2.0
 */
export function once<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => TResult,
): (...args: TArgs) => TResult {
  let state: { result: TResult } | undefined;
  return (...args) => {
    state ??= { result: fn(...args) };
    return state.result;
  };
}
