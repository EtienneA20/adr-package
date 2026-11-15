/**
 * Condition produite par `PermissionsService.scope` : égalité (`eq`) ou appartenance (`in`)
 * sur un champ de la ressource, références au sujet déjà résolues.
 *
 * Compatible avec `ICriteriaCondition` de `@etiennea20/adr-nest/filtering` : se combine aux
 * critères d'une liste avec `andCriteria`, sans dépendance de l'entrée principale au filtrage.
 *
 * @example
 * ```ts
 * const condition: IPermissionCondition = { path: "memberId", op: "eq", value: "m-1", caseSensitive: true };
 * ```
 * @since 0.2.0
 */
export interface IPermissionCondition {
  /** Chemin du champ de la ressource (`memberId`, `library.id`). */
  readonly path: string;
  /** `eq` pour une valeur simple, `in` pour une liste. */
  readonly op: "eq" | "in";
  /** Valeur comparée. */
  readonly value: string | number | boolean | readonly (string | number | boolean)[];
  /** Comparaison exacte : toujours `true`. */
  readonly caseSensitive: true;
}

/**
 * Périmètre d'un sujet pour une action sur un type de ressource : arbre de conditions à ajouter
 * au filtre d'une liste.
 *
 * `{ and: [] }` : aucune restriction (toutes les ressources) ; `{ or: [] }` : aucune ressource.
 *
 * @example
 * ```ts
 * const scope: PermissionScope = { or: [{ path: "memberId", op: "eq", value: "m-1", caseSensitive: true }] };
 * ```
 * @since 0.2.0
 */
export type PermissionScope =
  | IPermissionCondition
  | { readonly and: readonly PermissionScope[] }
  | { readonly or: readonly PermissionScope[] };
