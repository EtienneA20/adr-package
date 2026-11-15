/** Emprunt d'un livre par un adhérent. */
export interface ILoan {
  id: string;
  bookId: string;
  memberId: string;
  status: "active" | "returned" | "cancelled";
  dueAt: string;
}

/** Emprunts de démonstration, chargés par le dépôt en mémoire. */
export const LOANS: readonly ILoan[] = [
  {
    id: "emprunt-1",
    bookId: "5d2a9c1b-7e4f-4a8d-b3c6-0f1e2d3c4b5a",
    memberId: "adherent-1",
    status: "active",
    dueAt: "2026-12-01",
  },
  {
    id: "emprunt-2",
    bookId: "9e8d7c6b-5a4f-4e3d-a2c1-b0a9f8e7d6c5",
    memberId: "adherent-2",
    status: "active",
    dueAt: "2026-11-20",
  },
  {
    id: "emprunt-3",
    bookId: "0b6f8c6e-1f3a-4c2e-9d4b-6a7e2f1c3d5e",
    memberId: "adherent-1",
    status: "returned",
    dueAt: "2026-10-15",
  },
];
