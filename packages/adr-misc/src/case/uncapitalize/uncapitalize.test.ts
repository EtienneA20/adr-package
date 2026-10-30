import { describe, expect, it } from "vitest";

import { uncapitalize } from "./uncapitalize";

describe("uncapitalize", () => {
  it("met la première lettre en minuscule sans toucher au reste", () => {
    expect(uncapitalize("Supprimer le LIVRE")).toBe("supprimer le LIVRE");
    expect(uncapitalize("UserName")).toBe("userName");
  });

  it("gère les lettres accentuées et les ligatures", () => {
    expect(uncapitalize("Élève")).toBe("élève");
    expect(uncapitalize("Œuvre")).toBe("œuvre");
  });

  it("ignore la ponctuation et les espaces de tête", () => {
    expect(uncapitalize("« Bonjour »")).toBe("« bonjour »");
  });

  it("renvoie le texte tel quel s'il ne contient aucune lettre ni chiffre", () => {
    expect(uncapitalize("")).toBe("");
    expect(uncapitalize("— ?")).toBe("— ?");
  });
});
