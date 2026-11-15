import { HttpException } from "@nestjs/common";
import { describe, expect, it } from "vitest";

import { ApiException } from "./api-exception";

describe("ApiException", () => {
  const exception = new ApiException({
    status: 409,
    code: "LOAN_LIMIT_REACHED",
    title: "Nombre maximal d'emprunts atteint",
    detail: "Un adhérent ne peut pas emprunter plus de 5 livres.",
  });

  it("est une HttpException avec le statut donné", () => {
    expect(exception).toBeInstanceOf(HttpException);
    expect(exception.getStatus()).toBe(409);
  });

  it("produit un corps RFC 9457 avec le code", () => {
    expect(exception.getResponse()).toEqual({
      type: "about:blank",
      title: "Nombre maximal d'emprunts atteint",
      status: 409,
      code: "LOAN_LIMIT_REACHED",
      detail: "Un adhérent ne peut pas emprunter plus de 5 livres.",
    });
    expect(exception.code).toBe("LOAN_LIMIT_REACHED");
  });

  it("utilise le détail, ou à défaut le titre, comme message", () => {
    expect(exception.message).toBe("Un adhérent ne peut pas emprunter plus de 5 livres.");
    expect(new ApiException({ status: 404, code: "NOT_FOUND", title: "Introuvable" }).message).toBe(
      "Introuvable",
    );
  });

  it("transmet le type, les problèmes par champ et la cause", () => {
    const cause = new Error("contrainte unique");
    const withErrors = new ApiException({
      status: 400,
      code: "VALIDATION_FAILED",
      title: "Données invalides",
      type: "https://api.bibliotheque.fr/problems/validation",
      errors: [{ path: "isbn", message: "ISBN déjà utilisé" }],
      cause,
    });
    expect(withErrors.getResponse()).toMatchObject({
      type: "https://api.bibliotheque.fr/problems/validation",
      errors: [{ path: "isbn", message: "ISBN déjà utilisé" }],
    });
    expect(withErrors.cause).toBe(cause);
  });

  it("renvoie une copie du corps : le modifier ne modifie pas l'exception", () => {
    const withErrors = new ApiException({
      status: 400,
      code: "VALIDATION_FAILED",
      title: "Données invalides",
      errors: [{ path: "title", message: "Requis" }],
    });
    const body = withErrors.getResponse();
    body.title = "modifié";
    body.errors?.push({ path: "x", message: "y" });
    expect(withErrors.getResponse()).toMatchObject({ title: "Données invalides" });
    expect(withErrors.getResponse().errors).toHaveLength(1);
  });
});
