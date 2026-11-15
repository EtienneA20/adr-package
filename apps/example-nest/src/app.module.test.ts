import { Test } from "@nestjs/testing";
import { describe, expect, it } from "vitest";

import { AppModule } from "./app.module";
import { BOOKS, BooksController } from "./books";
import { HealthController } from "./health";

describe("AppModule", () => {
  it("assemble l'application : injection des dépendances par constructeur comprise", async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();

    expect(moduleRef.get(HealthController).check()).toEqual({ status: "ok" });
    const books = moduleRef.get(BooksController);
    expect(books.list()).toHaveLength(3);
    expect(books.get(BOOKS[0]?.id ?? "").title).toBe("Les Misérables");
    expect(
      books.create({ title: "Nana", authorName: "Zola", publishedAt: "1880-03-01" }).id,
    ).toBeTruthy();
    expect(books.update(BOOKS[1]?.id ?? "", { status: "available" }).status).toBe("available");

    await moduleRef.close();
  });
});
