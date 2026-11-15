import { describe, expect, it } from "vitest";

import { validatePermissions } from "./validate-permissions";

function issuesOf(rule: unknown): string[] {
  return validatePermissions({ roles: { member: [rule] } });
}

describe("validatePermissions", () => {
  it("accepte une définition valide, références au sujet et listes comprises", () => {
    expect(
      validatePermissions({
        roles: {
          librarian: [{ action: "manage", resource: "all" }],
          member: [
            { action: ["read", "cancel"], resource: "loan", where: { memberId: "$subject.id" } },
            { action: "read", resource: ["book", "author"], where: { "library.id": [1, 2] } },
            { action: "read", resource: "event", where: { open: true, tenant: "$subject.org.id" } },
          ],
        },
      }),
    ).toEqual([]);
  });

  it("refuse une définition qui n'est pas { roles: {…} }", () => {
    expect(validatePermissions(null)).toHaveLength(1);
    expect(validatePermissions({ roles: [] })).toHaveLength(1);
    expect(validatePermissions({})).toHaveLength(1);
  });

  it("refuse un rôle mal nommé ou dont les règles ne forment pas une liste", () => {
    expect(validatePermissions({ roles: { " ": [] } })).toEqual([
      "roles.  : nom de rôle invalide.",
    ]);
    expect(validatePermissions(JSON.parse('{"roles":{"__proto__":[]}}'))).toEqual([
      "roles.__proto__ : nom de rôle invalide.",
    ]);
    expect(validatePermissions({ roles: { member: {} } })).toEqual([
      "roles.member : les règles d'un rôle forment une liste.",
    ]);
  });

  it("refuse une règle qui n'est pas un objet ou qui a une propriété inconnue", () => {
    expect(issuesOf("read")).toEqual(["roles.member[0] : une règle doit être un objet."]);
    expect(issuesOf({ action: "read", resource: "loan", wher: {} })).toEqual([
      "roles.member[0] : propriété « wher » inconnue.",
    ]);
  });

  it("refuse une action ou une ressource absente, vide ou non textuelle", () => {
    expect(issuesOf({ resource: "loan" })).toEqual([
      "roles.member[0] : « action » doit être un texte ou une liste non vide de textes.",
    ]);
    expect(issuesOf({ action: [], resource: "loan" })).toHaveLength(1);
    expect(issuesOf({ action: "read", resource: ["loan", " "] })).toEqual([
      "roles.member[0] : « resource » ne peut contenir que des textes non vides.",
    ]);
    expect(issuesOf({ action: [1], resource: "loan" })).toHaveLength(1);
  });

  it("refuse un where qui n'est pas un objet ou un chemin de champ invalide", () => {
    expect(issuesOf({ action: "read", resource: "loan", where: [] })).toEqual([
      "roles.member[0] : « where » doit être un objet.",
    ]);
    expect(issuesOf({ action: "read", resource: "loan", where: { "a..b": 1 } })).toEqual([
      "roles.member[0].where.a..b : chemin de champ invalide.",
    ]);
    expect(
      issuesOf({ action: "read", resource: "loan", where: { "owner.constructor": 1 } }),
    ).toHaveLength(1);
  });

  it("refuse une valeur non sérialisable ou une référence mal écrite", () => {
    const where = (value: unknown): string[] =>
      issuesOf({ action: "read", resource: "loan", where: { memberId: value } });

    expect(where(null)).toHaveLength(1);
    expect(where(Number.NaN)).toHaveLength(1);
    expect(where({ $eq: 1 })).toHaveLength(1);
    expect(where("$subjet.id")).toEqual([
      'roles.member[0].where.memberId : référence « $subjet.id » invalide (attendu : "$subject.<chemin>").',
    ]);
    expect(where("$subject.")).toHaveLength(1);
    expect(where("$subject.__proto__")).toHaveLength(1);
  });

  it("refuse une liste vide ou imbriquée et vérifie chaque élément", () => {
    const where = (value: unknown): string[] =>
      issuesOf({ action: "read", resource: "loan", where: { status: value } });

    expect(where([])).toEqual(["roles.member[0].where.status : liste vide."]);
    expect(where([["a"]])).toEqual(["roles.member[0].where.status[0] : liste imbriquée."]);
    expect(where(["a", "$x"])).toEqual([
      'roles.member[0].where.status[1] : référence « $x » invalide (attendu : "$subject.<chemin>").',
    ]);
  });
});
