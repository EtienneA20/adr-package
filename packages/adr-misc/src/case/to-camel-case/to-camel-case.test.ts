import { describe, expect, it } from "vitest";

import { toCamelCase } from "./to-camel-case";

describe("toCamelCase", () => {
  it.each([
    ["date_de_retour", "dateDeRetour"],
    ["date-de-retour", "dateDeRetour"],
    ["Date de retour", "dateDeRetour"],
    ["DateDeRetour", "dateDeRetour"],
    ["DATE_DE_RETOUR", "dateDeRetour"],
    ["XMLHttpRequest", "xmlHttpRequest"],
    ["user ID", "userId"],
    ["tome 2 partie", "tome2Partie"],
    ["  --déjà__vu  ", "déjàVu"],
  ])("convertit « %s » en « %s »", (value, expected) => {
    expect(toCamelCase(value)).toBe(expected);
  });

  it("conserve les accents et les ligatures", () => {
    expect(toCamelCase("Prénom de l’adhérent")).toBe("prénomDeLAdhérent");
    expect(toCamelCase("cœur élève")).toBe("cœurÉlève");
  });

  it("renvoie une chaîne vide pour un texte sans mot", () => {
    expect(toCamelCase("")).toBe("");
    expect(toCamelCase(" -_ ")).toBe("");
  });
});
