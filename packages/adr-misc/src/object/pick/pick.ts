/**
 * Crée un nouvel objet avec seulement les clés demandées.
 *
 * À utiliser pour extraire d'un objet les champs utiles (charge utile d'une requête, colonnes
 * affichées…). Une clé absente de l'objet est absente du résultat (pas de `undefined` ajouté).
 * Les valeurs sont copiées par référence (copie superficielle) et l'objet d'origine n'est pas
 * modifié.
 *
 * @typeParam T - Type de l'objet source.
 * @typeParam K - Clés conservées.
 * @param object - Objet source.
 * @param keys - Clés à conserver.
 * @returns Un nouvel objet de type `Pick<T, K>`.
 * @example
 * ```ts
 * pick({ id: 1, title: "Germinal", stock: 3 }, ["id", "title"]); // { id: 1, title: "Germinal" }
 * ```
 * @since 0.2.0
 */
export function pick<T extends object, K extends keyof T>(
  object: T,
  keys: readonly K[],
): Pick<T, K> {
  const entries = keys.filter((key) => key in object).map((key) => [key, object[key]] as const);
  return Object.fromEntries(entries) as Pick<T, K>;
}
