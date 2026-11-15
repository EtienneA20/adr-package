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

describe("BooksService : écriture", () => {
  it("crée un livre disponible avec un identifiant", () => {
    const service = new BooksService(new BooksRepository());
    const book = service.create({
      title: "Bel-Ami",
      authorName: "Maupassant",
      publishedAt: "1885-05-01",
    });
    expect(book).toMatchObject({ title: "Bel-Ami", status: "available" });
    expect(service.get(book.id).title).toBe("Bel-Ami");
  });

  it("met à jour les seuls champs fournis", () => {
    const service = new BooksService(new BooksRepository());
    const id = BOOKS[0]?.id ?? "";
    expect(service.update(id, { status: "loaned" })).toMatchObject({
      title: "Les Misérables",
      status: "loaned",
    });
  });

  it("lève une 404 pour la mise à jour d'un livre inconnu", () => {
    const service = new BooksService(new BooksRepository());
    expect(() => service.update("inconnu", { title: "x" })).toThrow(NotFoundException);
  });
});
