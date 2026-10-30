/**
 * Indique si une valeur est un objet simple (littéral `{}` ou `Object.create(null)`), par
 * opposition aux tableaux, dates, `Map`, `Set` et instances de classe.
 *
 * Copie privée volontaire de la garde publique de `guards` : les catégories ne s'importent pas
 * entre elles, et les fonctions de `object` ne parcourent que les objets simples.
 *
 * @param value - Valeur à tester.
 * @returns `true` si la valeur est un objet simple.
 * @internal
 */
export function isPlainRecord(value: unknown): value is Record<string, unknown> {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const prototype = Object.getPrototypeOf(value) as object | null;
  return prototype === Object.prototype || prototype === null;
}
