/** Livre du catalogue de la bibliothèque. */
export interface IBook {
  id: string;
  title: string;
  authorName: string;
  status: "available" | "loaned";
  publishedAt: string;
}

/** Catalogue de démonstration, chargé par le dépôt en mémoire. */
export const BOOKS: readonly IBook[] = [
  {
    id: "0b6f8c6e-1f3a-4c2e-9d4b-6a7e2f1c3d5e",
    title: "Les Misérables",
    authorName: "Victor Hugo",
    status: "available",
    publishedAt: "1862-04-03",
  },
  {
    id: "5d2a9c1b-7e4f-4a8d-b3c6-0f1e2d3c4b5a",
    title: "Dune",
    authorName: "Frank Herbert",
    status: "loaned",
    publishedAt: "1965-08-01",
  },
  {
    id: "9e8d7c6b-5a4f-4e3d-a2c1-b0a9f8e7d6c5",
    title: "Germinal",
    authorName: "Émile Zola",
    status: "available",
    publishedAt: "1885-03-02",
  },
];
