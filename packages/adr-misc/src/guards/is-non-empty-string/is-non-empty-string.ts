/**
 * Indique si une valeur est une chaîne qui contient au moins un caractère autre qu'un espace.
 *
 * À utiliser pour valider un champ texte obligatoire (titre, nom d'adhérent) : une chaîne
 * composée uniquement d'espaces, de tabulations ou de retours à la ligne est considérée comme
 * vide.
 *
 * @param value - Valeur à tester.
 * @returns `true` si `value` est une chaîne non vide une fois `trim()` appliqué.
 * @example
 * ```ts
 * isNonEmptyString("Dune"); // true
 * isNonEmptyString("   "); // false
 * isNonEmptyString(42); // false
 * ```
 * @since 0.2.0
 */
export function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}
