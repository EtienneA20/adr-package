/**
 * Renvoie les clés d'une énumération `as const`, dans l'ordre de déclaration.
 *
 * À utiliser pour parcourir les noms d'une énumération (clés de traduction, en-têtes de
 * colonnes). Contrairement à `Object.keys`, le résultat est typé avec l'union des clés.
 *
 * @typeParam TEnum - Type de l'objet énumération.
 * @param enumObject - Énumération (`EWeekDay`, `EHttpMethod`…).
 * @returns Un nouveau tableau des clés.
 * @example
 * ```ts
 * getEnumKeys(ESortDirection); // ["ASC", "DESC"]
 * ```
 * @since 0.2.0
 */
export function getEnumKeys<TEnum extends Readonly<Record<string, string | number>>>(
  enumObject: TEnum,
): (keyof TEnum & string)[] {
  return Object.keys(enumObject);
}
