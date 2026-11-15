// #region prisma
import type { IPage } from "@etiennea20/adr-misc/contract";
import { type IListCriteria, toPage } from "@etiennea20/adr-nest/filtering";
import { toPrismaFindArgs } from "@etiennea20/adr-nest/prisma";

// Ligne lue par Prisma (modèle `Book` avec une relation `author`).
export interface IBookRow {
  id: string;
  title: string;
  author: { name: string };
}

// Partie du client Prisma utilisée ici : en vrai, `prisma.book` (type `Prisma.BookDelegate`).
export interface IBookDelegate {
  findMany(args: object): Promise<IBookRow[]>;
  count(args: object): Promise<number>;
}

export class PrismaBooksRepository {
  constructor(private readonly books: IBookDelegate) {}

  // À appeler avec les critères de `@ListQuery(bookListQuery, { columns: { authorName: "author.name" } })`.
  async findPage(criteria: IListCriteria): Promise<IPage<IBookRow>> {
    const args = toPrismaFindArgs(criteria);
    const [rows, total] = await Promise.all([
      this.books.findMany(args),
      criteria.withTotal ? this.books.count({ where: args.where }) : undefined,
    ]);
    return toPage(rows, criteria, total);
  }
}
// #endregion prisma
