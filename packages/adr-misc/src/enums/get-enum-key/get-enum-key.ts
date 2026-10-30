/**
 * Renvoie la clé d'une énumération `as const` qui porte une valeur donnée (recherche inverse).
 *
 * À utiliser pour journaliser ou afficher le nom d'une valeur (`404` → `"NOT_FOUND"`). Si
 * plusieurs clés portent la même valeur, la première déclarée est renvoyée.
 *
 * @typeParam TEnum - Type de l'objet énumération.
 * @param enumObject - Énumération de référence.
 * @param value - Valeur recherchée, de n'importe quel type (comparaison stricte `===`).
 * @returns La clé correspondante, ou `undefined` si la valeur n'appartient pas à l'énumération.
 * @example
 * ```ts
 * getEnumKey(EHttpStatus, 404); // "NOT_FOUND"
 * getEnumKey(EHttpStatus, 418); // undefined
 * ```
 * @since 0.2.0
 */
export function getEnumKey<TEnum extends Readonly<Record<string, string | number>>>(
  enumObject: TEnum,
  value: unknown,
): (keyof TEnum & string) | undefined {
  const entry = Object.entries(enumObject).find(([, candidate]) => candidate === value);
  return entry?.[0];
}
