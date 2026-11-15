import { definePermissions } from "@etiennea20/adr-nest";

// #region permissions
// Règles sérialisables (aucune fonction) : elles pourront être envoyées telles quelles au front.
export const permissions = definePermissions({
  roles: {
    // Le bibliothécaire gère tout : livres, emprunts, exports.
    librarian: [{ action: "manage", resource: "all" }],
    // L'adhérent consulte ses emprunts et n'annule que ceux qui sont en cours.
    member: [
      { action: "read", resource: "loan", where: { memberId: "$subject.id" } },
      { action: "cancel", resource: "loan", where: { memberId: "$subject.id", status: "active" } },
    ],
  },
});
// #endregion permissions
