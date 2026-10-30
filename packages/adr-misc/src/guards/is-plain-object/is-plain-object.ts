/**
 * Indique si une valeur est un objet « simple » : objet littéral (`{}`), créé par
 * `new Object()` ou par `Object.create(null)`.
 *
 * À utiliser avant de parcourir ou de fusionner les clés d'un objet (copie profonde, fusion de
 * configuration) : les instances de classes (`Date`, `Map`, entités…) et les tableaux sont
 * exclus.
 *
 * @remarks
 * Le test porte sur la chaîne de prototypes (prototype `null`, ou dont le prototype est
 * `null`) et non sur l'identité de `Object.prototype` : un objet créé dans un autre contexte
 * d'exécution (iframe, `vm` de Node) est donc reconnu.
 *
 * @param value - Valeur à tester.
 * @returns `true` si `value` est un objet dont le prototype est `Object.prototype` ou `null`.
 * @example
 * ```ts
 * isPlainObject({ title: "Dune" }); // true
 * isPlainObject(Object.create(null)); // true
 * isPlainObject(new Date(2026, 0, 15)); // false
 * isPlainObject(["Dune"]); // false
 * ```
 * @since 0.2.0
 */
export function isPlainObject(value: unknown): value is Record<PropertyKey, unknown> {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const prototype: unknown = Object.getPrototypeOf(value);
  return prototype === null || Object.getPrototypeOf(prototype) === null;
}
