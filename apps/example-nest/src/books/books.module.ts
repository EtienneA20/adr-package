import { Module } from "@nestjs/common";

import { BooksController } from "./books.controller";
import { BooksRepository } from "./books.repository";
import { BooksService } from "./books.service";

@Module({
  controllers: [BooksController],
  providers: [BooksRepository, BooksService],
})
export class BooksModule {}
