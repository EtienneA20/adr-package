import type { IPage } from "@etiennea20/adr-misc/contract";
import { type IListCriteria, applyCriteriaInMemory } from "@etiennea20/adr-nest/filtering";
import { Injectable, NotFoundException } from "@nestjs/common";

import type { IBook } from "./book";
import type { CreateBookInput, UpdateBookInput } from "./book.schemas";
import { BooksRepository } from "./books.repository";

@Injectable()
export class BooksService {
  constructor(private readonly repository: BooksRepository) {}

  // #region find-page
  findPage(criteria: IListCriteria): IPage<IBook> {
    // Dépôt en mémoire : mêmes critères que l'adaptateur Prisma (voir prisma-books.repository.ts).
    return applyCriteriaInMemory(this.repository.findAll(), criteria);
  }
  // #endregion find-page

  get(id: string): IBook {
    const book = this.repository.findById(id);
    if (!book) throw new NotFoundException(`Livre « ${id} » introuvable.`);
    return book;
  }

  create(input: CreateBookInput): IBook {
    return this.repository.insert({ ...input, status: "available" });
  }

  update(id: string, input: UpdateBookInput): IBook {
    const book = this.repository.update(id, input);
    if (!book) throw new NotFoundException(`Livre « ${id} » introuvable.`);
    return book;
  }
}
