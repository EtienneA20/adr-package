// #region public-routes
import { Public, ValidBody } from "@etiennea20/adr-nest";
import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";

import type { IBook } from "./book";
import {
  type CreateBookInput,
  type UpdateBookInput,
  createBookSchema,
  updateBookSchema,
} from "./book.schemas";
import { BooksService } from "./books.service";

@Controller("livres")
export class BooksController {
  constructor(private readonly books: BooksService) {}

  @Public() // le catalogue est consultable sans compte
  @Get()
  list(): IBook[] {
    return this.books.list();
  }

  @Get(":id") // le détail (avec l'emprunteur) est réservé aux utilisateurs connectés
  get(@Param("id") id: string): IBook {
    return this.books.get(id);
  }

  // #region validation
  @Post() // NestJS 11 et 12 : pipe du package, erreurs au format d'API
  create(@ValidBody(createBookSchema) input: CreateBookInput): IBook {
    return this.books.create(input);
  }

  @Patch(":id") // NestJS 12 : validation native (pipe global de AppModule)
  update(
    @Param("id") id: string,
    @Body({ schema: updateBookSchema }) input: UpdateBookInput,
  ): IBook {
    return this.books.update(id, input);
  }
  // #endregion validation
}
// #endregion public-routes
