/**
 * Indique si une valeur est une fonction (fonction classique, fléchée, asynchrone, classe…).
 *
 * À utiliser pour accepter une valeur « ou une fonction qui la calcule » (`value` ou
 * `() => value`) et distinguer les deux cas.
 *
 * @remarks
 * Le type affiné est `(...args: never[]) => unknown` : sur une union, le type exact de la
 * fonction est conservé ; sur une valeur `unknown`, la fonction peut être appelée sans argument
 * et son résultat est `unknown`.
 *
 * @param value - Valeur à tester.
 * @returns `true` si `typeof value === "function"`.
 * @example
 * ```ts
 * type Label = string | (() => string);
 * const resolveLabel = (label: Label): string => (isFunction(label) ? label() : label);
 * resolveLabel(() => "Emprunts en retard"); // "Emprunts en retard"
 * ```
 * @since 0.2.0
 */
export function isFunction(value: unknown): value is (...args: never[]) => unknown {
  return typeof value === "function";
}
