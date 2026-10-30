/**
 * Retire les doublons d'un tableau en conservant la première occurrence de chaque valeur.
 *
 * À utiliser pour dédoublonner des valeurs simples (identifiants, genres, tags…). Les valeurs
 * sont comparées avec `SameValueZero` (comme `Set`) : deux objets distincts de même contenu
 * sont conservés ; pour comparer des objets par identifiant, utiliser {@link uniqueBy}. Le
 * tableau d'origine n'est pas modifié.
 *
 * @typeParam T - Type des éléments.
 * @param items - Tableau à dédoublonner.
 * @returns Un nouveau tableau sans doublon, dans l'ordre des premières occurrences.
 * @example
 * ```ts
 * unique(["roman", "essai", "roman"]); // ["roman", "essai"]
 * ```
 * @since 0.2.0
 */
export function unique<T>(items: readonly T[]): T[] {
  return [...new Set(items)];
}
