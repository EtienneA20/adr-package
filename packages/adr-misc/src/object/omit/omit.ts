/**
 * Crée un nouvel objet sans les clés indiquées.
 *
 * À utiliser pour retirer des champs avant un envoi ou un affichage (mot de passe, champs
 * techniques…). Seules les propriétés propres, énumérables et à clé chaîne sont copiées (comme
 * `Object.entries`), par référence (copie superficielle). L'objet d'origine n'est pas modifié.
 *
 * @typeParam T - Type de l'objet source.
 * @typeParam K - Clés retirées.
 * @param object - Objet source.
 * @param keys - Clés à retirer.
 * @returns Un nouvel objet de type `Omit<T, K>`.
 * @example
 * ```ts
 * omit({ id: 1, email: "a@b.fr", password: "secret" }, ["password"]); // { id: 1, email: "a@b.fr" }
 * ```
 * @since 0.2.0
 */
export function omit<T extends object, K extends keyof T>(
  object: T,
  keys: readonly K[],
): Omit<T, K> {
  const excluded = new Set(keys.map((key) => (typeof key === "number" ? String(key) : key)));
  return Object.fromEntries(
    Object.entries(object).filter(([key]) => !excluded.has(key as K)),
  ) as Omit<T, K>;
}
