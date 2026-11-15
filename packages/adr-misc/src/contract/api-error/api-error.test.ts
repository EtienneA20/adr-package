import { describe, expect, expectTypeOf, it } from "vitest";

import { EApiErrorCode } from "../api-error-code";
import {
  API_ERROR_CONTENT_TYPE,
  type ApiError,
  type ApiErrorIssue,
  apiErrorIssueSchema,
  apiErrorSchema,
} from "./api-error";

const forbidden = { title: "Accès refusé", status: 403, code: EApiErrorCode.FORBIDDEN };

describe("API_ERROR_CONTENT_TYPE", () => {
  it("vaut le type de média de la RFC 9457", () => {
    expect(API_ERROR_CONTENT_TYPE).toBe("application/problem+json");
  });
});

describe("apiErrorIssueSchema", () => {
  it("accepte un problème avec ou sans code", () => {
    expect(apiErrorIssueSchema.parse({ path: "title", message: "Requis" })).toEqual({
      path: "title",
      message: "Requis",
    });
    expect(
      apiErrorIssueSchema.parse({ path: "", message: "Trop de conditions", code: "X" }).code,
    ).toBe("X");
  });

  it("refuse un problème sans message", () => {
    expect(apiErrorIssueSchema.safeParse({ path: "title" }).success).toBe(false);
  });

  it("infère le type ApiErrorIssue", () => {
    expectTypeOf<ApiErrorIssue>().toEqualTypeOf<{
      path: string;
      message: string;
      code?: string | undefined;
    }>();
  });
});

describe("apiErrorSchema", () => {
  it("lit une erreur minimale et applique le type par défaut", () => {
    expect(apiErrorSchema.parse(forbidden)).toEqual({ ...forbidden, type: "about:blank" });
  });

  it("lit une erreur complète avec détail par champ et identifiant de corrélation", () => {
    const body = {
      type: "https://api.bibliotheque.fr/problems/validation",
      title: "Données invalides",
      status: 400,
      detail: "Le livre n'a pas pu être créé.",
      instance: "/livres",
      code: EApiErrorCode.VALIDATION_FAILED,
      errors: [{ path: "title", message: "Champ requis", code: "invalid_type" }],
      requestId: "f0c8e1d2",
    };
    expect(apiErrorSchema.parse(body)).toEqual(body);
  });

  it("accepte un code propre à l'application", () => {
    expect(apiErrorSchema.parse({ ...forbidden, code: "LOAN_LIMIT_REACHED" }).code).toBe(
      "LOAN_LIMIT_REACHED",
    );
  });

  it("ignore les membres d'extension inconnus", () => {
    expect(apiErrorSchema.parse({ ...forbidden, balance: 30 })).not.toHaveProperty("balance");
  });

  it.each([99, 600, 403.5, "403"])("refuse le statut %j", (status) => {
    expect(apiErrorSchema.safeParse({ ...forbidden, status }).success).toBe(false);
  });

  it("refuse une erreur sans code ni titre", () => {
    const { error } = apiErrorSchema.safeParse({ status: 500 });
    expect(error?.issues.map((issue) => issue.path.join("."))).toEqual(["title", "code"]);
  });

  it("type le code avec les valeurs connues sans exclure les codes applicatifs", () => {
    expectTypeOf<ApiError["code"]>().toExtend<string>();
    expectTypeOf<EApiErrorCode>().toExtend<ApiError["code"]>();
  });
});
