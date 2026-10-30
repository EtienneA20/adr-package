import { describe, expect, it } from "vitest";

import { formatFullName } from "./format-full-name";

describe("formatFullName", () => {
  it("écrit le prénom capitalisé puis le nom en majuscules", () => {
    expect(formatFullName({ firstName: "marie", lastName: "Dupont" })).toBe("Marie DUPONT");
    expect(formatFullName({ firstName: "ÉLODIE", lastName: "lefèvre" })).toBe("Élodie LEFÈVRE");
  });

  it("capitalise chaque partie d'un prénom composé", () => {
    expect(formatFullName({ firstName: "jean-pierre" })).toBe("Jean-Pierre");
    expect(formatFullName({ firstName: "marie ève" })).toBe("Marie Ève");
    expect(formatFullName({ firstName: "d'artagnan" })).toBe("D'Artagnan");
  });

  it("normalise les espaces", () => {
    expect(formatFullName({ firstName: "  marie   claire ", lastName: " de   La Fontaine " })).toBe(
      "Marie Claire DE LA FONTAINE",
    );
  });

  it("place le nom en premier sur demande", () => {
    expect(formatFullName({ firstName: "Marie", lastName: "Curie" }, { order: "lastFirst" })).toBe(
      "CURIE Marie",
    );
  });

  it("conserve la casse du nom sur demande", () => {
    expect(
      formatFullName(
        { firstName: "jean", lastName: " de La  Fontaine" },
        { uppercaseLastName: false },
      ),
    ).toBe("Jean de La Fontaine");
  });

  it("omet un prénom ou un nom absent", () => {
    expect(formatFullName({ lastName: "Dupont" })).toBe("DUPONT");
    expect(formatFullName({ firstName: null, lastName: "Dupont" }, { order: "lastFirst" })).toBe(
      "DUPONT",
    );
    expect(formatFullName({ firstName: "Marie", lastName: "  " })).toBe("Marie");
    expect(formatFullName({})).toBe("");
  });
});
