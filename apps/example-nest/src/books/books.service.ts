import { Injectable, NotFoundException } from "@nestjs/common";

import type { IBook } from "./book";
import { BooksRepository } from "./books.repository";

@Injectable()
export class BooksService {
  constructor(private readonly repository: BooksRepository) {}

  list(): IBook[] {
    return this.repository.findAll();
  }

  get(id: string): IBook {
    const book = this.repository.findById(id);
    if (!book) throw new NotFoundException(`Livre « ${id} » introuvable.`);
    return book;
  }
}
