// #region public-routes
import { Public } from "@etiennea20/adr-nest";
import { Controller, Get, Param } from "@nestjs/common";

import type { IBook } from "./book";
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
}
// #endregion public-routes
