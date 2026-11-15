import { parseListQuery } from "@etiennea20/adr-nest/filtering";
import { Test } from "@nestjs/testing";
import { describe, expect, it } from "vitest";

import { AppModule } from "./app.module";
import { BOOKS, BooksController, bookListQuery } from "./books";
import { HealthController } from "./health";
import { LoansController, loanListQuery } from "./loans";

describe("AppModule", () => {
  it("assemble l'application : injection des dépendances par constructeur comprise", async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    // Démarrage complet : le mode strict des permissions vérifie l'annotation de chaque route.
    await moduleRef.init();

    expect(moduleRef.get(HealthController).check()).toEqual({ status: "ok" });
    const books = moduleRef.get(BooksController);
    expect(books.list(parseListQuery(bookListQuery, {})).total).toBe(3);
    expect(
      books.search(parseListQuery(bookListQuery, { q: "dune" }, { source: "body" })).items,
    ).toHaveLength(1);
    expect(books.get(BOOKS[0]?.id ?? "").title).toBe("Les Misérables");
    expect(
      books.create({ title: "Nana", authorName: "Zola", publishedAt: "1880-03-01" }).id,
    ).toBeTruthy();
    expect(books.update(BOOKS[1]?.id ?? "", { status: "available" }).status).toBe("available");

    const loans = moduleRef.get(LoansController);
    const member = { id: "adherent-1", roles: ["member"] };
    expect(loans.list(member, parseListQuery(loanListQuery, {})).total).toBe(2);
    expect(loans.cancel(member, "emprunt-1").status).toBe("cancelled");

    await moduleRef.close();
  });
});
