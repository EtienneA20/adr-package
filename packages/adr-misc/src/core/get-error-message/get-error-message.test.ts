import { describe, expect, it } from "vitest";

import { getErrorMessage } from "./get-error-message";

describe("getErrorMessage", () => {
  it("renvoie le message d'une instance d'Error", () => {
    expect(getErrorMessage(new TypeError("Livre indisponible"))).toBe("Livre indisponible");
  });

  it("renvoie une chaîne levée telle quelle", () => {
    expect(getErrorMessage("Adhérent suspendu")).toBe("Adhérent suspendu");
  });

  it("renvoie la propriété message d'un objet", () => {
    expect(getErrorMessage({ message: "Quota atteint", status: 429 })).toBe("Quota atteint");
  });

  it.each([42, null, undefined, true, { code: 500 }, { message: 12 }])(
    "renvoie le message par défaut pour %j",
    (value) => {
      expect(getErrorMessage(value)).toBe("Une erreur inconnue est survenue.");
    },
  );

  it.each(["", "   ", new Error(""), { message: " " }])(
    "renvoie le message de repli quand le message est vide (%j)",
    (value) => {
      expect(getErrorMessage(value, "Erreur réseau")).toBe("Erreur réseau");
    },
  );

  it("utilise le message de repli fourni", () => {
    expect(getErrorMessage(undefined, "Impossible d'emprunter ce livre.")).toBe(
      "Impossible d'emprunter ce livre.",
    );
  });
});
