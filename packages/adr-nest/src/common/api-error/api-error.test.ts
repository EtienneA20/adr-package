import * as contract from "@etiennea20/adr-misc/contract";
import { describe, expect, expectTypeOf, it } from "vitest";

import {
  API_ERROR_CONTENT_TYPE,
  EApiErrorCode,
  type IApiError,
  type IApiErrorIssue,
} from "./api-error";

/**
 * Le format d'erreur est reproduit dans adr-nest (l'entrée principale ne dépend pas
 * d'adr-misc) : ces tests empêchent les deux copies de diverger.
 */
describe("format d'erreur d'API", () => {
  it("a les mêmes codes qu'adr-misc", () => {
    expect(EApiErrorCode).toEqual(contract.EApiErrorCode);
    expectTypeOf<EApiErrorCode>().toEqualTypeOf<contract.EApiErrorCode>();
  });

  it("a le même type de média qu'adr-misc", () => {
    expect(API_ERROR_CONTENT_TYPE).toBe(contract.API_ERROR_CONTENT_TYPE);
  });

  it("a la même forme que ApiError et ApiErrorIssue d'adr-misc", () => {
    expectTypeOf<IApiError>().toEqualTypeOf<contract.ApiError>();
    expectTypeOf<IApiErrorIssue>().toEqualTypeOf<contract.ApiErrorIssue>();
  });

  it("produit un corps que le front relit avec apiErrorSchema", () => {
    const body: IApiError = {
      type: "about:blank",
      title: "Données invalides",
      status: 400,
      code: EApiErrorCode.VALIDATION_FAILED,
      errors: [{ path: "title", message: "Champ requis" }],
    };
    expect(contract.apiErrorSchema.parse(body)).toEqual(body);
  });
});
