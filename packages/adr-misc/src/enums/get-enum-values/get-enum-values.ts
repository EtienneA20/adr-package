/**
 * Renvoie les valeurs d'une énumération `as const`, dans l'ordre de déclaration.
 *
 * À utiliser pour construire les options d'une liste déroulante, valider une saisie ou
 * parcourir tous les cas d'une énumération. Prévu pour les objets `as const` préfixés par `E`
 * (pas pour les `enum` TypeScript numériques, qui contiennent des clés inverses).
 *
 * @typeParam TEnum - Type de l'objet énumération.
 * @param enumObject - Énumération (`EHttpMethod`, `ESortDirection`…).
 * @returns Un nouveau tableau des valeurs, typé avec l'union des valeurs.
 * @example
 * ```ts
 * getEnumValues(ESortDirection); // ["asc", "desc"]
 * ```
 * @since 0.2.0
 */
export function getEnumValues<TEnum extends Readonly<Record<string, string | number>>>(
  enumObject: TEnum,
): TEnum[keyof TEnum][] {
  return Object.values(enumObject) as TEnum[keyof TEnum][];
}
