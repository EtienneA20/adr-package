import { Injectable } from "@nestjs/common";

import { BOOKS, type IBook } from "./book";

/**
 * Dépôt en mémoire : l'exemple tourne sans base de données, en local, en CI et dans Docker.
 * Une vraie application le remplace par un dépôt Prisma (voir le guide du filtrage).
 */
@Injectable()
export class BooksRepository {
  private readonly books: IBook[] = BOOKS.map((book) => ({ ...book }));

  findAll(): IBook[] {
    return this.books.map((book) => ({ ...book }));
  }

  findById(id: string): IBook | undefined {
    const book = this.books.find((candidate) => candidate.id === id);
    return book && { ...book };
  }
}
