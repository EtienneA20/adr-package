import {
  type CallHandler,
  type ExecutionContext,
  ForbiddenException,
  HttpCode,
  Logger,
} from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
import { Test } from "@nestjs/testing";
import { lastValueFrom, of, throwError } from "rxjs";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { RequestLoggingInterceptor } from "./request-logging-interceptor";

class LoansController {
  list(): string {
    return "";
  }

  @HttpCode(204)
  remove(): void {
    return undefined;
  }
}

interface IRequest {
  method: string;
  url: string;
  headers: Record<string, string>;
}

const adapter = {
  getRequestMethod: (request: IRequest) => request.method,
  getRequestUrl: (request: IRequest) => request.url,
  setHeader: vi.fn(),
};

function contextFor(
  request: IRequest,
  handler: () => unknown = LoansController.prototype.list,
  type = "http",
): ExecutionContext {
  return {
    getType: () => type,
    getHandler: () => handler,
    switchToHttp: () => ({ getRequest: () => request, getResponse: () => ({}) }),
  } as unknown as ExecutionContext;
}

function request(method: string, url = "/emprunts?filter=secret"): IRequest {
  return { method, url, headers: { "x-request-id": "req-7" } };
}

async function createInterceptor(): Promise<RequestLoggingInterceptor> {
  const moduleRef = await Test.createTestingModule({
    providers: [
      RequestLoggingInterceptor,
      { provide: HttpAdapterHost, useValue: { httpAdapter: adapter } },
    ],
  }).compile();
  return moduleRef.get(RequestLoggingInterceptor);
}

const handled = (value: unknown): CallHandler => ({ handle: () => of(value) });
const failed = (error: unknown): CallHandler => ({ handle: () => throwError(() => error) });

describe("RequestLoggingInterceptor", () => {
  let log: ReturnType<typeof vi.spyOn>;
  let warn: ReturnType<typeof vi.spyOn>;
  let error: ReturnType<typeof vi.spyOn>;
  let interceptor: RequestLoggingInterceptor;

  // Le module de test est compilé avant les espions : NestJS journalise son initialisation.
  beforeEach(async () => {
    interceptor = await createInterceptor();
    log = vi.spyOn(Logger.prototype, "log").mockImplementation(() => undefined);
    warn = vi.spyOn(Logger.prototype, "warn").mockImplementation(() => undefined);
    error = vi.spyOn(Logger.prototype, "error").mockImplementation(() => undefined);
    vi.spyOn(performance, "now").mockReturnValueOnce(100).mockReturnValueOnce(112.4);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    adapter.setHeader.mockClear();
  });

  it("journalise une ligne par requête réussie, sans paramètres d'URL", async () => {
    const result = interceptor.intercept(contextFor(request("GET")), handled(["emprunt-1"]));

    await expect(lastValueFrom(result)).resolves.toEqual(["emprunt-1"]);
    expect(log).toHaveBeenCalledWith("GET /emprunts 200 12 ms [req-7]");
    expect(adapter.setHeader).toHaveBeenCalledWith({}, "x-request-id", "req-7");
  });

  it("utilise le statut de succès de la route (201 pour POST, @HttpCode)", async () => {
    await lastValueFrom(
      interceptor.intercept(contextFor(request("POST", "/emprunts")), handled(1)),
    );
    expect(log).toHaveBeenLastCalledWith(expect.stringMatching(/^POST \/emprunts 201 /));

    await lastValueFrom(
      interceptor.intercept(
        contextFor(request("DELETE", "/emprunts/1"), LoansController.prototype.remove),
        handled(undefined),
      ),
    );
    expect(log).toHaveBeenLastCalledWith(expect.stringMatching(/^DELETE \/emprunts\/1 204 /));
  });

  it("journalise une erreur 4xx en warn et une erreur inattendue en error", async () => {
    await expect(
      lastValueFrom(
        interceptor.intercept(contextFor(request("GET")), failed(new ForbiddenException())),
      ),
    ).rejects.toBeInstanceOf(ForbiddenException);
    expect(warn).toHaveBeenCalledWith(expect.stringMatching(/^GET \/emprunts 403 .* \[req-7\]$/));

    await expect(
      lastValueFrom(interceptor.intercept(contextFor(request("GET")), failed(new Error("x")))),
    ).rejects.toThrow("x");
    expect(error).toHaveBeenCalledWith(expect.stringMatching(/^GET \/emprunts 500 /));
  });

  it("laisse passer les contextes non HTTP sans journaliser", async () => {
    const result = interceptor.intercept(
      contextFor(request("GET"), LoansController.prototype.list, "rpc"),
      handled("ok"),
    );

    await expect(lastValueFrom(result)).resolves.toBe("ok");
    expect(log).not.toHaveBeenCalled();
  });
});
