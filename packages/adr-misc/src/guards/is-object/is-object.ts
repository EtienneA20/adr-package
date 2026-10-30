/**
 * Indique si une valeur est un objet non `null` et qui n'est pas un tableau.
 *
 * À utiliser avant de lire les propriétés d'une valeur de type `unknown` (corps de requête,
 * JSON). Les instances de classes (`Date`, `Map`…) sont acceptées ; utiliser `isPlainObject`
 * pour n'accepter que les objets littéraux. Les fonctions sont exclues.
 *
 * @param value - Valeur à tester.
 * @returns `true` si `typeof value === "object"`, que `value` n'est pas `null` et n'est pas un
 * tableau.
 * @example
 * ```ts
 * isObject({ title: "Dune" }); // true
 * isObject(new Date(2026, 0, 15)); // true
 * isObject(["Dune"]); // false
 * isObject(null); // false
 * ```
 * @since 0.2.0
 */
export function isObject(value: unknown): value is Record<PropertyKey, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
