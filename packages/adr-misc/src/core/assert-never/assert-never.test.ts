import { describe, expect, it } from "vitest";

import { assertNever } from "./assert-never";

type LoanStatus = "active" | "returned";

function getLabel(status: LoanStatus): string {
  switch (status) {
    case "active":
      return "En cours";
    case "returned":
      return "Rendu";
    default:
      return assertNever(status);
  }
}

describe("assertNever", () => {
  it("n'est pas atteint quand tous les cas sont traités", () => {
    expect(getLabel("active")).toBe("En cours");
    expect(getLabel("returned")).toBe("Rendu");
  });

  it("lève une erreur citant la valeur inattendue", () => {
    expect(() => getLabel("late" as LoanStatus)).toThrow(new Error('Valeur inattendue : "late"'));
  });

  it("cite les objets sous forme JSON", () => {
    expect(() => assertNever({ kind: "inconnu" } as never)).toThrow(
      'Valeur inattendue : {"kind":"inconnu"}',
    );
  });

  it("cite les valeurs non sérialisables en JSON", () => {
    expect(() => assertNever(undefined as never)).toThrow("Valeur inattendue : undefined");
  });

  it("décrit une valeur non sérialisable en JSON", () => {
    expect(() => assertNever(10n as never)).toThrow("Valeur inattendue : 10");
  });

  it("décrit une structure circulaire par son type", () => {
    const value: Record<string, unknown> = {};
    value.self = value;
    expect(() => assertNever(value as never)).toThrow("Valeur inattendue : [object Object]");
  });

  it("utilise le message fourni", () => {
    expect(() => assertNever("x" as never, "Statut d'emprunt inconnu")).toThrow(
      new Error("Statut d'emprunt inconnu"),
    );
  });

  it("n'accepte qu'une valeur de type never", () => {
    expect(() => {
      // @ts-expect-error -- une chaîne n'est pas assignable à never
      assertNever("late");
    }).toThrow('Valeur inattendue : "late"');
  });
});
