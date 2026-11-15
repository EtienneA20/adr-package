import type { CriteriaNode, ICriteriaCondition, IListCriteria } from "../../filtering";

/**
 * Arguments `findMany` de Prisma produits par `toPrismaFindArgs`.
 *
 * Objets simples (aucun import de `@prisma/client`) : les passer au client généré avec une
 * assertion vers ses types (`as Prisma.BookFindManyArgs`).
 *
 * @example
 * ```ts
 * const args: IPrismaFindArgs = toPrismaFindArgs(criteria);
 * ```
 * @since 0.2.0
 */
export interface IPrismaFindArgs {
  /** Filtre Prisma (`AND`, `OR`, `NOT`, opérateurs `equals`, `contains`…), absent si aucun. */
  where?: Record<string, unknown> | undefined;
  /** Tri Prisma, un objet par critère (`[{ author: { name: "asc" } }]`). */
  orderBy: Record<string, unknown>[];
  /** Sélection Prisma (`{ title: true, author: { select: { name: true } } }`), si demandée. */
  select?: Record<string, unknown> | undefined;
  /** Lignes à sauter. */
  skip: number;
  /** Lignes à lire (taille de page + 1, voir `toPage`). */
  take: number;
}

// Construit `{ a: { b: leaf } }` à partir du chemin `a.b`.
function nest(path: string, leaf: unknown): Record<string, unknown> {
  return path
    .split(".")
    .reduceRight<unknown>((value, segment) => ({ [segment]: value }), leaf) as Record<
    string,
    unknown
  >;
}

const SIMPLE_OPERATORS: Readonly<Record<string, string>> = {
  eq: "equals",
  ne: "not",
  gt: "gt",
  gte: "gte",
  lt: "lt",
  lte: "lte",
  in: "in",
  nin: "notIn",
  contains: "contains",
  startsWith: "startsWith",
  endsWith: "endsWith",
};

function conditionFilter(condition: ICriteriaCondition): Record<string, unknown> {
  const { op, value } = condition;
  if (op === "isNull") return value ? { equals: null } : { not: null };
  if (op === "between") {
    const [min, max] = value as readonly unknown[];
    return { gte: min, lte: max };
  }
  const filter: Record<string, unknown> = { [SIMPLE_OPERATORS[op] ?? op]: value };
  const isText = op === "contains" || op === "startsWith" || op === "endsWith";
  return isText && !condition.caseSensitive ? { ...filter, mode: "insensitive" } : filter;
}

/**
 * Convertit un arbre de critères en filtre `where` de Prisma.
 *
 * @param node - Arbre de critères.
 * @returns Le filtre Prisma.
 * @example
 * ```ts
 * toPrismaWhere({ path: "author.name", op: "contains", value: "zola", caseSensitive: false });
 * // { author: { name: { contains: "zola", mode: "insensitive" } } }
 * ```
 * @since 0.2.0
 */
export function toPrismaWhere(node: CriteriaNode): Record<string, unknown> {
  if ("path" in node) return nest(node.path, conditionFilter(node));
  if ("not" in node) return { NOT: toPrismaWhere(node.not) };
  if ("and" in node) return { AND: node.and.map(toPrismaWhere) };
  return { OR: node.or.map(toPrismaWhere) };
}

function toPrismaSelect(paths: readonly string[]): Record<string, unknown> {
  const select: Record<string, unknown> = {};
  for (const path of paths) {
    const [head = "", ...rest] = path.split(".");
    if (!rest.length) {
      select[head] = true;
      continue;
    }
    const relation = (select[head] ?? { select: {} }) as { select: Record<string, unknown> };
    relation.select = { ...relation.select, ...toPrismaSelect([rest.join(".")]) };
    select[head] = relation;
  }
  return select;
}

/**
 * Convertit des critères de liste en arguments `findMany` de Prisma : `where`, `orderBy`,
 * `select`, `skip`, `take`.
 *
 * À utiliser dans un dépôt Prisma, après le décorateur `ListQuery`. Les chemins de relation
 * (`author.name`) deviennent des objets imbriqués : relations « vers un » uniquement (pour une
 * relation « vers plusieurs », Prisma attend `some` / `every`, à écrire dans une condition
 * serveur). Les opérateurs de texte sont insensibles à la casse (`mode: "insensitive"`, pris en
 * charge par PostgreSQL) sauf `caseSensitive`. Aucun SQL n'est produit : Prisma paramètre les
 * valeurs. Aucune dépendance à `@prisma/client`.
 *
 * @param criteria - Critères de liste.
 * @returns Les arguments `findMany` (le `where` sert aussi à `count`).
 * @example
 * ```ts
 * const args = toPrismaFindArgs(criteria);
 * const [rows, total] = await Promise.all([
 *   prisma.book.findMany(args as Prisma.BookFindManyArgs),
 *   criteria.withTotal ? prisma.book.count({ where: args.where as Prisma.BookWhereInput }) : undefined,
 * ]);
 * return toPage(rows, criteria, total);
 * ```
 * @since 0.2.0
 */
export function toPrismaFindArgs(criteria: IListCriteria): IPrismaFindArgs {
  return {
    ...(criteria.where ? { where: toPrismaWhere(criteria.where) } : {}),
    orderBy: criteria.orderBy.map((order) => nest(order.path, order.direction)),
    ...(criteria.select ? { select: toPrismaSelect(criteria.select) } : {}),
    skip: criteria.skip,
    take: criteria.take,
  };
}
