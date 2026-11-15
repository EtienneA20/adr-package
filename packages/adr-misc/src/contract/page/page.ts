import { z } from "zod";

/**
 * Page de résultats d'une liste paginée par numéro de page.
 *
 * `total` (nombre total d'éléments) et `pageCount` (nombre de pages) sont absents quand le
 * comptage est désactivé (`withTotal: false`) ; `hasNextPage` reste toujours renseigné.
 *
 * @typeParam T - Type d'un élément.
 * @example
 * ```ts
 * const page: IPage<IBook> = { items: [], page: 1, pageSize: 20, total: 0, pageCount: 0, hasNextPage: false };
 * ```
 * @since 0.3.0
 */
export interface IPage<T> {
  /** Éléments de la page, dans l'ordre du tri demandé. */
  items: T[];
  /** Numéro de la page, à partir de 1. */
  page: number;
  /** Taille de page demandée (la dernière page peut contenir moins d'éléments). */
  pageSize: number;
  /** Nombre total d'éléments, absent si le comptage est désactivé. */
  total?: number | undefined;
  /** Nombre total de pages, absent si le comptage est désactivé. */
  pageCount?: number | undefined;
  /** `true` s'il existe une page suivante. */
  hasNextPage: boolean;
}

/**
 * Crée le schéma d'une page de résultats ({@link IPage}) à partir du schéma d'un élément.
 *
 * À utiliser côté front pour valider la réponse d'une liste (`pageSchema(bookSchema).parse`),
 * et côté serveur pour décrire la sortie d'une route de liste.
 *
 * @typeParam T - Schéma zod d'un élément.
 * @param item - Schéma d'un élément de la page.
 * @returns Le schéma de la page, dont la sortie est `IPage<z.output<T>>`.
 * @example
 * ```ts
 * const bookPageSchema = pageSchema(z.object({ id: z.uuid(), title: z.string() }));
 * const page = bookPageSchema.parse(await response.json());
 * page.items[0]?.title;
 * ```
 * @since 0.3.0
 */
export function pageSchema<T extends z.ZodType>(
  item: T,
): z.ZodType<IPage<z.output<T>>, IPage<z.input<T>>> {
  return z.object({
    items: z.array(item),
    page: z.int().min(1),
    pageSize: z.int().min(1),
    total: z.int().min(0).optional(),
    pageCount: z.int().min(0).optional(),
    hasNextPage: z.boolean(),
  });
}
