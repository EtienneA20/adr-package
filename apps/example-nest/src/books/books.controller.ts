// #region public-routes
import type { IPage } from "@etiennea20/adr-misc/contract";
import { Authenticated, Can, Public, ValidBody, ValidQuery } from "@etiennea20/adr-nest";
import {
  ExportHeaders,
  assertExportSize,
  createExportFile,
  selectExportColumns,
} from "@etiennea20/adr-nest/export";
import { type IListCriteria, ListQuery } from "@etiennea20/adr-nest/filtering";
import { Body, Controller, Get, Param, Patch, Post, type StreamableFile } from "@nestjs/common";

import type { IBook } from "./book";
import {
  type ExportQuery,
  bookExportColumns,
  bookExportStream,
  exportQuerySchema,
} from "./book-export";
import { bookListQuery } from "./book-list-query";
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

  // #region list-routes
  @Public() // le catalogue est consultable sans compte
  @Get() // GET /livres?filter=…&sort=…&page=2 (un paramètre par clé, en JSON)
  list(@ListQuery(bookListQuery) criteria: IListCriteria): IPage<IBook> {
    return this.books.findPage(criteria);
  }

  @Public()
  @Post("search") // même contrat dans le corps, pour les filtres trop longs pour une URL
  search(@ListQuery(bookListQuery, { source: "body" }) criteria: IListCriteria): IPage<IBook> {
    return this.books.findPage(criteria);
  }
  // #endregion list-routes

  // #region export-route
  @Can("export", "book") // bibliothécaires uniquement (règle `manage` sur `all`)
  @Get("export") // GET /livres/export?format=csv&filter=…&fields=["title","publishedAt"]
  @ExportHeaders()
  export(
    @ValidQuery(exportQuerySchema) query: ExportQuery,
    @ListQuery(bookListQuery) criteria: IListCriteria,
  ): StreamableFile {
    const books = this.books.findAllMatching(criteria);
    assertExportSize(books.length, 10_000); // avant l'envoi : une vraie 400 si trop gros
    const columns = selectExportColumns(bookExportColumns, criteria.select);
    return createExportFile(bookExportStream(query.format, books, columns), {
      format: query.format,
      fileName: "Catalogue de la bibliothèque",
    });
  }
  // #endregion export-route

  @Authenticated() // le détail est réservé aux utilisateurs connectés, quel que soit leur rôle
  @Get(":id")
  get(@Param("id") id: string): IBook {
    return this.books.get(id);
  }

  // #region validation
  @Can("create", "book")
  @Post() // NestJS 11 et 12 : pipe du package, erreurs au format d'API
  create(@ValidBody(createBookSchema) input: CreateBookInput): IBook {
    return this.books.create(input);
  }

  @Can("update", "book")
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
