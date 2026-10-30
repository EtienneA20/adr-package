import { describe, expect, it } from "vitest";

import { getReadableTextColor } from "./get-readable-text-color";

describe("getReadableTextColor", () => {
  it("choisit le blanc sur un fond foncé", () => {
    expect(getReadableTextColor("#2563eb")).toBe("#ffffff");
    expect(getReadableTextColor("#000")).toBe("#ffffff");
  });

  it("choisit le noir sur un fond clair", () => {
    expect(getReadableTextColor("#fde047")).toBe("#000000");
    expect(getReadableTextColor("#fff")).toBe("#000000");
  });

  it("renvoie les couleurs candidates fournies, telles quelles", () => {
    const options = { light: "#F8FAFC", dark: "#0f172a" };
    expect(getReadableTextColor("#2563eb", options)).toBe("#F8FAFC");
    expect(getReadableTextColor("#fde047", options)).toBe("#0f172a");
  });

  it("complète une seule candidate par la valeur par défaut", () => {
    expect(getReadableTextColor("#fde047", { light: "#f8fafc" })).toBe("#000000");
    expect(getReadableTextColor("#2563eb", { dark: "#0f172a" })).toBe("#ffffff");
  });

  it("retient la couleur sombre en cas d'égalité", () => {
    expect(getReadableTextColor("#2563eb", { light: "#777", dark: "#777777" })).toBe("#777777");
  });

  it("lève une erreur si le fond ou une candidate est invalide", () => {
    expect(() => getReadableTextColor("bleu")).toThrow("Couleur hexadécimale invalide");
    expect(() => getReadableTextColor("#fff", { light: "blanc" })).toThrow(
      "Couleur hexadécimale invalide",
    );
  });
});
