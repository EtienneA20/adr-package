import type { EFilterOperator } from "../filter-operator";

/**
 * Valeur simple d'une condition de filtre (format JSON) : texte, nombre ou booléen. Les dates
 * et UUID circulent en texte.
 *
 * @example
 * ```ts
 * const value: FilterScalar = "2026-01-31";
 * ```
 * @since 0.3.0
 */
export type FilterScalar = string | number | boolean;

/**
 * Valeur d'une condition de filtre : une valeur simple, un couple `[min, max]` (`between`) ou
 * une liste (`in`, `nin`). Le format exact dépend de l'opérateur (voir `EFilterOperator`).
 *
 * @example
 * ```ts
 * const value: FilterValue = ["available", "reserved"];
 * ```
 * @since 0.3.0
 */
export type FilterValue = FilterScalar | readonly FilterScalar[];

/**
 * Condition d'un filtre : un champ, un opérateur et une valeur.
 *
 * @typeParam F - Noms des champs filtrables.
 * @example
 * ```ts
 * const condition: IFilterCondition<"title"> = { field: "title", op: "contains", value: "dune" };
 * ```
 * @since 0.3.0
 */
export interface IFilterCondition<F extends string = string> {
  /** Champ filtré (nom public du contrat, éventuellement chemin de relation `auteur.nom`). */
  readonly field: F;
  /** Opérateur de comparaison. */
  readonly op: EFilterOperator;
  /** Valeur comparée, au format attendu par l'opérateur. */
  readonly value: FilterValue;
  /**
   * Respect de la casse pour `contains`, `startsWith` et `endsWith`. Absent ou `false` :
   * comparaison insensible à la casse.
   */
  readonly caseSensitive?: boolean | undefined;
}

/**
 * Groupe « ET » : vrai si toutes ses conditions sont vraies.
 *
 * @typeParam F - Noms des champs filtrables.
 * @example
 * ```ts
 * const group: IFilterAndGroup = { and: [conditionA, conditionB] };
 * ```
 * @since 0.3.0
 */
export interface IFilterAndGroup<F extends string = string> {
  /** Nœuds combinés (au moins un). */
  readonly and: readonly FilterNode<F>[];
}

/**
 * Groupe « OU » : vrai si au moins une de ses conditions est vraie.
 *
 * @typeParam F - Noms des champs filtrables.
 * @example
 * ```ts
 * const group: IFilterOrGroup = { or: [conditionA, conditionB] };
 * ```
 * @since 0.3.0
 */
export interface IFilterOrGroup<F extends string = string> {
  /** Nœuds combinés (au moins un). */
  readonly or: readonly FilterNode<F>[];
}

/**
 * Négation : vrai si le nœud qu'il contient est faux.
 *
 * @typeParam F - Noms des champs filtrables.
 * @example
 * ```ts
 * const group: IFilterNotGroup = { not: { or: [conditionA, conditionB] } };
 * ```
 * @since 0.3.0
 */
export interface IFilterNotGroup<F extends string = string> {
  /** Nœud nié. */
  readonly not: FilterNode<F>;
}

/**
 * Nœud de l'arbre de filtre du contrat de liste : une condition ou un groupe `and`, `or` ou
 * `not`. La profondeur et le nombre de conditions sont bornés par `IListQueryLimits`.
 *
 * @typeParam F - Noms des champs filtrables.
 * @example
 * ```ts
 * const filter: FilterNode<"status" | "title"> = {
 *   or: [
 *     { field: "status", op: "eq", value: "available" },
 *     { not: { field: "title", op: "startsWith", value: "Le" } },
 *   ],
 * };
 * ```
 * @since 0.3.0
 */
export type FilterNode<F extends string = string> =
  IFilterCondition<F> | IFilterAndGroup<F> | IFilterOrGroup<F> | IFilterNotGroup<F>;

/**
 * Indique si un nœud de filtre est une condition (et non un groupe).
 *
 * À utiliser pour parcourir un arbre de filtre déjà validé (conversion vers un ORM,
 * affichage des filtres actifs).
 *
 * @typeParam F - Noms des champs filtrables.
 * @param node - Nœud à tester.
 * @returns `true` si le nœud est une condition `{ field, op, value }`.
 * @example
 * ```ts
 * const fields = isFilterCondition(node) ? [node.field] : [];
 * ```
 * @since 0.3.0
 */
export function isFilterCondition<F extends string>(
  node: FilterNode<F>,
): node is IFilterCondition<F> {
  return "field" in node;
}
