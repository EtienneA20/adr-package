/**
 * Sens d'un tri : croissant ou décroissant.
 *
 * À utiliser pour les paramètres de tri échangés entre un tableau côté front et une API
 * (`?sort=title&direction=asc`), avec les mêmes valeurs des deux côtés.
 *
 * @example
 * ```ts
 * const sort = { field: "title", direction: ESortDirection.ASC }; // direction : "asc"
 * ```
 * @since 0.2.0
 */
export const ESortDirection = {
  ASC: "asc",
  DESC: "desc",
} as const;

/** Valeur possible de {@link ESortDirection}. */
export type ESortDirection = (typeof ESortDirection)[keyof typeof ESortDirection];
