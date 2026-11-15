/**
 * Limites d'un contrat de liste, vérifiées à la validation d'une requête : elles protègent le
 * serveur des requêtes trop coûteuses.
 *
 * Toutes les valeurs sont des entiers strictement positifs. Les valeurs par défaut sont dans
 * `DEFAULT_LIST_QUERY_LIMITS` ; `defineListQuery` accepte une surcharge partielle.
 *
 * @example
 * ```ts
 * const limits: Partial<IListQueryLimits> = { maxDepth: 4, maxConditions: 50 };
 * ```
 * @since 0.3.0
 */
export interface IListQueryLimits {
  /** Profondeur maximale des groupes imbriqués (`and`, `or`, `not`) ; une condition seule vaut 0. */
  readonly maxDepth: number;
  /** Nombre maximal de conditions dans tout l'arbre de filtre. */
  readonly maxConditions: number;
  /** Nombre maximal de valeurs d'une liste `in` ou `nin`. */
  readonly maxInValues: number;
  /** Longueur maximale d'une valeur texte de filtre. */
  readonly maxStringLength: number;
  /** Taille de page maximale. */
  readonly maxPageSize: number;
  /** Nombre maximal de champs de tri. */
  readonly maxSortFields: number;
  /** Longueur maximale de la recherche globale `q`. */
  readonly maxSearchLength: number;
  /** Longueur maximale d'un paramètre d'URL, avant décodage JSON. */
  readonly maxParamLength: number;
}

/**
 * Limites appliquées par défaut par `defineListQuery`.
 *
 * Profondeur 3, 20 conditions, 100 valeurs par liste, 255 caractères par texte, pages de 100
 * éléments au plus, 3 champs de tri, recherche de 100 caractères, paramètres d'URL de 4 096
 * caractères.
 *
 * @example
 * ```ts
 * defineListQuery({ fields, limits: { maxConditions: DEFAULT_LIST_QUERY_LIMITS.maxConditions * 2 } });
 * ```
 * @since 0.3.0
 */
export const DEFAULT_LIST_QUERY_LIMITS: Readonly<IListQueryLimits> = Object.freeze({
  maxDepth: 3,
  maxConditions: 20,
  maxInValues: 100,
  maxStringLength: 255,
  maxPageSize: 100,
  maxSortFields: 3,
  maxSearchLength: 100,
  maxParamLength: 4096,
});
