// #region contract
import { defineListQuery } from "@etiennea20/adr-misc/contract";

// Contrat de la liste des livres, partagé avec le front (TanStack Router `validateSearch`,
// appel d'API) : liste blanche des champs et de ce que le client peut en faire.
export const bookListQuery = defineListQuery({
  fields: {
    id: { type: "uuid", filter: ["eq", "in"], select: true },
    title: { type: "string", filter: true, sort: true, select: true, search: true },
    authorName: { type: "string", filter: ["eq", "contains"], sort: true, search: true },
    status: { type: "enum", values: ["available", "loaned"], filter: true, select: true },
    publishedAt: { type: "date", filter: true, sort: true, select: true },
  },
  defaults: { sort: [{ field: "title", direction: "asc" }], pageSize: 20 },
});
// #endregion contract
