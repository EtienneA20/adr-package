import { describe, expect, it } from "vitest";

import { isEmail } from "./is-email";

describe("isEmail", () => {
  it.each([
    "lecteur@bibliotheque.fr",
    "jean.dupont+prets@mairie-paris.gouv.fr",
    "A_B-c@sub.domaine.co.uk",
    "x@y.io",
  ])("accepte l'adresse valide %s", (value) => {
    expect(isEmail(value)).toBe(true);
  });

  it.each([
    "",
    "lecteur",
    "lecteur@",
    "@bibliotheque.fr",
    "lecteur@bibliotheque",
    "lecteur@bibliotheque.f",
    ".lecteur@bibliotheque.fr",
    "lecteur.@bibliotheque.fr",
    "lecteur..dupont@bibliotheque.fr",
    "lecteur@-bibliotheque.fr",
    "lecteur@bibliotheque-.fr",
    "lecteur@bibliotheque..fr",
    "lec teur@bibliotheque.fr",
    " lecteur@bibliotheque.fr",
    "lecteur@biblio@theque.fr",
  ])("refuse l'adresse invalide %j", (value) => {
    expect(isEmail(value)).toBe(false);
  });

  it("refuse une partie locale de plus de 64 caractères", () => {
    expect(isEmail(`${"a".repeat(64)}@b.fr`)).toBe(true);
    expect(isEmail(`${"a".repeat(65)}@b.fr`)).toBe(false);
  });

  it("refuse une adresse de plus de 254 caractères", () => {
    const domain = `${"d".repeat(63)}.${"e".repeat(63)}.${"f".repeat(63)}.${"g".repeat(63)}.fr`;
    expect(isEmail(`a@${domain}`)).toBe(false);
  });
});
