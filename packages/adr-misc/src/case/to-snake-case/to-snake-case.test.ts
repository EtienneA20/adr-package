import { describe, expect, it } from "vitest";

import { toSnakeCase } from "./to-snake-case";

describe("toSnakeCase", () => {
  it.each([
    ["dateDeRetour", "date_de_retour"],
    ["DateDeRetour", "date_de_retour"],
    ["date-de-retour", "date_de_retour"],
    ["userID", "user_id"],
    ["XMLHttpRequest", "xml_http_request"],
  ])("convertit « %s » en « %s »", (value, expected) => {
    expect(toSnakeCase(value)).toBe(expected);
  });

  it("conserve les accents et les ligatures", () => {
    expect(toSnakeCase("Prénom de l’adhérent")).toBe("prénom_de_l_adhérent");
  });

  it("renvoie une chaîne vide pour un texte sans mot", () => {
    expect(toSnakeCase("")).toBe("");
    expect(toSnakeCase(" -_ ")).toBe("");
  });
});
