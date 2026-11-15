import {
  BadRequestException,
  ConflictException,
  HttpException,
  NotFoundException,
  ServiceUnavailableException,
} from "@nestjs/common";
import { describe, expect, it } from "vitest";

import { ApiException } from "../api-exception";
import { toApiError } from "./to-api-error";

describe("toApiError", () => {
  it("reprend tel quel le corps d'une ApiException", () => {
    const exception = new ApiException({
      status: 409,
      code: "LOAN_LIMIT",
      title: "Trop d'emprunts",
    });
    expect(toApiError(exception)).toEqual(exception.getResponse());
  });

  it("traduit une HttpException : code et titre français, message personnalisé en detail", () => {
    expect(toApiError(new NotFoundException("Livre « x » introuvable."))).toEqual({
      type: "about:blank",
      title: "Ressource introuvable",
      status: 404,
      code: "NOT_FOUND",
      detail: "Livre « x » introuvable.",
    });
  });

  it("n'ajoute pas le message par défaut de NestJS en detail", () => {
    expect(toApiError(new ConflictException())).toEqual({
      type: "about:blank",
      title: "Conflit",
      status: 409,
      code: "CONFLICT",
    });
  });

  it("place une liste de messages (ancien pipe de validation) dans errors", () => {
    const body = toApiError(
      new BadRequestException(["title is required", "year must be a number"]),
    );
    expect(body).toMatchObject({ status: 400, code: "BAD_REQUEST" });
    expect(body.errors).toEqual([
      { path: "", message: "title is required" },
      { path: "", message: "year must be a number" },
    ]);
  });

  it("déduit un code pour les statuts sans correspondance", () => {
    expect(toApiError(new HttpException("Trop de requêtes", 429))).toMatchObject({
      title: "Trop de requêtes",
      code: "BAD_REQUEST",
    });
    expect(toApiError(new HttpException({ reason: "x" }, 418))).toEqual({
      type: "about:blank",
      title: "Requête refusée",
      status: 418,
      code: "BAD_REQUEST",
    });
    expect(toApiError(new ServiceUnavailableException())).toMatchObject({
      status: 503,
      code: "INTERNAL_ERROR",
      title: "Service indisponible",
    });
    expect(toApiError(new HttpException("x", 507))).toMatchObject({ title: "Erreur du serveur" });
  });

  it("masque toute autre erreur derrière une 500 sans son message", () => {
    const body = toApiError(new Error("SELECT * FROM users WHERE password = 'secret'"));
    expect(body).toMatchObject({ status: 500, code: "INTERNAL_ERROR", title: "Erreur interne" });
    expect(JSON.stringify(body)).not.toContain("secret");
    expect(toApiError("chaîne levée")).toMatchObject({ status: 500 });
  });
});
