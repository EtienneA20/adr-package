import { type ArgumentsHost, Logger, NotFoundException } from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
import { Test } from "@nestjs/testing";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ValidationException } from "../validation-exception";
import { ApiExceptionFilter } from "./api-exception-filter";

interface IFakeAdapter {
  headersSent: boolean;
  getRequestUrl: (request: { url: string }) => string;
  isHeadersSent: () => boolean;
  setHeader: ReturnType<typeof vi.fn>;
  reply: ReturnType<typeof vi.fn>;
  end: ReturnType<typeof vi.fn>;
}

function fakeAdapter(): IFakeAdapter {
  const adapter: IFakeAdapter = {
    headersSent: false,
    getRequestUrl: (request) => request.url,
    isHeadersSent: () => adapter.headersSent,
    setHeader: vi.fn(),
    reply: vi.fn(),
    end: vi.fn(),
  };
  return adapter;
}

async function createFilter(adapter: IFakeAdapter): Promise<ApiExceptionFilter> {
  const moduleRef = await Test.createTestingModule({
    providers: [
      ApiExceptionFilter,
      { provide: HttpAdapterHost, useValue: { httpAdapter: adapter } },
    ],
  }).compile();
  return moduleRef.get(ApiExceptionFilter);
}

function hostFor(request: object, type = "http"): ArgumentsHost {
  return {
    getType: () => type,
    switchToHttp: () => ({ getRequest: () => request, getResponse: () => ({}) }),
  } as unknown as ArgumentsHost;
}

const request = { url: "/livres/42?token=secret", headers: { "x-request-id": "req-1" } };

describe("ApiExceptionFilter", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("répond au format d'erreur d'API, avec instance et requestId", async () => {
    const adapter = fakeAdapter();
    (await createFilter(adapter)).catch(
      new NotFoundException("Livre introuvable."),
      hostFor(request),
    );

    expect(adapter.reply).toHaveBeenCalledWith(
      {},
      {
        type: "about:blank",
        title: "Ressource introuvable",
        status: 404,
        code: "NOT_FOUND",
        detail: "Livre introuvable.",
        instance: "/livres/42",
        requestId: "req-1",
      },
      404,
    );
    expect(adapter.setHeader).toHaveBeenCalledWith({}, "Content-Type", "application/problem+json");
    expect(adapter.setHeader).toHaveBeenCalledWith({}, "x-request-id", "req-1");
  });

  it("reprend le corps d'une ApiException (erreurs par champ comprises)", async () => {
    const adapter = fakeAdapter();
    const exception = new ValidationException([{ message: "Requis", path: ["title"] }]);
    (await createFilter(adapter)).catch(exception, hostFor({ url: "/livres" }));

    expect(adapter.reply).toHaveBeenCalledWith(
      {},
      expect.objectContaining({
        code: "VALIDATION_FAILED",
        errors: [{ path: "title", message: "Requis" }],
        instance: "/livres",
      }),
      400,
    );
  });

  it("masque une erreur inattendue et la journalise avec sa pile", async () => {
    const logged = vi.spyOn(Logger.prototype, "error").mockImplementation(() => undefined);
    const adapter = fakeAdapter();
    (await createFilter(adapter)).catch(new Error("mot de passe : hunter2"), hostFor(request));

    const [, body, status] = adapter.reply.mock.calls[0] as [unknown, object, number];
    expect(status).toBe(500);
    expect(JSON.stringify(body)).not.toContain("hunter2");
    expect(logged).toHaveBeenCalledWith(
      "500 /livres/42 [req-1]",
      expect.stringContaining("mot de passe : hunter2"),
    );
  });

  it("journalise une valeur levée qui n'est pas une Error", async () => {
    const logged = vi.spyOn(Logger.prototype, "error").mockImplementation(() => undefined);
    (await createFilter(fakeAdapter())).catch("panne", hostFor(request));

    expect(logged).toHaveBeenCalledWith("500 /livres/42 [req-1]", "panne");
  });

  it("clôt la réponse si l'envoi a déjà commencé (export en flux)", async () => {
    vi.spyOn(Logger.prototype, "error").mockImplementation(() => undefined);
    const adapter = fakeAdapter();
    adapter.headersSent = true;
    (await createFilter(adapter)).catch(new Error("coupure"), hostFor(request));

    expect(adapter.end).toHaveBeenCalledOnce();
    expect(adapter.reply).not.toHaveBeenCalled();
  });

  it("relance l'exception hors contexte HTTP", async () => {
    const filter = await createFilter(fakeAdapter());
    const error = new Error("rpc");

    expect(() => {
      filter.catch(error, hostFor(request, "rpc"));
    }).toThrow(error);
  });
});
