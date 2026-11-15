import { NotFoundException } from "@nestjs/common";
import { describe, expect, it } from "vitest";

import { BOOKS } from "./book";
import { BooksRepository } from "./books.repository";
import { BooksService } from "./books.service";

describe("BooksService", () => {
  const service = new BooksService(new BooksRepository());

  it("liste le catalogue", () => {
    expect(service.list().map((book) => book.title)).toEqual([
      "Les Misérables",
      "Dune",
      "Germinal",
    ]);
  });

  it("renvoie un livre par identifiant", () => {
    expect(service.get(BOOKS[1]?.id ?? "").title).toBe("Dune");
  });

  it("lève une 404 en français pour un identifiant inconnu", () => {
    expect(() => service.get("inconnu")).toThrow(
      new NotFoundException("Livre « inconnu » introuvable."),
    );
  });

  it("renvoie des copies : modifier un résultat ne modifie pas le dépôt", () => {
    const [first] = service.list();
    if (first) first.title = "modifié";
    expect(service.list()[0]?.title).toBe("Les Misérables");
  });
});
