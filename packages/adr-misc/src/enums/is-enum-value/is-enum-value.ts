/**
 * Indique si une valeur fait partie d'une énumération `as const` ; garde de type.
 *
 * À utiliser pour valider une valeur venue de l'extérieur (paramètre d'URL, réponse d'API,
 * `localStorage`) avant de la traiter comme une valeur de l'énumération. La comparaison est
 * stricte (`===`) : `"1"` n'est pas une valeur de `EWeekDay`.
 *
 * @typeParam TEnum - Type de l'objet énumération.
 * @param enumObject - Énumération de référence.
 * @param value - Valeur à tester, de n'importe quel type.
 * @returns `true` si `value` est l'une des valeurs de l'énumération (le type est alors affiné).
 * @example
 * ```ts
 * const direction = params.get("direction");
 * const sortDirection = isEnumValue(ESortDirection, direction) ? direction : ESortDirection.ASC;
 * ```
 * @since 0.2.0
 */
export function isEnumValue<TEnum extends Readonly<Record<string, string | number>>>(
  enumObject: TEnum,
  value: unknown,
): value is TEnum[keyof TEnum] {
  return Object.values(enumObject).some((candidate) => candidate === value);
}
