/**
 * Type de la valeur d'un segment de chemin `K` dans `T` ; `undefined` si `T` n'est pas un objet
 * ou ne contient pas `K`. Distribué sur les unions : un parent optionnel ajoute `undefined`.
 */
type PathSegmentValue<T, K extends string> = T extends object
  ? K extends keyof T
    ? T[K] | (string extends keyof T ? undefined : never)
    : T extends readonly (infer U)[]
      ? K extends `${number}`
        ? U | undefined
        : undefined
      : undefined
  : undefined;

/**
 * Type de la valeur atteinte par un chemin pointé (`"author.address.city"`, `"items.0.title"`)
 * dans un type `T`, utilisé par {@link getPath} et `setPath`.
 *
 * Un segment manquant ou un parent optionnel ajoute `undefined`. Si le chemin n'est pas une
 * chaîne littérale, ou si `T` est `unknown`, le type vaut `unknown`.
 *
 * @typeParam T - Type de l'objet parcouru.
 * @typeParam P - Chemin pointé (chaîne littérale).
 * @example
 * ```ts
 * type City = PathValue<{ author?: { city: string } }, "author.city">; // string | undefined
 * ```
 * @since 0.2.0
 */
export type PathValue<T, P extends string> = unknown extends T
  ? unknown
  : string extends P
    ? unknown
    : P extends `${infer Head}.${infer Rest}`
      ? PathValue<PathSegmentValue<T, Head>, Rest>
      : PathSegmentValue<T, P>;

/**
 * Lit une valeur imbriquée à partir d'un chemin pointé, sans erreur si un parent manque.
 *
 * À utiliser pour lire une propriété profonde dont le chemin est connu sous forme de chaîne
 * (colonne d'un tableau générique, champ de formulaire, règle de tri configurable…). Les index
 * de tableau s'écrivent comme des clés (`"items.0.title"`). Si un parent est `null`,
 * `undefined` ou n'est pas un objet, ou si la valeur finale est `undefined`, la valeur par
 * défaut est renvoyée. Le type de retour est déduit du chemin quand il est littéral. Une clé
 * qui contient elle-même un point ne peut pas être atteinte.
 *
 * @typeParam T - Type de l'objet parcouru.
 * @typeParam P - Chemin pointé.
 * @param object - Objet à parcourir.
 * @param path - Chemin pointé, par exemple `"author.address.city"`.
 * @returns La valeur trouvée, ou `undefined`.
 * @example
 * ```ts
 * getPath(book, "author.address.city"); // "Paris" (type string | undefined si author est optionnel)
 * getPath(loan, "items.0.title"); // titre du premier livre de l'emprunt
 * ```
 * @since 0.2.0
 */
export function getPath<T, P extends string>(object: T, path: P): PathValue<T, P>;
/**
 * Lit une valeur imbriquée à partir d'un chemin pointé, avec une valeur par défaut.
 *
 * @typeParam T - Type de l'objet parcouru.
 * @typeParam P - Chemin pointé.
 * @typeParam D - Type de la valeur par défaut.
 * @param object - Objet à parcourir.
 * @param path - Chemin pointé, par exemple `"author.address.city"`.
 * @param defaultValue - Valeur renvoyée si le chemin n'aboutit pas ou mène à `undefined`.
 * @returns La valeur trouvée, ou `defaultValue`.
 * @example
 * ```ts
 * getPath(book, "author.address.city", "Ville inconnue"); // string
 * ```
 * @since 0.2.0
 */
export function getPath<T, P extends string, D>(
  object: T,
  path: P,
  defaultValue: D,
): Exclude<PathValue<T, P>, undefined> | D;
/**
 * Implémentation commune aux deux signatures.
 *
 * @param object - Objet à parcourir.
 * @param path - Chemin pointé.
 * @param defaultValue - Valeur renvoyée si le chemin n'aboutit pas.
 * @returns La valeur trouvée, ou `defaultValue`.
 * @example
 * ```ts
 * getPath({ a: { b: 1 } }, "a.b"); // 1
 * ```
 */
export function getPath(object: unknown, path: string, defaultValue?: unknown): unknown {
  let current = object;
  for (const segment of path.split(".")) {
    if (typeof current !== "object" || current === null) {
      return defaultValue;
    }
    current = (current as Record<string, unknown>)[segment];
  }
  return current === undefined ? defaultValue : current;
}
