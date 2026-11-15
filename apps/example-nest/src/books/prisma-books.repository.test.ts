import { parseListQuery } from "@etiennea20/adr-nest/filtering";
import { describe, expect, it, vi } from "vitest";

import { bookListQuery } from "./book-list-query";
import {
  type IBookDelegate,
  type IBookRow,
  PrismaBooksRepository,
} from "./prisma-books.repository";

const rows: IBookRow[] = [
  { id: "1", title: "Germinal", author: { name: "Émile Zola" } },
  { id: "2", title: "Nana", author: { name: "Émile Zola" } },
  { id: "3", title: "Thérèse Raquin", author: { name: "Émile Zola" } },
];

function fakeClient(): IBookDelegate {
  return { findMany: vi.fn(() => Promise.resolve(rows)), count: vi.fn(() => Promise.resolve(7)) };
}

describe("PrismaBooksRepository", () => {
  const criteria = parseListQuery(
    bookListQuery,
    {
      filter: { field: "authorName", op: "contains", value: "zola" },
      sort: [{ field: "authorName", direction: "asc" }],
      pageSize: 2,
    },
    { source: "body", columns: { authorName: "author.name" } },
  );

  it("passe à Prisma les arguments issus de la requête, relation comprise", async () => {
    const client = fakeClient();
    await new PrismaBooksRepository(client).findPage(criteria);
    const where = { author: { name: { contains: "zola", mode: "insensitive" } } };
    expect(client.findMany).toHaveBeenCalledWith({
      where,
      orderBy: [{ author: { name: "asc" } }],
      skip: 0,
      take: 3,
    });
    expect(client.count).toHaveBeenCalledWith({ where });
  });

  it("renvoie une page : ligne en plus retirée, total compté", async () => {
    await expect(new PrismaBooksRepository(fakeClient()).findPage(criteria)).resolves.toEqual({
      items: rows.slice(0, 2),
      page: 1,
      pageSize: 2,
      total: 7,
      pageCount: 4,
      hasNextPage: true,
    });
  });

  it("ne compte pas sans withTotal", async () => {
    const client = fakeClient();
    const page = await new PrismaBooksRepository(client).findPage({
      ...criteria,
      withTotal: false,
    });
    expect(client.count).not.toHaveBeenCalled();
    expect(page).not.toHaveProperty("total");
  });
});
