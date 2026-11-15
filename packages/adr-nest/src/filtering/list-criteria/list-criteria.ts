import type { EFilterOperator, ISortItem } from "@etiennea20/adr-misc/contract";

/**
 * Valeur d'une condition de critères : valeur simple (les dates du contrat sont converties en
 * `Date`), couple `[min, max]` (`between`) ou liste (`in`, `nin`).
 *
 * @example
 * ```ts
 * const value: CriteriaValue = [new Date("2020-01-01"), new Date("2020-12-31")];
 * ```
 * @since 0.2.0
 */
export type CriteriaValue =
  string | number | boolean | Date | readonly (string | number | boolean | Date)[];

/**
 * Condition de critères, neutre vis-à-vis de l'ORM : chemin de colonne (côté serveur),
 * opérateur du contrat, valeur convertie.
 *
 * @example
 * ```ts
 * const condition: ICriteriaCondition = { path: "author.name", op: "contains", value: "zola", caseSensitive: false };
 * ```
 * @since 0.2.0
 */
export interface ICriteriaCondition {
  /** Chemin de la colonne (`title`, `author.name`), issu de la liste blanche du serveur. */
  readonly path: string;
  /** Opérateur du contrat de liste. */
  readonly op: EFilterOperator;
  /** Valeur comparée. */
  readonly value: CriteriaValue;
  /** Respect de la casse (opérateurs de texte uniquement ; `false` par défaut). */
  readonly caseSensitive: boolean;
}

/**
 * Nœud de l'arbre de critères : une condition ou un groupe `and`, `or`, `not`.
 *
 * @example
 * ```ts
 * const node: CriteriaNode = { or: [conditionA, { not: conditionB }] };
 * ```
 * @since 0.2.0
 */
export type CriteriaNode =
  | ICriteriaCondition
  | { readonly and: readonly CriteriaNode[] }
  | { readonly or: readonly CriteriaNode[] }
  | { readonly not: CriteriaNode };

/**
 * Critère de tri : chemin de colonne et sens.
 *
 * @example
 * ```ts
 * const order: ICriteriaOrder = { path: "publishedAt", direction: "desc" };
 * ```
 * @since 0.2.0
 */
export interface ICriteriaOrder {
  /** Chemin de la colonne triée. */
  readonly path: string;
  /** Sens du tri. */
  readonly direction: ISortItem["direction"];
}

/**
 * Critères de liste : traduction, neutre vis-à-vis de l'ORM, d'une requête de liste validée.
 *
 * Produits par `ListQuery` / `parseListQuery`, consommés par un adaptateur
 * (`toPrismaFindArgs`) ou par `applyCriteriaInMemory`. Ne contiennent que des chemins issus de
 * la liste blanche du serveur et des valeurs validées : jamais de requête brute du client.
 * `take` vaut `pageSize + 1` : la ligne en plus indique s'il existe une page suivante
 * (`toPage` la retire).
 *
 * @example
 * ```ts
 * const rows = await repository.find({ where: criteria.where, skip: criteria.skip, take: criteria.take });
 * return toPage(rows, criteria, total);
 * ```
 * @since 0.2.0
 */
export interface IListCriteria {
  /** Filtre et recherche `q` combinés, absent si aucun. */
  readonly where?: CriteriaNode | undefined;
  /** Tri, dans l'ordre de priorité. */
  readonly orderBy: readonly ICriteriaOrder[];
  /** Colonnes demandées (chemins), absent pour la sélection par défaut. */
  readonly select?: readonly string[] | undefined;
  /** Nombre d'éléments à sauter (`(page - 1) * pageSize`). */
  readonly skip: number;
  /** Nombre d'éléments à lire : `pageSize + 1`. */
  readonly take: number;
  /** Numéro de page, à partir de 1. */
  readonly page: number;
  /** Taille de page. */
  readonly pageSize: number;
  /** Calculer le nombre total d'éléments. */
  readonly withTotal: boolean;
}
