/**
 * Analyse une chaîne JSON sans lever d'erreur.
 *
 * À utiliser pour relire une valeur dont le contenu n'est pas garanti : stockage local,
 * paramètre d'URL, champ texte d'une base de données, message reçu d'un tiers. Contrairement à
 * `JSON.parse`, une chaîne mal formée ne lève pas de `SyntaxError`.
 *
 * @remarks
 * Convention des fonctions `parse*` : une saisie invalide renvoie `undefined`, ou `fallback`
 * s'il est fourni. Ici, la valeur de repli est un paramètre (et non `?? valeur`) car `null`
 * est un JSON valide : `safeJsonParse("null", [])` renvoie bien `null`.
 *
 * Le type `T` n'est **pas** vérifié à l'exécution : valider la structure obtenue (garde de
 * type, schéma) avant de s'y fier.
 *
 * @typeParam T - Type attendu de la valeur analysée (déduit de `fallback` s'il est fourni).
 * @param text - Chaîne JSON à analyser. `null` et `undefined` sont traités comme invalides.
 * @param fallback - Valeur renvoyée si `text` est absent ou n'est pas un JSON valide.
 * @returns La valeur analysée, ou `fallback` (`undefined` par défaut) si `text` est absent ou
 *   n'est pas un JSON valide.
 * @example
 * ```ts
 * safeJsonParse<{ id: number }>('{"id": 1}'); // { id: 1 }
 * safeJsonParse("{invalide"); // undefined
 * safeJsonParse("{invalide", { theme: "clair" }); // { theme: "clair" }
 * safeJsonParse("null", []); // null
 * ```
 * @since 0.2.0
 */
export function safeJsonParse<T>(text: string | null | undefined, fallback?: T): T | undefined {
  if (text === null || text === undefined) {
    return fallback;
  }
  try {
    return JSON.parse(text) as T;
  } catch {
    return fallback;
  }
}
