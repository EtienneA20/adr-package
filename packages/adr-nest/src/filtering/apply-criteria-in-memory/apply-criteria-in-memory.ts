import type { IPage } from "@etiennea20/adr-misc/contract";

import { compareForSort, matchesCriteria, readPath } from "../evaluate-criteria";
import type { IListCriteria } from "../list-criteria";
import { toPage } from "../to-page";

/**
 * Applique des critères de liste à un tableau en mémoire : filtre, tri, pagination et total.
 *
 * À utiliser pour une petite liste sans base (référentiel, données de démonstration, tests) ;
 * même sémantique que les adaptateurs d'ORM : texte insensible à la casse par défaut, dates
 * comparées en tant que dates (y compris stockées en texte ISO), valeurs absentes triées en
 * dernier. La sélection de champs (`criteria.select`) n'est pas appliquée : les éléments sont
 * renvoyés entiers.
 *
 * @typeParam T - Type d'un élément.
 * @param items - Éléments (non modifiés).
 * @param criteria - Critères de la requête.
 * @returns La page de résultats, avec `total` si `criteria.withTotal`.
 * @example
 * ```ts
 * @Get()
 * list(@ListQuery(bookListQuery) criteria: IListCriteria): IPage<IBook> {
 *   return applyCriteriaInMemory(this.books.findAll(), criteria);
 * }
 * ```
 * @since 0.2.0
 */
export function applyCriteriaInMemory<T>(items: readonly T[], criteria: IListCriteria): IPage<T> {
  const { where } = criteria;
  const filtered = where ? items.filter((item) => matchesCriteria(item, where)) : [...items];
  const sorted = filtered.sort((left, right) => {
    for (const order of criteria.orderBy) {
      const result = compareForSort(readPath(left, order.path), readPath(right, order.path));
      if (result !== 0) return order.direction === "desc" ? -result : result;
    }
    return 0;
  });
  const rows = sorted.slice(criteria.skip, criteria.skip + criteria.take);
  return toPage(rows, criteria, criteria.withTotal ? sorted.length : undefined);
}
