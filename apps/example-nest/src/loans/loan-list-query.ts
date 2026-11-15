import { defineListQuery } from "@etiennea20/adr-misc/contract";

// Contrat de la liste des emprunts : le filtre du client s'ajoute au périmètre des permissions.
export const loanListQuery = defineListQuery({
  fields: {
    status: { type: "enum", values: ["active", "returned", "cancelled"], filter: true },
    dueAt: { type: "date", filter: true, sort: true },
  },
  defaults: { sort: [{ field: "dueAt", direction: "asc" }], pageSize: 20 },
});
