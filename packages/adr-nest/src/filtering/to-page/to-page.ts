import type { IPage } from "@etiennea20/adr-misc/contract";

import type { IListCriteria } from "../list-criteria";

/**
 * Construit la page de résultats (`IPage`, format partagé avec le front) à partir des lignes
 * lues avec `criteria.take` (une ligne de plus que la taille de page).
 *
 * À appeler à la fin d'une route de liste : la ligne en plus, si elle existe, est retirée et
 * indique `hasNextPage` ; `total` et `pageCount` ne sont renseignés que si `total` est fourni
 * (comptage demandé : `criteria.withTotal`).
 *
 * @typeParam T - Type d'un élément.
 * @param rows - Lignes lues (au plus `criteria.take`).
 * @param criteria - Critères de la requête.
 * @param total - Nombre total d'éléments, si le comptage a été fait.
 * @returns La page de résultats.
 * @example
 * ```ts
 * const [rows, total] = await Promise.all([
 *   prisma.book.findMany(args),
 *   criteria.withTotal ? prisma.book.count({ where: args.where }) : undefined,
 * ]);
 * return toPage(rows, criteria, total);
 * ```
 * @since 0.2.0
 */
export function toPage<T>(
  rows: readonly T[],
  criteria: Pick<IListCriteria, "page" | "pageSize">,
  total?: number,
): IPage<T> {
  return {
    items: rows.slice(0, criteria.pageSize),
    page: criteria.page,
    pageSize: criteria.pageSize,
    ...(total === undefined ? {} : { total, pageCount: Math.ceil(total / criteria.pageSize) }),
    hasNextPage: rows.length > criteria.pageSize,
  };
}
